import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import { RESOURCE_TYPES } from '../../data/constants';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

export default function StudyResourceSearch() {
  const [data, setData] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => { setData(storageService.getAll('study_resources')); }, []);
  const refresh = () => setData(storageService.getAll('study_resources'));

  const searchFields = [
    { name: 'title', label: 'Title' },
    { name: 'module', label: 'Module' },
    { name: 'type', label: 'Type', type: 'select', options: RESOURCE_TYPES },
  ];

  const columns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'module', headerName: 'Module', width: 160 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'uploadedBy', headerName: 'Uploaded By', width: 130 },
    { field: 'uploadDate', headerName: 'Upload Date', width: 120 },
    { field: 'downloads', headerName: 'Downloads', width: 100 },
    { field: 'status', headerName: 'Status', width: 110, renderCell: (p) => <StatusChip status={p.value || 'Draft'} /> },
    {
      field: 'actions', headerName: 'Actions', width: 150, sortable: false,
      renderCell: (p) => (<Box sx={{ display: 'flex', gap: 0.5 }}><Button size="small" onClick={() => enqueueSnackbar('Resource viewed', { variant: 'info' })}>View</Button><Button size="small" color="error" onClick={() => setDeleteId(p.row.id)}>Delete</Button></Box>),
    },
  ];

  return (
    <Box>
      <PageHeader title="Study Resource Search" breadcrumbs={[{ label: 'Academics' }, { label: 'Resources' }]} actionLabel="Create Resource" actionIcon={<AddIcon />} onAction={() => navigate('/academics/resource-create')} />
      <SearchForm fields={searchFields} onSearch={(f) => setData(storageService.search('study_resources', f))} onReset={refresh} />
      <DataTable rows={data} columns={columns} exportFilename="study-resources" />
      <ConfirmDialog open={!!deleteId} title="Delete Resource" message="Are you sure?" onConfirm={() => { storageService.remove('study_resources', deleteId); refresh(); setDeleteId(null); enqueueSnackbar('Deleted', { variant: 'success' }); }} onCancel={() => setDeleteId(null)} />
    </Box>
  );
}