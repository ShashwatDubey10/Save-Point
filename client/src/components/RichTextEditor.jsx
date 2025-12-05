import { useState, useRef, useEffect } from 'react';

const RichTextEditor = ({ value, onChange, placeholder = 'Take a note...' }) => {
  const editorRef = useRef(null);
  const [showToolbar, setShowToolbar] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleFocus = () => {
    setShowToolbar(true);
  };

  const handleKeyDown = (e) => {
    // Handle keyboard shortcuts
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
      }
    }
  };

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center gap-1 p-2.5 bg-white/60 rounded-lg border-2 border-white/60 backdrop-blur-sm shadow-sm">
          <button
            type="button"
            onClick={() => execCommand('bold')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors group"
            title="Bold (Ctrl+B)"
          >
            <svg className="w-4 h-4 text-gray-700 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 5h8a3 3 0 110 6H3V5zm0 6h9a3 3 0 110 6H3v-6z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => execCommand('italic')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors group"
            title="Italic (Ctrl+I)"
          >
            <svg className="w-4 h-4 text-gray-700 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 5h6v2h-1.5l-3 8H13v2H7v-2h1.5l3-8H10V5z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => execCommand('underline')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors group"
            title="Underline (Ctrl+U)"
          >
            <svg className="w-4 h-4 text-gray-700 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 15a5 5 0 01-5-5V5h2v5a3 3 0 006 0V5h2v5a5 5 0 01-5 5zM4 17h12v1H4v-1z" />
            </svg>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={() => execCommand('insertUnorderedList')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors group"
            title="Bullet List"
          >
            <svg className="w-4 h-4 text-gray-700 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 7a1 1 0 110-2 1 1 0 010 2zm0 4a1 1 0 110-2 1 1 0 010 2zm0 4a1 1 0 110-2 1 1 0 010 2zm4-8h10v2H7V7zm0 4h10v2H7v-2zm0 4h10v2H7v-2z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => execCommand('insertOrderedList')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors group"
            title="Numbered List"
          >
            <svg className="w-4 h-4 text-gray-700 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4v2h1V5h1v1h1V4H3zm0 5v1h1v1h1v1H3v1h3v-1H5v-1H4v-1h2V9H3zm0 5v1h1v1H3v1h3v-1H5v-1h1v-1H3zm4-9h10v2H7V5zm0 4h10v2H7V9zm0 4h10v2H7v-2z" />
            </svg>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <button
            type="button"
            onClick={() => execCommand('strikeThrough')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors group"
            title="Strikethrough"
          >
            <svg className="w-4 h-4 text-gray-700 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 10h14v1H3v-1zm2-3h10v1H5V7zm0 6h10v1H5v-1z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => execCommand('removeFormat')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors group"
            title="Clear Formatting"
          >
            <svg className="w-4 h-4 text-gray-700 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15.71 8.29l-3-3a1 1 0 00-1.42 0l-8 8a1 1 0 000 1.42l3 3a1 1 0 001.42 0l8-8a1 1 0 000-1.42zM6 16.59L4.41 15 12 7.41 13.59 9 6 16.59z" />
              <path d="M17 3h-2l-2 2h2l-1 1 1.41 1.41L17 5.41V7l2-2V3h-2z" />
            </svg>
          </button>

          <div className="ml-auto text-xs text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded">
            💡 Ctrl+B/I/U
          </div>
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        className="min-h-[200px] p-4 bg-transparent text-gray-800 outline-none focus:ring-2 focus:ring-gray-400/30 rounded-lg"
        style={{
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
        data-placeholder={placeholder}
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          position: absolute;
        }
        [contenteditable] {
          outline: none;
        }
        [contenteditable] ul, [contenteditable] ol {
          margin-left: 20px;
          padding-left: 10px;
        }
        [contenteditable] li {
          margin: 4px 0;
        }
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
      `}</style>
    </div>
  );
};

export default RichTextEditor;
