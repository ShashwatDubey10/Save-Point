import { useState, useEffect } from 'react';

const NoteModal = ({ isOpen, onClose, onSave, note }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('#fef3c7');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [checklist, setChecklist] = useState([]);
  const [checklistInput, setChecklistInput] = useState('');
  const [showChecklist, setShowChecklist] = useState(false);

  const colors = [
    { value: '#fef3c7', name: 'Yellow', class: 'bg-yellow-100' },
    { value: '#fed7aa', name: 'Orange', class: 'bg-orange-100' },
    { value: '#fecaca', name: 'Red', class: 'bg-red-100' },
    { value: '#f9a8d4', name: 'Pink', class: 'bg-pink-100' },
    { value: '#ddd6fe', name: 'Purple', class: 'bg-purple-100' },
    { value: '#bfdbfe', name: 'Blue', class: 'bg-blue-100' },
    { value: '#a7f3d0', name: 'Green', class: 'bg-green-100' },
    { value: '#d1d5db', name: 'Gray', class: 'bg-gray-100' },
    { value: '#ffffff', name: 'White', class: 'bg-white' }
  ];

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setColor(note.color || '#fef3c7');
      setTags(note.tags || []);
      setChecklist(note.checklist || []);
      setShowChecklist((note.checklist || []).length > 0);
    } else {
      setTitle('');
      setContent('');
      setColor('#fef3c7');
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
    setColor('#fef3c7');
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

  const selectedColorClass = colors.find(c => c.value === color)?.class || 'bg-yellow-100';

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${selectedColorClass} border-2 border-gray-300 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
        <form onSubmit={handleSubmit} className="p-6">
          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-transparent text-xl font-semibold text-gray-900 placeholder-gray-500 outline-none mb-4"
            autoFocus
          />

          {/* Content/Checklist Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setShowChecklist(false)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                !showChecklist ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Note
            </button>
            <button
              type="button"
              onClick={() => setShowChecklist(true)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                showChecklist ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Checklist
            </button>
          </div>

          {/* Content or Checklist */}
          {!showChecklist ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Take a note..."
              className="w-full bg-transparent text-gray-700 placeholder-gray-500 outline-none resize-none min-h-[200px]"
            />
          ) : (
            <div className="space-y-2 mb-4">
              {checklist.map((item, index) => (
                <div key={index} className="flex items-center gap-2 group">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleToggleChecklistItem(index)}
                    className="w-4 h-4 rounded"
                  />
                  <span className={`flex-1 ${item.checked ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                    {item.text}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistItem(index)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={checklistInput}
                  onChange={(e) => setChecklistInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChecklistItem())}
                  placeholder="+ Add item"
                  className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none border-b border-gray-300 pb-1"
                />
                <button
                  type="button"
                  onClick={handleAddChecklistItem}
                  className="text-gray-700 hover:text-gray-900"
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
                  className="inline-flex items-center gap-1 bg-gray-700 text-white px-2 py-1 rounded-full text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-300"
                  >
                    ✕
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
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-500 outline-none border-b border-gray-300 pb-1"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Add
              </button>
            </div>
          </div>

          {/* Color Picker */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Color</p>
            <div className="flex gap-2 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full ${c.class} border-2 ${
                    color === c.value ? 'border-gray-900' : 'border-gray-300'
                  } hover:border-gray-700 transition-colors`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors font-medium"
            >
              {note ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
