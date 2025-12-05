import { useState } from 'react';

const NoteCard = ({ note, onEdit, onDelete, onPin, onArchive, onDuplicate, onColorChange }) => {
  const [showMenu, setShowMenu] = useState(false);

  const colorClasses = {
    '#fef3c7': 'bg-yellow-100 border-yellow-200',
    '#fed7aa': 'bg-orange-100 border-orange-200',
    '#fecaca': 'bg-red-100 border-red-200',
    '#f9a8d4': 'bg-pink-100 border-pink-200',
    '#ddd6fe': 'bg-purple-100 border-purple-200',
    '#bfdbfe': 'bg-blue-100 border-blue-200',
    '#a7f3d0': 'bg-green-100 border-green-200',
    '#d1d5db': 'bg-gray-100 border-gray-200',
    '#ffffff': 'bg-white border-gray-200'
  };

  const colorClass = colorClasses[note.color] || colorClasses['#fef3c7'];

  const hasContent = note.title || note.content || (note.checklist && note.checklist.length > 0);

  return (
    <div
      className={`${colorClass} border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer relative group`}
      onClick={() => onEdit(note)}
    >
      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute top-2 right-2">
          <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1h-2z" />
          </svg>
        </div>
      )}

      {/* Title */}
      {note.title && (
        <h3 className="font-semibold text-gray-900 mb-2 pr-8">{note.title}</h3>
      )}

      {/* Content */}
      {note.content && (
        <p className="text-gray-700 text-sm whitespace-pre-wrap break-words mb-3 line-clamp-10">
          {note.content}
        </p>
      )}

      {/* Checklist */}
      {note.checklist && note.checklist.length > 0 && (
        <div className="space-y-1 mb-3">
          {note.checklist.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.checked}
                readOnly
                className="w-4 h-4 rounded"
                onClick={(e) => e.stopPropagation()}
              />
              <span className={`text-sm ${item.checked ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                {item.text}
              </span>
            </div>
          ))}
          {note.checklist.length > 5 && (
            <p className="text-xs text-gray-500 mt-1">+{note.checklist.length - 5} more items</p>
          )}
        </div>
      )}

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {note.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-700 text-white px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action buttons - shown on hover */}
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPin(note._id);
          }}
          className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
          title={note.isPinned ? 'Unpin' : 'Pin'}
        >
          <svg className="w-4 h-4 text-gray-700" fill={note.isPinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-1.5 hover:bg-gray-200 rounded-full transition-colors relative"
          title="More options"
        >
          <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>

          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute right-0 bottom-full mb-1 bg-white rounded-lg shadow-lg py-1 w-40 z-10 border border-gray-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(note._id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
              >
                Duplicate
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(note._id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
              >
                {note.isArchived ? 'Unarchive' : 'Archive'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note._id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </button>
      </div>

      {/* Empty note placeholder */}
      {!hasContent && (
        <p className="text-gray-400 text-sm italic">Empty note</p>
      )}
    </div>
  );
};

export default NoteCard;
