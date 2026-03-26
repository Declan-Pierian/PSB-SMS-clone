import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, IconButton, TextField, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import storageService from '../../services/storageService';

const NOTE_COLORS = ['#fff9c4', '#f8bbd0', '#c8e6c9', '#bbdefb', '#e1bee7', '#ffe0b2'];

export default function StickyNotes() {
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    setNotes(storageService.getAll('sticky_notes'));
  }, []);

  const addNote = () => {
    const note = storageService.create('sticky_notes', {
      text: 'New note...',
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
    });
    setNotes(storageService.getAll('sticky_notes'));
    setEditingId(note.id);
    setEditText('New note...');
  };

  const deleteNote = (id) => {
    storageService.remove('sticky_notes', id);
    setNotes(storageService.getAll('sticky_notes'));
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const saveEdit = () => {
    if (editingId) {
      storageService.update('sticky_notes', editingId, { text: editText });
      setNotes(storageService.getAll('sticky_notes'));
      setEditingId(null);
      setEditText('');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Sticky Notes</Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={addNote} sx={{ color: '#b30537' }}>
          Add Note
        </Button>
      </Box>
      <Grid container spacing={2}>
        {notes.map((note) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={note.id}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                minHeight: 120,
                backgroundColor: note.color || '#fff9c4',
                position: 'relative',
                borderRadius: '4px',
                transition: 'transform 0.15s',
                '&:hover': { transform: 'scale(1.02)' },
              }}
            >
              <Box sx={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: 0.5 }}>
                {editingId === note.id ? (
                  <IconButton size="small" onClick={saveEdit}><SaveIcon sx={{ fontSize: 16 }} /></IconButton>
                ) : (
                  <IconButton size="small" onClick={() => startEdit(note)}><EditIcon sx={{ fontSize: 16 }} /></IconButton>
                )}
                <IconButton size="small" onClick={() => deleteNote(note.id)}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
              </Box>
              {editingId === note.id ? (
                <TextField
                  multiline
                  fullWidth
                  rows={3}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  variant="standard"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) saveEdit(); }}
                  sx={{ mt: 2 }}
                />
              ) : (
                <Typography variant="body2" sx={{ mt: 2.5, whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>
                  {note.text}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
        {notes.length === 0 && (
          <Grid size={12}>
            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>
              No sticky notes yet. Click "Add Note" to create one.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
