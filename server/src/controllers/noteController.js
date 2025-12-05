import Note from '../models/Note.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all notes for user
// @route   GET /api/notes
// @access  Private
export const getNotes = asyncHandler(async (req, res) => {
  const { archived } = req.query;

  const query = { user: req.user.id };

  // Filter by archived status if provided
  if (archived !== undefined) {
    query.isArchived = archived === 'true';
  }

  const notes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 });

  res.status(200).json({
    success: true,
    count: notes.length,
    data: notes
  });
});

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
export const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found'
    });
  }

  // Make sure user owns note
  if (note.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this note'
    });
  }

  res.status(200).json({
    success: true,
    data: note
  });
});

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
export const createNote = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const note = await Note.create(req.body);

  res.status(201).json({
    success: true,
    data: note
  });
});

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
export const updateNote = asyncHandler(async (req, res) => {
  let note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found'
    });
  }

  // Make sure user owns note
  if (note.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this note'
    });
  }

  note = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: note
  });
});

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found'
    });
  }

  // Make sure user owns note
  if (note.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this note'
    });
  }

  await note.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Toggle note pin status
// @route   POST /api/notes/:id/toggle-pin
// @access  Private
export const togglePin = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found'
    });
  }

  // Make sure user owns note
  if (note.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to modify this note'
    });
  }

  await note.togglePin();

  res.status(200).json({
    success: true,
    data: note
  });
});

// @desc    Toggle note archive status
// @route   POST /api/notes/:id/toggle-archive
// @access  Private
export const toggleArchive = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({
      success: false,
      message: 'Note not found'
    });
  }

  // Make sure user owns note
  if (note.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to modify this note'
    });
  }

  await note.toggleArchive();

  res.status(200).json({
    success: true,
    data: note
  });
});

// @desc    Duplicate note
// @route   POST /api/notes/:id/duplicate
// @access  Private
export const duplicateNote = asyncHandler(async (req, res) => {
  const originalNote = await Note.findById(req.params.id);

  if (!originalNote) {
    return res.status(404).json({
      success: false,
      message: 'Note not found'
    });
  }

  // Make sure user owns note
  if (originalNote.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to duplicate this note'
    });
  }

  // Create a copy of the note
  const noteData = originalNote.toObject();
  delete noteData._id;
  delete noteData.createdAt;
  delete noteData.updatedAt;
  noteData.title = noteData.title ? `${noteData.title} (Copy)` : '(Copy)';
  noteData.isPinned = false;

  const duplicatedNote = await Note.create(noteData);

  res.status(201).json({
    success: true,
    data: duplicatedNote
  });
});
