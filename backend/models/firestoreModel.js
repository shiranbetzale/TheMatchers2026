const {getFirestore} = require('../config/firebase');

const MODEL_REGISTRY = {};

function toMillis(value) {
  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  if (typeof value.toDate === 'function') return value.toDate().getTime();
  return new Date(value).getTime();
}

function normalizeValue(value) {
  if (value instanceof Date) {
    return value;
  }

  if (value && typeof value.toDate === 'function') {
    return value.toDate();
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nextValue]) => [
        key,
        normalizeValue(nextValue),
      ]),
    );
  }

  return value;
}

function sanitizeData(data) {
  return Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, normalizeValue(value)]),
  );
}

function createDuplicateError(field) {
  const error = new Error(`${field} is already in use`);
  error.code = 11000;
  error.keyPattern = {[field]: 1};
  return error;
}

function isMatch(data, query = {}) {
  return Object.entries(query).every(([key, expected]) => {
    if (key === '$or' && Array.isArray(expected)) {
      return expected.some(nextQuery => isMatch(data, nextQuery));
    }

    const actual = data[key];

    if (expected && typeof expected === 'object' && !Array.isArray(expected)) {
      if ('$in' in expected) {
        return expected.$in.map(String).includes(String(actual));
      }
    }

    return String(actual) === String(expected);
  });
}

class FirestoreQuery {
  constructor(model, {query = {}, id, single = false} = {}) {
    this.model = model;
    this.query = query;
    this.id = id;
    this.single = single;
    this.sortSpec = null;
    this.selectSpec = null;
    this.populateSpecs = [];
  }

  sort(spec) {
    this.sortSpec = spec;
    return this;
  }

  select(spec) {
    this.selectSpec = spec;
    return this;
  }

  populate(spec) {
    this.populateSpecs.push(spec);
    return this;
  }

  async exec() {
    const result = this.single
      ? await this.model._findOne(this.query, this.id)
      : await this.model._findMany(this.query, this.sortSpec);

    const populated = await this.model._populate(result, this.populateSpecs);
    return this.model._applySelect(populated, this.selectSpec);
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }

  catch(reject) {
    return this.exec().catch(reject);
  }
}

class FirestoreDocument {
  constructor(data = {}, modelClass) {
    Object.assign(this, sanitizeData(data));
    this.constructorModel = modelClass || this.constructor;
  }

  get id() {
    return this._id;
  }

  toJSON() {
    const data = {...this};
    delete data.constructorModel;
    delete data.passwordHash;
    return data;
  }

  toObject() {
    return this.toJSON();
  }

  async save() {
    return this.constructorModel._saveDocument(this);
  }
}

