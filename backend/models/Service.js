const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  services: {
    type: [String],
    required: [true, 'At least one service is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one service must be provided'
    }
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    enum: [
      'Technology',
      'Legal',
      'Marketing',
      'Finance',
      'Human Resources',
      'Manufacturing',
      'Healthcare',
      'Creative',
      'Real Estate'
    ]
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  companySize: {
    type: String,
    required: [true, 'Company size is required'],
    enum: ['Small', 'Medium', 'Large']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  verified: {
    type: Boolean,
    default: false
  },
  website: {
    type: String,
    trim: true
  },
  quoteUrl: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    trim: true
  },
  founded: {
    type: String,
    trim: true
  },
  employees: {
    type: String,
    trim: true
  },
  certifications: {
    type: [String],
    default: []
  },
  linkedin: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for search performance
serviceSchema.index({ companyName: 'text', description: 'text', services: 'text' });
serviceSchema.index({ industry: 1 });
serviceSchema.index({ companySize: 1 });
serviceSchema.index({ verified: 1 });

module.exports = mongoose.model('Service', serviceSchema);
