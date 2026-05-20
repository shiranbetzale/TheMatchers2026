const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true },
    email: { type: String, trim: true, lowercase: true },
    gender: { type: String, enum: ['male', 'female'], required: false },
    city: { type: String, trim: true },
    age: { type: Number },
    preferences: {
      type: Object,
      default: {},
    },
    notes: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
    archivedReason: { type: String, enum: ['married', 'other'], required: false },
    assignedMatchmaker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Profile', profileSchema);
