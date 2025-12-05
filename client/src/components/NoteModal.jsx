import { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';

const NoteModal = ({ isOpen, onClose, onSave, note }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [formattedContent, setFormattedContent] = useState('');
  const [color, setColor] = useState('coral');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [checklistInput, setChecklistInput] = useState('');
  const [showChecklist, setShowChecklist] = useState(false);

  const colors = [
    { value: 'coral', name: 'Coral', bg: 'bg-[#FFB4A2]', border: 'border-[#FF9A85]' },
    { value: 'peach', name: 'Peach', bg: 'bg-[#FFD4A3]', border: 'border-[#FFBC7A]' },
    { value: 'sand', name: 'Sand', bg: 'bg-[#F5DEB3]', border: 'border-[#E6CF9E]' },
    { value: 'mint', name: 'Mint', bg: 'bg-[#B5EAD7]', border: 'border-[#9DD9C3]' },
    { value: 'sky', name: 'Sky', bg: 'bg-[#B4D7ED]', border: 'border-[#96C5E0]' },
    { value: 'lavender', name: 'Lavender', bg: 'bg-[#C7CEEA]', border: 'border-[#B0B9DD]' },
    { value: 'rose', name: 'Rose', bg: 'bg-[#F4C2C2]', border: 'border-[#EAADAD]' },
    { value: 'sage', name: 'Sage', bg: 'bg-[#C8D5B9]', border: 'border-[#B3C4A0]' },
    { value: 'periwinkle', name: 'Periwinkle', bg: 'bg-[#C5CBE3]', border: 'border-[#B0B7D6]' },
    { value: 'lemon', name: 'Lemon', bg: 'bg-[#FFF4B8]', border: 'border-[#FFE89D]' },
    { value: 'default', name: 'White', bg: 'bg-white', border: 'border-gray-300' },
    { value: 'slate', name: 'Slate', bg: 'bg-gray-200', border: 'border-gray-300' }
  ];

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setFormattedContent(note.formattedContent || '');
      setColor(note.color || 'coral');
      setTags(note.tags || []);
      setChecklist(note.checklist || []);
      setShowChecklist((note.checklist || []).length > 0);
    } else {
      setTitle('');
      setContent('');
      setFormattedContent('');
      setColor('coral');
      setTags([]);
      setChecklist([]);
      setShowChecklist(false);
    }
  }, [note, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      formattedContent: formattedContent,
      color,
      tags,
      checklist: showChecklist ? checklist : []
    };

    onSave(noteData);
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setFormattedContent('');
    setColor('coral');
    setTags([]);
    setChecklist([]);
    setChecklistInput('');
    setTagInput('');
    setShowChecklist(false);
    onClose();
  };

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddChecklistItem = () => {
    const newItem = checklistInput.trim();
    if (newItem) {
      setChecklist([...checklist, { text: newItem, checked: false }]);
      setChecklistInput('');
    }
  };

  const handleToggleChecklistItem = (index) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index].checked = !updatedChecklist[index].checked;
    setChecklist(updatedChecklist);
  };

  const handleRemoveChecklistItem = (index) => {
    setChecklist(checklist.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  const selectedColor = colors.find(c => c.value === color) || colors[0];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${selectedColor.bg} border-2 ${selectedColor.border} rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto`}>
        <form onSubmit={handleSubmit} className="p-6">
          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-transparent text-2xl font-bold text-gray-900 placeholder-gray-500 outline-none mb-4 border-b-2 border-transparent focus:border-gray-400 pb-2 transition-colors"
            autoFocus
          />

          {/* Content/Checklist Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setShowChecklist(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !showChecklist
                  ? 'bg-gray-800 text-white shadow-md'
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
            >
              📝 Rich Text
            </button>
            <button
              type="button"
              onClick={() => setShowChecklist(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showChecklist
                  ? 'bg-gray-800 text-white shadow-md'
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
            >
              ☑️ Checklist
            </button>
          </div>

          {/* Content or Checklist */}
          {!showChecklist ? (
            <div className="mb-4 bg-white/30 rounded-lg border-2 border-white/40">
              <RichTextEditor
                value={formattedContent}
                onChange={setFormattedContent}
                placeholder="Take a note... (Use toolbar for formatting)"
              />
            </div>
          ) : (
            <div className="space-y-2 mb-4 bg-white/30 rounded-lg p-4 border-2 border-white/40">
              {checklist.map((item, index) => (
                <div key={index} className="flex items-center gap-2 group bg-white/40 rounded px-3 py-2">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleToggleChecklistItem(index)}
                    className="w-5 h-5 rounded"
                  />
                  <span className={`flex-1 ${item.checked ? 'line-through text-gray-500' : 'text-gray-800 font-medium'}`}>
                    {item.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistItem(index)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={checklistInput}
                  onChange={(e) => setChecklistInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChecklistItem())}
                  placeholder="+ Add item"
                  className="flex-1 bg-white/50 text-gray-800 placeholder-gray-500 outline-none border-2 border-white/40 focus:border-gray-400 rounded-lg px-3 py-2 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddChecklistItem}
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-300 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Add tag..."
                className="flex-1 bg-white/50 text-sm text-gray-800 placeholder-gray-500 outline-none border-2 border-white/40 focus:border-gray-400 rounded-lg px-3 py-2 transition-colors"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Color Picker */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Theme Color</p>
            <div className="grid grid-cols-6 gap-3 mb-8">
              {colors.map((c) => (
                <div key={c.value} className="relative">
                  <button
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`w-full h-12 rounded-xl ${c.bg} border-2 ${
                      color === c.value ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' : c.border
                    } hover:scale-105 transition-all shadow-sm hover:shadow-md relative`}
                    title={c.name}
                  >
                    {color === c.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                  <p className="text-xs text-center mt-1 text-gray-600 font-medium">{c.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t-2 border-white/40">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 bg-white/50 hover:bg-white/70 text-gray-800 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors font-medium shadow-lg"
            >
              {note ? '✓ Update Note' : '+ Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
