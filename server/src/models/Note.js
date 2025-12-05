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
  formattedContent: {
    type: String,
    maxlength: [20000, 'Formatted content cannot exceed 20000 characters'],
    default: ''
  },
  color: {
    type: String,
    default: 'coral', // default coral
    enum: [
      'coral',      // soft coral/pink
      'peach',      // warm peach
      'sand',       // sandy beige
      'mint',       // soft mint green
      'sky',        // soft sky blue
      'lavender',   // soft lavender
      'rose',       // soft rose
      'sage',       // sage green
      'periwinkle', // periwinkle blue
      'lemon',      // soft lemon
      'default',    // clean white
      'slate'       // soft gray
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
