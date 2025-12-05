import { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';

const COLORS = [
  { value: 'coral', name: 'Coral', bg: 'bg-[#FFB4A2]', border: 'border-[#FF9A85]' },
  { value: 'peach', name: 'Peach', bg: 'bg-[#FFD4A3]', border: 'border-[#FFBC7A]' },
  { value: 'sand', name: 'Sand', bg: 'bg-[#F5DEB3]', border: 'border-[#E6CF9E]' },
  { value: 'mint', name: 'Mint', bg: 'bg-[#B5EAD7]', border: 'border-[#9DD9C3]' },
  { value: 'sky', name: 'Sky', bg: 'bg-[#B4D7ED]', border: 'border-[#96C5E0]' },
  { value: 'lavender', name: 'Lavender', bg: 'bg-[#C7CEEA]', border: 'border-[#B0B9DD]' },
  { value: 'default', name: 'White', bg: 'bg-white', border: 'border-gray-300' },
];

const NoteModal = ({ isOpen, onClose, onSave, note }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('coral');
  const [error, setError] = useState('');

  // Load note data when editing
  useEffect(() => {
    if (isOpen) {
      if (note) {
        // Editing existing note
        setTitle(note.title || '');
        setDescription(note.formattedContent || note.content || '');
        setColor(note.color || 'coral');
        setError('');
      } else {
        // Creating new note
        setTitle('');
        setDescription('');
        setColor('coral');
        setError('');
      }
    }
  }, [note, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim() && !description.trim()) {
      setError('Please add a title or description');
      return;
    }

    try {
      // Strip HTML for plain text content backup
      const plainText = description.replace(/<[^>]*>/g, '').trim();

      const noteData = {
        title: title.trim(),
        content: plainText,
        formattedContent: description.trim(),
        color: color,
        tags: [],
        checklist: []
      };

      await onSave(noteData);
      handleClose();
    } catch (err) {
      setError('Failed to save note. Please try again.');
      console.error('Save error:', err);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setColor('coral');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  const selectedColor = COLORS.find(c => c.value === color) || COLORS[0];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`${selectedColor.bg} border-2 ${selectedColor.border} rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {note ? 'Edit Note' : 'New Note'}
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 hover:bg-gray-900/10 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-white/50 text-2xl font-bold text-gray-900 placeholder-gray-500 outline-none mb-4 border-2 border-transparent focus:border-gray-900 rounded-lg px-4 py-3 transition-colors"
            autoFocus
          />

          {/* Rich Text Editor */}
          <div className="mb-4">
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Take a note..."
            />
          </div>

          {/* Color Picker */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Note Color</p>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-12 h-12 rounded-full ${c.bg} border-2 ${
                    color === c.value
                      ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                      : c.border
                  } hover:scale-110 transition-all`}
                  title={c.name}
                >
                  {color === c.value && (
                    <div className="flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t-2 border-gray-900/20">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-white/50 hover:bg-white/70 text-gray-900 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors font-medium shadow-lg"
            >
              {note ? 'Update Note' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