function createFirestoreModel(collectionName, options = {}) {
  class Model extends FirestoreDocument {
    constructor(data = {}) {
      super({...options.defaults, ...data}, Model);
    }

    static get collectionName() {
      return collectionName;
    }

    static get collection() {
      return getFirestore().collection(collectionName);
    }

    static async _assertUnique(data, currentId) {
      const fields = options.uniqueFields || [];
      const cleanCurrentId = currentId ? String(currentId) : '';

      for (const field of fields) {
        if (!data[field]) {
          continue;
        }

        const snapshot = await this.collection
          .where(field, '==', data[field])
          .get();

        const duplicate = snapshot.docs.find(
          existing => String(existing.id) !== cleanCurrentId,
        );

        if (duplicate) {
          throw createDuplicateError(field);
        }
      }
    }

    static _fromSnapshot(doc) {
      if (!doc.exists) {
        return null;
      }

      return new this({
        ...normalizeValue(doc.data()),
        _id: doc.id,
      });
    }

    static async _saveDocument(document) {
      const now = new Date();
      const data = sanitizeData({...document});
      delete data.constructorModel;

      const id = data._id;
      delete data._id;

      await this._assertUnique(data, id);

      const ref = id ? this.collection.doc(id) : this.collection.doc();
      const nextData = {
        ...data,
        updatedAt: now,
        ...(id ? {} : {createdAt: data.createdAt || now}),
      };

      await ref.set(nextData, {merge: true});
      Object.assign(document, nextData, {_id: ref.id});
      return document;
    }

    static async create(data) {
      const document = new this(data);
      return document.save();
    }

    static find(query = {}) {
      return new FirestoreQuery(this, {query});
    }

    static findOne(query = {}) {
      return new FirestoreQuery(this, {query, single: true});
    }

    static findById(id) {
      return new FirestoreQuery(this, {id, single: true});
    }

    static async findByIdAndDelete(id) {
      const document = await this.findById(id);
      if (!document) {
        return null;
      }
      await this.collection.doc(id).delete();
      return document;
    }

    static async findOneAndUpdate(query, update = {}, options = {}) {
      const document = await this.findOne(query);
      if (!document) {
        if (!options.upsert) {
          return null;
        }
        return this.create({...query, ...update});
      }

      Object.assign(document, update);
      return document.save();
    }

    static async deleteOne(query = {}) {
      const document = await this.findOne(query);
      if (!document) {
        return {deletedCount: 0};
      }
      await this.collection.doc(document.id).delete();
      return {deletedCount: 1};
    }

    static async deleteMany(query = {}) {
      const documents = await this.find(query);
      await Promise.all(
        documents.map(document => this.collection.doc(document.id).delete()),
      );
      return {deletedCount: documents.length};
    }

    static async countDocuments(query = {}) {
      const documents = await this.find(query);
      return documents.length;
    }

    static async _findOne(query = {}, id) {
      if (id) {
        const snapshot = await this.collection.doc(String(id)).get();
        return this._fromSnapshot(snapshot);
      }

      const documents = await this._findMany(query);
      return documents[0] || null;
    }

    static async _findMany(query = {}, sortSpec = null) {
      const snapshot = await this.collection.get();
      let documents = snapshot.docs
        .map(doc => this._fromSnapshot(doc))
        .filter(Boolean)
        .filter(document => isMatch(document, query));

      if (sortSpec) {
        const [[field, direction]] = Object.entries(sortSpec);
        documents = documents.sort((a, b) => {
          const aValue = field.toLowerCase().includes('at')
            ? toMillis(a[field])
            : a[field];
          const bValue = field.toLowerCase().includes('at')
            ? toMillis(b[field])
            : b[field];

          if (aValue === bValue) return 0;
          return (aValue > bValue ? 1 : -1) * Number(direction || 1);
        });
      }

      return documents;
    }

    static async _populate(result, populateSpecs = []) {
      if (!populateSpecs.length || !result) {
        return result;
      }

      const documents = Array.isArray(result) ? result : [result];

      for (const spec of populateSpecs) {
        const path = typeof spec === 'string' ? spec : spec.path;
        const nested = typeof spec === 'object' ? spec.populate : null;
        const targetModel =
          MODEL_REGISTRY[path] ||
          (path === 'candidate' || path === 'matchWith'
            ? MODEL_REGISTRY.Profile
            : null) ||
          (path === 'assignedMatchmaker' || path === 'owner' || path === 'user'
            ? MODEL_REGISTRY.User
            : null);

        if (!targetModel || !path) {
          continue;
        }

        await Promise.all(
          documents.map(async document => {
            if (!document?.[path]) {
              return;
            }

            const populated =
              typeof document[path] === 'object'
                ? document[path]
                : await targetModel.findById(document[path]);
            document[path] = populated;

            if (populated && nested?.path) {
              const nestedModel =
                MODEL_REGISTRY[nested.path] ||
                (nested.path === 'assignedMatchmaker' ||
                nested.path === 'owner' ||
                nested.path === 'user'
                  ? MODEL_REGISTRY.User
                  : null);
              if (nestedModel && populated[nested.path]) {
                populated[nested.path] = await nestedModel.findById(
                  populated[nested.path],
                );
              }
            }
          }),
        );
      }

      return Array.isArray(result) ? documents : documents[0];
    }

    static _applySelect(result, selectSpec) {
      if (!selectSpec || !result) {
        return result;
      }

      const omitPassword =
        typeof selectSpec === 'string' && selectSpec.includes('-passwordHash');
      const values = Array.isArray(result) ? result : [result];
      if (omitPassword) {
        values.forEach(value => delete value.passwordHash);
      }
      return Array.isArray(result) ? values : values[0];
    }
  }

  MODEL_REGISTRY[options.modelName || collectionName] = Model;
  return Model;
}

module.exports = {
  createFirestoreModel,
};
