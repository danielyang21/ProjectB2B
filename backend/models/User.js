const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  picture: {
    type: String
  },
  matches: [{
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    matchedAt: {
      type: Date,
      default: Date.now
    },
    matchScore: Number,
    matchReason: String
  }],
  passedCompanies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  preferences: {
    prompt: String,
    serviceType: String,
    companySize: String,
    budget: String,
    priority: String,
    industry: String,
    type: String // 'ai-prompt' or 'quiz'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
