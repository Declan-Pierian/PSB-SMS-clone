import React, { useState } from 'react';
import { Box, Paper, List, ListItem, ListItemText, ListItemIcon, IconButton, Collapse, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../../components/common/PageHeader';
import FolderIcon from '@mui/icons-material/Folder';
import LabelIcon from '@mui/icons-material/Label';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import storageService from '../../../services/storageService';

const defaultTags = [
  { id: '1', name: 'Undergraduate', children: [{ id: '1a', name: 'Diploma' }, { id: '1b', name: 'Advanced Diploma' }, { id: '1c', name: 'Bachelor Degree' }] },
  { id: '2', name: 'Postgraduate', children: [{ id: '2a', name: 'Master Degree' }, { id: '2b', name: 'PhD' }] },
  { id: '3', name: 'Professional', children: [{ id: '3a', name: 'Certificate' }, { id: '3b', name: 'Short Course' }] },
];

export default function CourseTagHierarchy() {
  const [tags, setTags] = useState(() => {
    const saved = storageService.getAll('course_tags');
    return saved.length ? saved : defaultTags;
  });
  const [open, setOpen] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [parentId, setParentId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const save = (updated) => { setTags(updated); storageService.setAll('course_tags', updated); };

  const toggle = (id) => setOpen(prev => ({ ...prev, [id]: !prev[id] }));

  const addTag = () => {
    if (!newTag.trim()) return;
    const updated = [...tags];
    const tag = { id: Date.now().toString(), name: newTag.trim() };
    if (parentId) {
      const parent = updated.find(t => t.id === parentId);
      if (parent) { parent.children = [...(parent.children || []), tag]; }
    } else {
      updated.push({ ...tag, children: [] });
    }
    save(updated);
    setDialogOpen(false); setNewTag(''); setParentId(null);
    enqueueSnackbar('Tag added', { variant: 'success' });
  };

  const deleteTag = (id, pid) => {
    let updated = [...tags];
    if (pid) {
      const parent = updated.find(t => t.id === pid);
      if (parent) parent.children = parent.children.filter(c => c.id !== id);
    } else {
      updated = updated.filter(t => t.id !== id);
    }
    save(updated);
    enqueueSnackbar('Tag deleted', { variant: 'success' });
  };

  return (
    <Box>
      <PageHeader title="Course Tag Hierarchy" breadcrumbs={[{ label: 'Masters' }, { label: 'Course Tags' }]} actionLabel="Add Category" actionIcon={<AddIcon />} onAction={() => { setParentId(null); setDialogOpen(true); }} />
      <Paper sx={{ p: 2 }}>
        <List>
          {tags.map(tag => (
            <Box key={tag.id}>
              <ListItem secondaryAction={<Box><IconButton size="small" onClick={() => { setParentId(tag.id); setDialogOpen(true); }}><AddIcon fontSize="small" /></IconButton><IconButton size="small" onClick={() => deleteTag(tag.id)}><DeleteIcon fontSize="small" /></IconButton></Box>}>
                <ListItemIcon><FolderIcon sx={{ color: '#b30537' }} /></ListItemIcon>
                <ListItemText primary={tag.name} primaryTypographyProps={{ fontWeight: 600 }} />
                {tag.children?.length > 0 && <IconButton onClick={() => toggle(tag.id)}>{open[tag.id] ? <ExpandLess /> : <ExpandMore />}</IconButton>}
              </ListItem>
              {tag.children?.length > 0 && (
                <Collapse in={open[tag.id]} timeout="auto">
                  <List sx={{ pl: 4 }}>
                    {tag.children.map(child => (
                      <ListItem key={child.id} secondaryAction={<IconButton size="small" onClick={() => deleteTag(child.id, tag.id)}><DeleteIcon fontSize="small" /></IconButton>}>
                        <ListItemIcon><LabelIcon sx={{ color: '#2B4D83' }} /></ListItemIcon>
                        <ListItemText primary={child.name} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
        </List>
      </Paper>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{parentId ? 'Add Sub-Tag' : 'Add Category'}</DialogTitle>
        <DialogContent><TextField autoFocus fullWidth label="Tag Name" value={newTag} onChange={(e) => setNewTag(e.target.value)} sx={{ mt: 1 }} size="small" /></DialogContent>
        <DialogActions><Button onClick={() => setDialogOpen(false)}>Cancel</Button><Button variant="contained" onClick={addTag} sx={{ backgroundColor: '#b30537' }}>Add</Button></DialogActions>
      </Dialog>
    </Box>
  );
}