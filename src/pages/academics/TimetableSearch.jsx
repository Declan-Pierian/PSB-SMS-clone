import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import storageService from '../../services/storageService';
import AddIcon from '@mui/icons-material/Add';

export default function TimetableSearch() {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setData(storageService.getAll('timetable')); }, []);
  const refresh = () => setData(storageService.getAll('timetable'));

  const searchFields = [
    { name: 'module', label: 'Module' },
    { name: 'day', label: 'Day', type: 'select', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
    { name: 'room', label: 'Room' },
    { name: 'lecturer', label: 'Lecturer' },
  ];

  const columns = [
    { field: 'module', headerName: 'Module', flex: 1 },
    { field: 'day', headerName: 'Day', width: 120 },
    { field: 'startTime', headerName: 'Start', width: 100 },
    { field: 'endTime', headerName: 'End', width: 100 },
    { field: 'room', headerName: 'Room', width: 120 },
    { field: 'lecturer', headerName: 'Lecturer', width: 150 },
    { field: 'cohort', headerName: 'Cohort', width: 130 },
    {
      field: 'actions', headerName: 'Actions', width: 150, sortable: false,
      renderCell: (p) => (<Box sx={{ display: 'flex', gap: 0.5 }}><Button size="small" onClick={() => { setEditing(p.row); setDialogOpen(true); }}>Edit</Button><Button size="small" color="error" onClick={() => setDeleteId(p.row.id)}>Delete</Button></Box>),
    },
  ];

  const formFields = [
    { name: 'module', label: 'Module', required: true },
    { name: 'day', label: 'Day', type: 'select', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
    { name: 'startTime', label: 'Start Time', required: true },
    { name: 'endTime', label: 'End Time', required: true },
    { name: 'room', label: 'Room', required: true },
    { name: 'lecturer', label: 'Lecturer' },
    { name: 'cohort', label: 'Cohort' },
  ];

  const handleSubmit = (v) => {
    if (editing) { storageService.update('timetable', editing.id, v); enqueueSnackbar('Entry updated', { variant: 'success' }); }
    else { storageService.create('timetable', v); enqueueSnackbar('Entry created', { variant: 'success' }); }
    refresh(); setDialogOpen(false); setEditing(null);
  };

  return (
    <Box>
      <PageHeader title="Time Table Search" breadcrumbs={[{ label: 'Academics' }, { label: 'Timetable' }]} actionLabel="Add Entry" actionIcon={<AddIcon />} onAction={() => { setEditing(null); setDialogOpen(true); }} />
      <SearchForm fields={searchFields} onSearch={(f) => setData(storageService.search('timetable', f))} onReset={refresh} />
      <DataTable rows={data} columns={columns} exportFilename="timetable" />
      <FormDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditing(null); }} onSubmit={handleSubmit} title={editing ? 'Edit Entry' : 'Add Entry'} fields={formFields} initialValues={editing || {}} />
      <ConfirmDialog open={!!deleteId} title="Delete Entry" message="Are you sure?" onConfirm={() => { storageService.remove('timetable', deleteId); refresh(); setDeleteId(null); enqueueSnackbar('Deleted', { variant: 'success' }); }} onCancel={() => setDeleteId(null)} />
    </Box>
  );
}