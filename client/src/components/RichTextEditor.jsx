import { useRef, useEffect, useState } from 'react';

const RichTextEditor = ({ value, onChange, placeholder = 'Take a note...' }) => {
  const editorRef = useRef(null);
  const [showToolbar, setShowToolbar] = useState(false);

  // Initialize editor with value
  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      // Only update if different to preserve cursor position
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleFocus = () => {
    setShowToolbar(true);
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleKeyDown = (e) => {
    // Keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'z':
          if (e.shiftKey) {
            e.preventDefault();
            execCommand('redo');
          } else {
            e.preventDefault();
            execCommand('undo');
          }
          break;
        case 'y':
          e.preventDefault();
          execCommand('redo');
          break;
        default:
          break;
      }
    }
  };

  const handlePaste = (e) => {
    // Clean paste - remove unwanted formatting but keep structure
    e.preventDefault();
    const text = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');

    // Create temporary element to clean HTML
    const temp = document.createElement('div');
    temp.innerHTML = text;

    // Remove script tags and dangerous elements
    const scripts = temp.querySelectorAll('script, style, meta, link');
    scripts.forEach(el => el.remove());

    // Get cleaned HTML
    const cleanedHTML = temp.innerHTML || text;

    // Insert at cursor
    document.execCommand('insertHTML', false, cleanedHTML);
    handleInput();
  };

  return (
    <div className="w-full">
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex flex-wrap items-center gap-1 p-2 bg-white/60 rounded-t-lg border-2 border-b-0 border-white/60 backdrop-blur-sm">
          {/* Undo / Redo */}
          <button
            type="button"
            onClick={() => execCommand('undo')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => execCommand('redo')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
            </svg>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Headings */}
          <select
            onChange={(e) => {
              execCommand('formatBlock', e.target.value);
              e.target.value = '';
            }}
            className="px-2 py-1 text-sm bg-transparent hover:bg-gray-200 rounded-lg transition-colors cursor-pointer outline-none"
            defaultValue=""
          >
            <option value="" disabled>Heading</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="p">Normal</option>
          </select>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Bold */}
          <button
            type="button"
            onClick={() => execCommand('bold')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Bold (Ctrl+B)"
          >
            <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 5h8a3 3 0 110 6H3V5zm0 6h9a3 3 0 110 6H3v-6z" />
            </svg>
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => execCommand('italic')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Italic (Ctrl+I)"
          >
            <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 5h6v2h-1.5l-3 8H13v2H7v-2h1.5l3-8H10V5z" />
            </svg>
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={() => execCommand('underline')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Underline (Ctrl+U)"
          >
            <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 15a5 5 0 01-5-5V5h2v5a3 3 0 006 0V5h2v5a5 5 0 01-5 5zM4 17h12v1H4v-1z" />
            </svg>
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            onClick={() => execCommand('strikeThrough')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Strikethrough"
          >
            <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 10h14v1H3v-1zm2-3h10v1H5V7zm0 6h10v1H5v-1z" />
            </svg>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Bullet List */}
          <button
            type="button"
            onClick={() => execCommand('insertUnorderedList')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Bullet List"
          >
            <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 7a1 1 0 110-2 1 1 0 010 2zm0 4a1 1 0 110-2 1 1 0 010 2zm0 4a1 1 0 110-2 1 1 0 010 2zm4-8h10v2H7V7zm0 4h10v2H7v-2zm0 4h10v2H7v-2z" />
            </svg>
          </button>

          {/* Numbered List */}
          <button
            type="button"
            onClick={() => execCommand('insertOrderedList')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Numbered List"
          >
            <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4v2h1V5h1v1h1V4H3zm0 5v1h1v1h1v1H3v1h3v-1H5v-1H4v-1h2V9H3zm0 5v1h1v1H3v1h3v-1H5v-1h1v-1H3zm4-9h10v2H7V5zm0 4h10v2H7V9zm0 4h10v2H7v-2z" />
            </svg>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Highlight */}
          <button
            type="button"
            onClick={() => execCommand('hiliteColor', '#FFEB3B')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Highlight"
          >
            <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Remove Formatting */}
          <button
            type="button"
            onClick={() => execCommand('removeFormat')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Clear Formatting"
          >
            <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15.71 8.29l-3-3a1 1 0 00-1.42 0l-8 8a1 1 0 000 1.42l3 3a1 1 0 001.42 0l8-8a1 1 0 000-1.42zM6 16.59L4.41 15 12 7.41 13.59 9 6 16.59z" />
            </svg>
          </button>

          {/* Keyboard Shortcuts Info */}
          <div className="ml-auto text-xs text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded hidden lg:block">
            💡 Ctrl+B/I/U/Z
          </div>
        </div>
      )}

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className={`min-h-[250px] max-h-[400px] overflow-y-auto p-4 bg-white/50 text-gray-900 outline-none ${
          showToolbar ? 'rounded-b-lg border-2 border-t-0' : 'rounded-lg border-2'
        } border-white/60 focus:border-gray-900 transition-colors`}
        data-placeholder={placeholder}
        spellCheck="true"
      />

      {/* Styles */}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }

        [contenteditable] {
          outline: none;
        }

        /* Headings */
        [contenteditable] h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }

        [contenteditable] h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }

        [contenteditable] h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }

        /* Lists */
        [contenteditable] ul, [contenteditable] ol {
          margin-left: 20px;
          padding-left: 10px;
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }

        [contenteditable] li {
          margin: 4px 0;
        }

        /* Text formatting */
        [contenteditable] strong, [contenteditable] b {
          font-weight: bold;
        }

        [contenteditable] em, [contenteditable] i {
          font-style: italic;
        }

        [contenteditable] u {
          text-decoration: underline;
        }

        [contenteditable] strike {
          text-decoration: line-through;
        }

        /* Paragraphs */
        [contenteditable] p {
          margin: 0.5em 0;
        }

        /* Scrollbar */
        [contenteditable]::-webkit-scrollbar {
          width: 8px;
        }

        [contenteditable]::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }

        [contenteditable]::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }

        [contenteditable]::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
