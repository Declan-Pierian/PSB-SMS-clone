import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import AddIcon from '@mui/icons-material/Add';

export default function ModuleAppealReport() {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setData(storageService.getAll('appeals')); }, []);
  const refresh = () => setData(storageService.getAll('appeals'));

  const columns = [
    { field: 'id', headerName: 'Appeal ID', width: 110 },
    { field: 'studentName', headerName: 'Student', flex: 1 },
    { field: 'module', headerName: 'Module', width: 180 },
    { field: 'originalGrade', headerName: 'Original', width: 90 },
    { field: 'appealedGrade', headerName: 'Appealed', width: 90 },
    { field: 'reason', headerName: 'Reason', flex: 1 },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'outcome', headerName: 'Outcome', width: 130 },
    {
      field: 'actions', headerName: 'Actions', width: 180, sortable: false,
      renderCell: (p) => p.row.status === 'Pending' ? (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button size="small" color="success" onClick={() => { storageService.update('appeals', p.row.id, { status: 'Approved', outcome: 'Grade Updated' }); refresh(); enqueueSnackbar('Appeal approved', { variant: 'success' }); }}>Approve</Button>
          <Button size="small" color="error" onClick={() => { storageService.update('appeals', p.row.id, { status: 'Rejected', outcome: 'No Change' }); refresh(); enqueueSnackbar('Appeal rejected', { variant: 'warning' }); }}>Reject</Button>
        </Box>
      ) : null,
    },
  ];

  const formFields = [
    { name: 'studentName', label: 'Student Name', required: true },
    { name: 'module', label: 'Module', required: true },
    { name: 'originalGrade', label: 'Original Grade', required: true },
    { name: 'appealedGrade', label: 'Appealed Grade', required: true },
    { name: 'reason', label: 'Reason', type: 'textarea', fullWidth: true, required: true },
  ];

  return (
    <Box>
      <PageHeader title="Module Appeal Report" breadcrumbs={[{ label: 'Reports' }, { label: 'Module Appeal' }]} actionLabel="New Appeal" actionIcon={<AddIcon />} onAction={() => setDialogOpen(true)} />
      <DataTable rows={data} columns={columns} exportFilename="module-appeals" />
      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={(v) => { storageService.create('appeals', { ...v, status: 'Pending', outcome: '' }); refresh(); setDialogOpen(false); enqueueSnackbar('Appeal submitted', { variant: 'success' }); }} title="New Module Appeal" fields={formFields} />
    </Box>
  );
}