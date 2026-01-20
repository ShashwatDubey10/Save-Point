import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { noteService } from '../services/noteService';
import AppHeader from '../components/AppHeader';
import AppNavigation from '../components/AppNavigation';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { PageContainer, MainContent, PageHeader, ErrorMessage, LoadingSpinner, EmptyState, Grid } from '../utils/pageLayout';

const NotesPage = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await noteService.getAll(false); // false = not archived
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load notes:', err);
      setError('Failed to load notes. Please refresh the page.');
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
        // Update existing note
        await noteService.update(editingNote._id, noteData);
        toast.success('Note updated successfully!');
      } else {
        // Create new note
        await noteService.create(noteData);
        toast.success('Note created successfully!');
      }
      await fetchNotes();
      setIsNoteModalOpen(false);
      setEditingNote(null);
    } catch (err) {
      console.error('Failed to save note:', err);
      toast.error('Failed to save note. Please try again.');
      throw err; // Re-throw to let modal handle it
    }
  };

  const handleDeleteClick = (noteId) => {
    setNoteToDelete(noteId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;

    try {
      await noteService.delete(noteToDelete);
      toast.success('Note deleted successfully!');
      await fetchNotes();
      setIsDeleteModalOpen(false);
      setNoteToDelete(null);
    } catch (err) {
      console.error('Failed to delete note:', err);
      toast.error('Failed to delete note. Please try again.');
    }
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      note.title?.toLowerCase().includes(query) ||
      note.content?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <AppHeader />
      <AppNavigation />

      <MainContent>
        <PageHeader
          title="My Notes 📝"
          description="Click on a note to view and edit it"
          actionLabel="New Note"
          actionOnClick={handleCreateNote}
        />

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
            {error}
            <button
              onClick={fetchNotes}
              className="ml-4 text-sm underline hover:text-red-300"
            >
              Retry
            </button>
          </div>
        )}

        {/* Statistics Cards - Mobile-first grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="glass rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                📊
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm truncate">Total Notes</p>
                <p className="text-xl sm:text-2xl font-bold text-white">{notes.length}</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                📝
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm truncate">With Content</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {notes.filter(n => n.title || n.content).length}
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                🎨
              </div>
              <div className="min-w-0">
                <p className="text-gray-400 text-xs sm:text-sm truncate">Colored</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {notes.filter(n => n.color && n.color !== 'default').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Create Button - Mobile-first layout */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search - Full width on mobile */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors text-sm sm:text-base"
              />
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3 top-2.5 sm:top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Add Note Button - Touch-friendly on mobile */}
          <button
            onClick={handleCreateNote}
            className="touch-target flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors font-medium text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="whitespace-nowrap">New Note</span>
          </button>
        </div>

        {/* Notes Grid - Mobile-first: 1 column, scales up */}
        {filteredNotes.length === 0 ? (
          <EmptyState
            icon="📝"
            title={searchQuery ? 'No notes found' : 'No notes yet'}
            description={searchQuery ? 'Try adjusting your search' : 'Click "New Note" to create your first note!'}
            actionLabel={!searchQuery ? 'Create Your First Note' : undefined}
            actionOnClick={!searchQuery ? handleCreateNote : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </MainContent>

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
    </PageContainer>
  );
};

export default NotesPage;
