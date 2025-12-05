import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { noteService } from '../services/noteService';
import AppHeader from '../components/AppHeader';
import AppNavigation from '../components/AppNavigation';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import ConfirmationModal from '../components/ConfirmationModal';

const NotesPage = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  // Modal states
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, [showArchived]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await noteService.getAll(showArchived);
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load notes');
      console.error('Error fetching notes:', err);
      toast.error('Failed to load notes');
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsNoteModalOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
        await noteService.update(editingNote._id, noteData);
        toast.success('Note updated successfully!');
      } else {
        await noteService.create(noteData);
        toast.success('Note created successfully!');
      }
      fetchNotes();
      setIsNoteModalOpen(false);
      setEditingNote(null);
    } catch (err) {
      console.error('Failed to save note:', err);
      toast.error('Failed to save note. Please try again.');
    }
  };

  const handleDeleteClick = (noteId) => {
    setNoteToDelete(noteId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await noteService.delete(noteToDelete);
      toast.success('Note deleted successfully!');
      fetchNotes();
      setIsDeleteModalOpen(false);
      setNoteToDelete(null);
    } catch (err) {
      console.error('Failed to delete note:', err);
      toast.error('Failed to delete note. Please try again.');
    }
  };

  const handlePin = async (noteId) => {
    try {
      await noteService.togglePin(noteId);
      toast.success('Note pinned status updated!');
      fetchNotes();
    } catch (err) {
      console.error('Failed to pin note:', err);
      toast.error('Failed to update note. Please try again.');
    }
  };

  const handleArchive = async (noteId) => {
    try {
      await noteService.toggleArchive(noteId);
      toast.success(showArchived ? 'Note unarchived!' : 'Note archived!');
      fetchNotes();
    } catch (err) {
      console.error('Failed to archive note:', err);
      toast.error('Failed to update note. Please try again.');
    }
  };

  const handleDuplicate = async (noteId) => {
    try {
      await noteService.duplicate(noteId);
      toast.success('Note duplicated successfully!');
      fetchNotes();
    } catch (err) {
      console.error('Failed to duplicate note:', err);
      toast.error('Failed to duplicate note. Please try again.');
    }
  };

  // Filter notes based on search query (memoized to prevent unnecessary re-renders)
  const filteredNotes = notes.filter(note => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      note.title?.toLowerCase().includes(searchLower) ||
      note.content?.toLowerCase().includes(searchLower) ||
      note.formattedContent?.toLowerCase().includes(searchLower) ||
      note.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  // Separate pinned and unpinned notes
  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.isPinned);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        <AppHeader />
        <main className="container mx-auto px-4 py-6 pb-24">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        </main>
        <AppNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <AppHeader />

      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              📝 Notes
            </h1>
            <p className="text-gray-400 text-lg">Capture your thoughts with rich formatting</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-5 py-2.5 rounded-xl transition-all font-medium shadow-lg ${
                showArchived
                  ? 'bg-primary-600 text-white hover:bg-primary-500'
                  : 'glass text-gray-300 hover:bg-white/10'
              }`}
            >
              {showArchived ? '📂 Show Active' : '📦 Show Archived'}
            </button>
            <button
              onClick={handleCreateNote}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-primary-500/50 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Note
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes by title, content, or tags..."
              className="w-full glass rounded-xl px-4 py-4 pl-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-lg"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-white mb-2">
              {showArchived ? 'No archived notes' : searchQuery ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {showArchived
                ? 'Your archived notes will appear here'
                : searchQuery
                ? 'Try adjusting your search'
                : 'Start capturing your thoughts and ideas!'}
            </p>
            {!showArchived && !searchQuery && (
              <button
                onClick={handleCreateNote}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors font-medium"
              >
                Create Your First Note
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Pinned Notes */}
            {pinnedNotes.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Pinned
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={handleEditNote}
                      onDelete={handleDeleteClick}
                      onPin={handlePin}
                      onArchive={handleArchive}
                      onDuplicate={handleDuplicate}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Notes */}
            {unpinnedNotes.length > 0 && (
              <div>
                {pinnedNotes.length > 0 && (
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    Others
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {unpinnedNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={handleEditNote}
                      onDelete={handleDeleteClick}
                      onPin={handlePin}
                      onArchive={handleArchive}
                      onDuplicate={handleDuplicate}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <AppNavigation />

      {/* Note Modal */}
      <NoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        note={editingNote}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setNoteToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default NotesPage;
