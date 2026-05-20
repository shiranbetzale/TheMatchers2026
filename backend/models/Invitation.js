const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    assignedMatchmaker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'claimed', 'expired'], default: 'pending' },
    expiresAt: { type: Date },
    claimedByProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  },
  { timestamps: true },
);

invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Invitation', invitationSchema);
