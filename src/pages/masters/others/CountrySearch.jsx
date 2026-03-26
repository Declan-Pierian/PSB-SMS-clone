import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../../components/common/PageHeader';
import SearchForm from '../../../components/common/SearchForm';
import DataTable from '../../../components/common/DataTable';
import FormDialog from '../../../components/common/FormDialog';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import storageService from '../../../services/storageService';
import AddIcon from '@mui/icons-material/Add';

export default function CountrySearch() {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setData(storageService.getAll('countries')); }, []);
  const refresh = () => setData(storageService.getAll('countries'));

  const searchFields = [
    { name: 'name', label: 'Country Name' },
    { name: 'region', label: 'Region', type: 'select', options: ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'] },
  ];

  const columns = [
    { field: 'code', headerName: 'Code', width: 100 },
    { field: 'name', headerName: 'Country Name', flex: 1 },
    { field: 'region', headerName: 'Region', width: 150 },
    { field: 'nationality', headerName: 'Nationality', width: 150 },
    {
      field: 'actions', headerName: 'Actions', width: 150, sortable: false,
      renderCell: (p) => (<Box sx={{ display: 'flex', gap: 0.5 }}><Button size="small" onClick={() => { setEditing(p.row); setDialogOpen(true); }}>Edit</Button><Button size="small" color="error" onClick={() => setDeleteId(p.row.id)}>Delete</Button></Box>),
    },
  ];

  const formFields = [
    { name: 'code', label: 'Country Code', required: true },
    { name: 'name', label: 'Country Name', required: true },
    { name: 'region', label: 'Region', type: 'select', options: ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'] },
    { name: 'nationality', label: 'Nationality' },
  ];

  const handleSubmit = (v) => {
    if (editing) { storageService.update('countries', editing.id, v); enqueueSnackbar('Country updated', { variant: 'success' }); }
    else { storageService.create('countries', v); enqueueSnackbar('Country added', { variant: 'success' }); }
    refresh(); setDialogOpen(false); setEditing(null);
  };

  return (
    <Box>
      <PageHeader title="Country Search" breadcrumbs={[{ label: 'Masters' }, { label: 'Countries' }]} actionLabel="Add Country" actionIcon={<AddIcon />} onAction={() => { setEditing(null); setDialogOpen(true); }} />
      <SearchForm fields={searchFields} onSearch={(f) => setData(storageService.search('countries', f))} onReset={refresh} />
      <DataTable rows={data} columns={columns} exportFilename="countries" />
      <FormDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditing(null); }} onSubmit={handleSubmit} title={editing ? 'Edit Country' : 'Add Country'} fields={formFields} initialValues={editing || {}} />
      <ConfirmDialog open={!!deleteId} title="Delete Country" message="Are you sure?" onConfirm={() => { storageService.remove('countries', deleteId); refresh(); setDeleteId(null); enqueueSnackbar('Deleted', { variant: 'success' }); }} onCancel={() => setDeleteId(null)} />
    </Box>
  );
}