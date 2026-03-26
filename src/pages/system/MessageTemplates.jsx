import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import { MESSAGE_CHANNELS } from '../../data/constants';
import AddIcon from '@mui/icons-material/Add';

export default function MessageTemplates() {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setData(storageService.getAll('message_templates')); }, []);
  const refresh = () => setData(storageService.getAll('message_templates'));

  const columns = [
    { field: 'name', headerName: 'Template Name', flex: 1 },
    { field: 'channel', headerName: 'Channel', width: 130 },
    { field: 'subject', headerName: 'Subject', flex: 1 },
    { field: 'status', headerName: 'Status', width: 110, renderCell: (p) => <StatusChip status={p.value || 'Active'} /> },
    {
      field: 'actions', headerName: 'Actions', width: 220, sortable: false,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button size="small" onClick={() => setPreview(p.row)}>Preview</Button>
          <Button size="small" onClick={() => { setEditing(p.row); setDialogOpen(true); }}>Edit</Button>
          <Button size="small" color="error" onClick={() => setDeleteId(p.row.id)}>Delete</Button>
        </Box>
      ),
    },
  ];

  const formFields = [
    { name: 'name', label: 'Template Name', required: true },
    { name: 'channel', label: 'Channel', type: 'select', options: MESSAGE_CHANNELS, required: true },
    { name: 'subject', label: 'Subject', required: true },
    { name: 'body', label: 'Body', type: 'textarea', fullWidth: true, rows: 6, required: true },
    { name: 'variables', label: 'Variables (comma-separated)', fullWidth: true },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
  ];

  const handleSubmit = (values) => {
    if (editing) { storageService.update('message_templates', editing.id, values); enqueueSnackbar('Template updated', { variant: 'success' }); }
    else { storageService.create('message_templates', { ...values, status: values.status || 'Active' }); enqueueSnackbar('Template created', { variant: 'success' }); }
    refresh(); setDialogOpen(false); setEditing(null);
  };

  return (
    <Box>
      <PageHeader title="Message Templates" breadcrumbs={[{ label: 'System' }, { label: 'Message Templates' }]} actionLabel="Add Template" actionIcon={<AddIcon />} onAction={() => { setEditing(null); setDialogOpen(true); }} />
      <DataTable rows={data} columns={columns} exportFilename="message-templates" />
      <FormDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditing(null); }} onSubmit={handleSubmit} title={editing ? 'Edit Template' : 'Add Template'} fields={formFields} initialValues={editing || {}} maxWidth="md" />
      <ConfirmDialog open={!!deleteId} title="Delete Template" message="Are you sure?" onConfirm={() => { storageService.remove('message_templates', deleteId); refresh(); setDeleteId(null); enqueueSnackbar('Template deleted', { variant: 'success' }); }} onCancel={() => setDeleteId(null)} />
      <Dialog open={!!preview} onClose={() => setPreview(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Template Preview</DialogTitle>
        <DialogContent>
          {preview && (<Box>
            <Typography variant="subtitle2" color="textSecondary">Channel: {preview.channel}</Typography>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>Subject: {preview.subject}</Typography>
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, whiteSpace: 'pre-wrap' }}>{preview.body}</Box>
            {preview.variables && <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>Variables: {preview.variables}</Typography>}
          </Box>)}
        </DialogContent>
      </Dialog>
    </Box>
  );
}