import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  phone: {
    type: Number,
    required: true
  },

  role: {
    type: String,
    enum: ['Manager', 'Member', 'Admin'],
    default: 'Member'
  },

  profileImage: {
    type: String,
    default: null
  },

  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],

  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);
