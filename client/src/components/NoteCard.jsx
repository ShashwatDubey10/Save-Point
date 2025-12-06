import { useState } from 'react';

const COLORS = {
  coral: { bg: 'bg-[#FFB4A2]', border: 'border-[#FF9A85]' },
  peach: { bg: 'bg-[#FFD4A3]', border: 'border-[#FFBC7A]' },
  sand: { bg: 'bg-[#F5DEB3]', border: 'border-[#E6CF9E]' },
  mint: { bg: 'bg-[#B5EAD7]', border: 'border-[#9DD9C3]' },
  sky: { bg: 'bg-[#B4D7ED]', border: 'border-[#96C5E0]' },
  lavender: { bg: 'bg-[#C7CEEA]', border: 'border-[#B0B9DD]' },
  default: { bg: 'bg-white', border: 'border-gray-300' },
};

const NoteCard = ({ note, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const theme = COLORS[note.color] || COLORS.coral;

  const handleCardClick = () => {
    // Close menu if open, otherwise edit
    if (showMenu) {
      setShowMenu(false);
    } else {
      onEdit(note);
    }
  };

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete(note._id);
  };

  return (
    <div
      className={`${theme.bg} border-2 ${theme.border} rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:shadow-xl active:scale-[0.98] relative`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Always-visible menu button on mobile, hover on desktop */}
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
        <button
          onClick={handleMenuToggle}
          className="touch-target flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:p-1.5 hover:bg-gray-900/10 active:bg-gray-900/20 rounded-full transition-colors"
          aria-label="More options"
        >
          <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {/* Dropdown Menu - Touch-friendly */}
        {showMenu && (
          <>
            {/* Backdrop for mobile */}
            <div
              className="fixed inset-0 z-10 lg:hidden"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
              }}
            />

            {/* Menu */}
            <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl py-1 sm:py-2 w-40 z-20 border-2 border-gray-200 animate-scale-in">
              <button
                onClick={handleDeleteClick}
                className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-red-50 active:bg-red-100 text-sm text-red-600 font-medium flex items-center gap-2 touch-target"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      {/* Edit icon hint - Desktop only */}
      <div className="hidden lg:block absolute top-2 sm:top-3 left-2 sm:left-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/80 rounded-full p-1.5">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>

      {/* Mobile: Tap to edit hint */}
      <div className="lg:hidden absolute bottom-2 right-2 opacity-40">
        <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </div>

      {/* Title */}
      {note.title && (
        <h3 className="font-bold text-gray-900 mb-2 pr-8 sm:pr-10 text-base sm:text-lg line-clamp-2">
          {note.title}
        </h3>
      )}

      {/* Content/Description */}
      {(note.formattedContent || note.content) && (
        <div
          className="text-gray-700 text-xs sm:text-sm break-words line-clamp-6 note-content pb-6 sm:pb-4"
          dangerouslySetInnerHTML={{ __html: note.formattedContent || note.content }}
        />
      )}

      {/* Empty state */}
      {!note.title && !note.content && !note.formattedContent && (
        <p className="text-gray-500 text-xs sm:text-sm italic pb-6">Empty note - tap to edit</p>
      )}

      {/* Inline styles for rich text content */}
      <style jsx>{`
        .note-content {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }

        .note-content h1 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0.5em 0;
        }

        .note-content h2 {
          font-size: 1.1em;
          font-weight: bold;
          margin: 0.5em 0;
        }

        .note-content h3 {
          font-size: 1em;
          font-weight: bold;
          margin: 0.5em 0;
        }

        .note-content ul, .note-content ol {
          margin-left: 1.5em;
          margin-top: 0.25em;
          margin-bottom: 0.25em;
        }

        .note-content li {
          margin: 0.2em 0;
        }

        .note-content strong, .note-content b {
          font-weight: bold;
        }

        .note-content em, .note-content i {
          font-style: italic;
        }

        .note-content u {
          text-decoration: underline;
        }

        .note-content strike {
          text-decoration: line-through;
        }

        .note-content p {
          margin: 0.25em 0;
        }
      `}</style>
    </div>
  );
};

export default NoteCard;
