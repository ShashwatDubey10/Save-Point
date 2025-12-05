import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
    default: ''
  },
  content: {
    type: String,
    trim: true,
    maxlength: [10000, 'Content cannot exceed 10000 characters'],
    default: ''
  },
  color: {
    type: String,
    default: '#fef3c7', // default yellow like Google Keep
    enum: [
      '#fef3c7', // yellow
      '#fed7aa', // orange
      '#fecaca', // red
      '#f9a8d4', // pink
      '#ddd6fe', // purple
      '#bfdbfe', // blue
      '#a7f3d0', // green
      '#d1d5db', // gray
      '#ffffff'  // white
    ]
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  checklist: [{
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    checked: {
      type: Boolean,
      default: false
    }
  }],
  reminder: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
noteSchema.index({ user: 1, isPinned: -1, updatedAt: -1 });
noteSchema.index({ user: 1, isArchived: 1 });

// Update the updatedAt timestamp before saving
noteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Methods
noteSchema.methods.togglePin = function() {
  this.isPinned = !this.isPinned;
  return this.save();
};

noteSchema.methods.toggleArchive = function() {
  this.isArchived = !this.isArchived;
  return this.save();
};

const Note = mongoose.model('Note', noteSchema);

export default Note;
