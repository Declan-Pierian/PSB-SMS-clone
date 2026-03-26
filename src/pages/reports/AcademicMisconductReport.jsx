import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import AddIcon from '@mui/icons-material/Add';

export default function AcademicMisconductReport() {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setData(storageService.getAll('misconduct_cases')); }, []);
  const refresh = () => setData(storageService.getAll('misconduct_cases'));

  const columns = [
    { field: 'id', headerName: 'Case ID', width: 110 },
    { field: 'studentName', headerName: 'Student', flex: 1 },
    { field: 'program', headerName: 'Program', width: 180 },
    { field: 'type', headerName: 'Type', width: 130 },
    { field: 'date', headerName: 'Date', width: 110 },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'penalty', headerName: 'Penalty', width: 150 },
    {
      field: 'actions', headerName: 'Actions', width: 120, sortable: false,
      renderCell: (p) => p.row.status === 'Open' ? <Button size="small" color="success" onClick={() => { storageService.update('misconduct_cases', p.row.id, { status: 'Resolved' }); refresh(); enqueueSnackbar('Case resolved', { variant: 'success' }); }}>Resolve</Button> : null,
    },
  ];

  const formFields = [
    { name: 'studentName', label: 'Student Name', required: true },
    { name: 'program', label: 'Program' },
    { name: 'type', label: 'Type', type: 'select', options: ['Plagiarism', 'Cheating', 'Collusion', 'Fabrication', 'Other'], required: true },
    { name: 'date', label: 'Date', type: 'date', required: true },
    { name: 'penalty', label: 'Penalty' },
    { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
  ];

  return (
    <Box>
      <PageHeader title="Academic Misconduct Report" breadcrumbs={[{ label: 'Reports' }, { label: 'Academic Misconduct' }]} actionLabel="Report Case" actionIcon={<AddIcon />} onAction={() => setDialogOpen(true)} />
      <DataTable rows={data} columns={columns} exportFilename="misconduct-report" />
      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={(v) => { storageService.create('misconduct_cases', { ...v, status: 'Open' }); refresh(); setDialogOpen(false); enqueueSnackbar('Case reported', { variant: 'success' }); }} title="Report Misconduct Case" fields={formFields} />
    </Box>
  );
}