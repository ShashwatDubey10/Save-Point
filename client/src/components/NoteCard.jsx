import { useState } from 'react';

const NoteCard = ({ note, onEdit, onDelete, onPin, onArchive, onDuplicate }) => {
  const [showMenu, setShowMenu] = useState(false);

  const colorThemes = {
    coral: { bg: 'bg-[#FFB4A2]', border: 'border-[#FF9A85]', text: 'text-gray-900' },
    peach: { bg: 'bg-[#FFD4A3]', border: 'border-[#FFBC7A]', text: 'text-gray-900' },
    sand: { bg: 'bg-[#F5DEB3]', border: 'border-[#E6CF9E]', text: 'text-gray-900' },
    mint: { bg: 'bg-[#B5EAD7]', border: 'border-[#9DD9C3]', text: 'text-gray-900' },
    sky: { bg: 'bg-[#B4D7ED]', border: 'border-[#96C5E0]', text: 'text-gray-900' },
    lavender: { bg: 'bg-[#C7CEEA]', border: 'border-[#B0B9DD]', text: 'text-gray-900' },
    rose: { bg: 'bg-[#F4C2C2]', border: 'border-[#EAADAD]', text: 'text-gray-900' },
    sage: { bg: 'bg-[#C8D5B9]', border: 'border-[#B3C4A0]', text: 'text-gray-900' },
    periwinkle: { bg: 'bg-[#C5CBE3]', border: 'border-[#B0B7D6]', text: 'text-gray-900' },
    lemon: { bg: 'bg-[#FFF4B8]', border: 'border-[#FFE89D]', text: 'text-gray-900' },
    default: { bg: 'bg-white', border: 'border-gray-300', text: 'text-gray-900' },
    slate: { bg: 'bg-gray-200', border: 'border-gray-300', text: 'text-gray-900' }
  };

  const theme = colorThemes[note.color] || colorThemes.coral;
  const hasContent = note.title || note.formattedContent || note.content || (note.checklist && note.checklist.length > 0);

  // Create a sanitized preview of formatted content
  const getContentPreview = () => {
    if (note.formattedContent) {
      // Remove HTML tags for preview, but preserve structure
      const div = document.createElement('div');
      div.innerHTML = note.formattedContent;
      return div.textContent || div.innerText || '';
    }
    return note.content || '';
  };

  return (
    <div
      className={`${theme.bg} border-2 ${theme.border} rounded-xl p-4 hover:shadow-xl transition-all duration-200 cursor-pointer relative group transform hover:scale-[1.02]`}
      onClick={() => onEdit(note)}
    >
      {/* Pin indicator */}
      {note.isPinned && (
        <div className="absolute top-3 right-3 bg-gray-900/20 rounded-full p-1">
          <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1h-2z" />
          </svg>
        </div>
      )}

      {/* Title */}
      {note.title && (
        <h3 className={`font-bold ${theme.text} mb-3 pr-8 text-lg`}>{note.title}</h3>
      )}

      {/* Formatted Content or Plain Content */}
      {note.formattedContent ? (
        <div
          className={`${theme.text} text-sm mb-3 line-clamp-10 formatted-content`}
          dangerouslySetInnerHTML={{ __html: note.formattedContent }}
        />
      ) : note.content ? (
        <p className={`${theme.text} text-sm whitespace-pre-wrap break-words mb-3 line-clamp-10`}>
          {note.content}
        </p>
      ) : null}

      {/* Checklist */}
      {note.checklist && note.checklist.length > 0 && (
        <div className="space-y-2 mb-3">
          {note.checklist.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item.checked}
                readOnly
                className="w-4 h-4 rounded"
                onClick={(e) => e.stopPropagation()}
              />
              <span className={`text-sm ${item.checked ? 'line-through text-gray-500' : theme.text}`}>
                {item.text}
              </span>
            </div>
          ))}
          {note.checklist.length > 5 && (
            <p className="text-xs text-gray-500 mt-2 font-medium">+{note.checklist.length - 5} more items</p>
          )}
        </div>
      )}

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {note.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-900 text-white px-2 py-1 rounded-full font-medium"
            >
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-xs bg-gray-900 text-white px-2 py-1 rounded-full font-medium">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Action buttons - shown on hover */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPin(note._id);
          }}
          className="p-2 hover:bg-white/40 rounded-lg transition-colors backdrop-blur-sm bg-white/20"
          title={note.isPinned ? 'Unpin' : 'Pin'}
        >
          <svg className="w-4 h-4 text-gray-900" fill={note.isPinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-2 hover:bg-white/40 rounded-lg transition-colors relative backdrop-blur-sm bg-white/20"
          title="More options"
        >
          <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>

          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-2xl py-2 w-44 z-10 border-2 border-gray-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(note._id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-sm text-gray-800 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                Duplicate
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(note._id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-sm text-gray-800 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                  <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                {note.isArchived ? 'Unarchive' : 'Archive'}
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note._id);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-sm text-red-600 font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </button>
      </div>

      {/* Empty note placeholder */}
      {!hasContent && (
        <p className="text-gray-500 text-sm italic">Empty note</p>
      )}

      {/* Styles for formatted content */}
      <style>{`
        .formatted-content ul, .formatted-content ol {
          margin-left: 20px;
          padding-left: 10px;
        }
        .formatted-content li {
          margin: 4px 0;
        }
        .formatted-content strong, .formatted-content b {
          font-weight: bold;
        }
        .formatted-content em, .formatted-content i {
          font-style: italic;
        }
        .formatted-content u {
          text-decoration: underline;
        }
        .formatted-content strike {
          text-decoration: line-through;
        }
      `}</style>
    </div>
  );
};

export default NoteCard;
