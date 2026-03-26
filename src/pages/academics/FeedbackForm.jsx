import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, Typography, Paper, List, ListItem, ListItemText, Chip } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import { FEEDBACK_TYPES, QUESTION_TYPES } from '../../data/constants';
import AddIcon from '@mui/icons-material/Add';

export default function FeedbackForm() {
  const [forms, setForms] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setForms(storageService.getAll('feedback_forms')); }, []);
  const refresh = () => setForms(storageService.getAll('feedback_forms'));

  const columns = [
    { field: 'name', headerName: 'Form Name', flex: 1 },
    { field: 'type', headerName: 'Type', width: 160 },
    { field: 'questions', headerName: 'Questions', width: 110, valueGetter: (v) => Array.isArray(v) ? v.length : 0 },
    { field: 'status', headerName: 'Status', width: 110, renderCell: (p) => <StatusChip status={p.value || 'Draft'} /> },
    {
      field: 'actions', headerName: 'Actions', width: 160, sortable: false,
      renderCell: (p) => (<Box sx={{ display: 'flex', gap: 0.5 }}><Button size="small" onClick={() => setPreview(p.row)}>Preview</Button><Button size="small" color="error" onClick={() => { storageService.remove('feedback_forms', p.row.id); refresh(); enqueueSnackbar('Deleted', { variant: 'success' }); }}>Delete</Button></Box>),
    },
  ];

  const formFields = [
    { name: 'name', label: 'Form Name', required: true },
    { name: 'type', label: 'Feedback Type', type: 'select', options: FEEDBACK_TYPES, required: true },
    { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    { name: 'status', label: 'Status', type: 'select', options: ['Draft', 'Published', 'Archived'] },
  ];

  const handleSubmit = (v) => {
    const defaultQuestions = [
      { text: 'Overall satisfaction?', type: 'Rating Scale' },
      { text: 'What did you like most?', type: 'Text' },
      { text: 'Would you recommend?', type: 'Yes/No' },
    ];
    storageService.create('feedback_forms', { ...v, questions: defaultQuestions, status: v.status || 'Draft' });
    refresh(); setDialogOpen(false);
    enqueueSnackbar('Feedback form created', { variant: 'success' });
  };

  return (
    <Box>
      <PageHeader title="Feedback Form" breadcrumbs={[{ label: 'Academics' }, { label: 'Feedback Form' }]} actionLabel="Create Form" actionIcon={<AddIcon />} onAction={() => setDialogOpen(true)} />
      <DataTable rows={forms} columns={columns} exportFilename="feedback-forms" />
      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={handleSubmit} title="Create Feedback Form" fields={formFields} />
      <Dialog open={!!preview} onClose={() => setPreview(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Form Preview: {preview?.name}</DialogTitle>
        <DialogContent>
          {preview && (<Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>{preview.description}</Typography>
            <List>
              {(preview.questions || []).map((q, i) => (
                <ListItem key={i}><ListItemText primary={`${i + 1}. ${q.text}`} secondary={`Type: ${q.type}`} /></ListItem>
              ))}
            </List>
          </Box>)}
        </DialogContent>
      </Dialog>
    </Box>
  );
}