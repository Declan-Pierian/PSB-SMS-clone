import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import AddIcon from '@mui/icons-material/Add';

export default function ResourceIssueSearch() {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setData(storageService.getAll('resource_issues')); }, []);
  const refresh = () => setData(storageService.getAll('resource_issues'));

  const searchFields = [
    { name: 'resourceName', label: 'Resource Name' },
    { name: 'status', label: 'Status', type: 'select', options: ['Open', 'In Progress', 'Resolved', 'Closed'] },
  ];

  const columns = [
    { field: 'resourceName', headerName: 'Resource', flex: 1 },
    { field: 'issueType', headerName: 'Issue Type', width: 140 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'reportedBy', headerName: 'Reported By', width: 130 },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'createdAt', headerName: 'Reported', width: 110, valueFormatter: (v) => v ? new Date(v).toLocaleDateString() : '' },
    {
      field: 'actions', headerName: 'Actions', width: 120, sortable: false,
      renderCell: (p) => p.row.status !== 'Resolved' ? <Button size="small" color="success" onClick={() => { storageService.update('resource_issues', p.row.id, { status: 'Resolved' }); refresh(); enqueueSnackbar('Issue resolved', { variant: 'success' }); }}>Resolve</Button> : null,
    },
  ];

  const formFields = [
    { name: 'resourceName', label: 'Resource Name', required: true },
    { name: 'issueType', label: 'Issue Type', type: 'select', options: ['Broken Link', 'Incorrect Content', 'Missing File', 'Outdated', 'Other'], required: true },
    { name: 'description', label: 'Description', type: 'textarea', fullWidth: true, required: true },
    { name: 'reportedBy', label: 'Reported By' },
  ];

  return (
    <Box>
      <PageHeader title="StudyResource Issue Search" breadcrumbs={[{ label: 'Academics' }, { label: 'Resource Issues' }]} actionLabel="Report Issue" actionIcon={<AddIcon />} onAction={() => setDialogOpen(true)} />
      <SearchForm fields={searchFields} onSearch={(f) => setData(storageService.search('resource_issues', f))} onReset={refresh} />
      <DataTable rows={data} columns={columns} exportFilename="resource-issues" />
      <FormDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={(v) => { storageService.create('resource_issues', { ...v, status: 'Open' }); refresh(); setDialogOpen(false); enqueueSnackbar('Issue reported', { variant: 'success' }); }} title="Report Resource Issue" fields={formFields} />
    </Box>
  );
}