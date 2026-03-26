import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, TextField, List, ListItemButton, ListItemText, Chip, Divider, Avatar } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import FormDialog from '../../components/common/FormDialog';
import storageService from '../../services/storageService';
import AddIcon from '@mui/icons-material/Add';
import ForumIcon from '@mui/icons-material/Forum';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';

export default function DiscussionBoard() {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reply, setReply] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setThreads(storageService.getAll('discussions')); }, []);
  const refresh = () => setThreads(storageService.getAll('discussions'));

  const formFields = [
    { name: 'title', label: 'Thread Title', required: true },
    { name: 'content', label: 'Message', type: 'textarea', fullWidth: true, required: true, rows: 4 },
    { name: 'module', label: 'Module' },
  ];

  const handleCreate = (v) => {
    storageService.create('discussions', { ...v, author: 'Admin', replies: [], lastActivity: new Date().toISOString() });
    refresh(); setDialogOpen(false);
    enqueueSnackbar('Thread created', { variant: 'success' });
  };

  const handleReply = () => {
    if (!reply.trim()) return;
    const updated = { ...selectedThread, replies: [...(selectedThread.replies || []), { author: 'Admin', content: reply, date: new Date().toISOString() }], lastActivity: new Date().toISOString() };
    storageService.update('discussions', selectedThread.id, updated);
    setSelectedThread(updated);
    setReply('');
    refresh();
    enqueueSnackbar('Reply posted', { variant: 'success' });
  };

  if (selectedThread) {
    return (
      <Box>
        <PageHeader title={selectedThread.title} breadcrumbs={[{ label: 'Academics' }, { label: 'Discussion Board', path: '/academics/discussion' }, { label: selectedThread.title }]} />
        <Button startIcon={<ArrowBackIcon />} onClick={() => setSelectedThread(null)} sx={{ mb: 2 }}>Back to Threads</Button>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}><Avatar sx={{ width: 32, height: 32, bgcolor: '#b30537', fontSize: 14 }}>{selectedThread.author?.[0]}</Avatar><Typography variant="subtitle2">{selectedThread.author}</Typography><Typography variant="caption" color="textSecondary">{new Date(selectedThread.createdAt).toLocaleString()}</Typography></Box>
          <Typography variant="body2">{selectedThread.content}</Typography>
        </Paper>
        {(selectedThread.replies || []).map((r, i) => (
          <Paper key={i} sx={{ p: 2, mb: 1, ml: 4, borderLeft: '3px solid #2B4D83' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5 }}><Avatar sx={{ width: 24, height: 24, bgcolor: '#2B4D83', fontSize: 12 }}>{r.author?.[0]}</Avatar><Typography variant="subtitle2" sx={{ fontSize: '0.85rem' }}>{r.author}</Typography><Typography variant="caption" color="textSecondary">{new Date(r.date).toLocaleString()}</Typography></Box>
            <Typography variant="body2">{r.content}</Typography>
          </Paper>
        ))}
        <Paper sx={{ p: 2, mt: 2, display: 'flex', gap: 1 }}>
          <TextField fullWidth placeholder="Write a reply..." value={reply} onChange={(e) => setReply(e.target.value)} size="small" multiline rows={2} />
          <Button variant="contained" endIcon={<SendIcon />} onClick={handleReply} sx={{ backgroundColor: '#b30537', alignSelf: 'flex-end' }}>Reply</Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader title="Discussion Board" breadcrumbs={[{ label: 'Academics' }, { label: 'Discussion Board' }]} actionLabel="New Thread" actionIcon={<AddIcon />} onAction={() => setDialogOpen(true)} />
      <Paper>
        <List>
          {threads.map((t, i) => (
            <React.Fragment key={t.id}>
              <ListItemButton onClick={() => setSelectedThread(t)}>
                <ForumIcon sx={{ mr: 2, color: '#b30537' }} />
                <ListItemText primary={t.title} secondary={`by ${t.author || 'Unknown'} · ${t.module || 'General'}`} />
                <Box sx={{ textAlign: 'right' }}>
                  <Chip label={`${(t.replies || []).length} replies`} size="small" sx={{ mb: 0.5 }} />
                  <Typography variant="caption" display="block" color="textSecondary">{t.lastActivity ? new Date(t.lastActivity).toLocaleDateString() : ''}</Typography>
                </Box>
              </ListItemButton>
              {i < threads.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          {threads.length === 0 && <Typography variant="body2" color="textSecondary" sx={{ p: 4, textAlign: 'center' }}>No discussions yet.</Typography>}
        </List>
      </Paper>
      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={handleCreate} title="New Discussion Thread" fields={formFields} />
    </Box>
  );
}