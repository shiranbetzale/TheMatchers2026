const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    matchWith: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    status: {
      type: String,
      enum: ['new', 'notified', 'contacted', 'declined', 'matched'],
      default: 'new',
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notes: { type: String, trim: true },
    notified: { type: Boolean, default: false },
    notifiedAt: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Match', matchSchema);
