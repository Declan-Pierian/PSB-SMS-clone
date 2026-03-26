import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import { USER_ROLES } from '../../data/constants';
import AddIcon from '@mui/icons-material/Add';

export default function UserManagement() {
  const [data, setData] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setData(storageService.getAll('users')); }, []);
  const refresh = () => setData(storageService.getAll('users'));

  const searchFields = [
    { name: 'username', label: 'Username' },
    { name: 'name', label: 'Name' },
    { name: 'role', label: 'Role', type: 'select', options: USER_ROLES },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
  ];

  const columns = [
    { field: 'username', headerName: 'Username', width: 130 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'role', headerName: 'Role', width: 150 },
    { field: 'lastLogin', headerName: 'Last Login', width: 130 },
    { field: 'status', headerName: 'Status', width: 110, renderCell: (p) => <StatusChip status={p.value} /> },
    {
      field: 'actions', headerName: 'Actions', width: 250, sortable: false,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button size="small" onClick={() => { setEditing(p.row); setDialogOpen(true); }}>Edit</Button>
          <Button size="small" color="warning" onClick={() => { storageService.update('users', p.row.id, { password: 'reset123' }); enqueueSnackbar('Password reset to default', { variant: 'info' }); }}>Reset Pwd</Button>
          <Button size="small" color="error" onClick={() => setDeleteId(p.row.id)}>Delete</Button>
        </Box>
      ),
    },
  ];

  const formFields = [
    { name: 'username', label: 'Username', required: true, disabled: !!editing },
    { name: 'name', label: 'Full Name', required: true },
    { name: 'email', label: 'Email', required: true },
    { name: 'role', label: 'Role', type: 'select', options: USER_ROLES, required: true },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
  ];

  const handleSubmit = (values) => {
    if (editing) { storageService.update('users', editing.id, values); enqueueSnackbar('User updated', { variant: 'success' }); }
    else { storageService.create('users', { ...values, status: values.status || 'Active', password: 'default123' }); enqueueSnackbar('User created', { variant: 'success' }); }
    refresh(); setDialogOpen(false); setEditing(null);
  };

  return (
    <Box>
      <PageHeader title="User Management" breadcrumbs={[{ label: 'System' }, { label: 'User Management' }]} actionLabel="Add User" actionIcon={<AddIcon />} onAction={() => { setEditing(null); setDialogOpen(true); }} />
      <SearchForm fields={searchFields} onSearch={(f) => setData(storageService.search('users', f))} onReset={refresh} />
      <DataTable rows={data} columns={columns} exportFilename="users" />
      <FormDialog open={dialogOpen} onClose={() => { setDialogOpen(false); setEditing(null); }} onSubmit={handleSubmit} title={editing ? 'Edit User' : 'Add User'} fields={formFields} initialValues={editing || {}} />
      <ConfirmDialog open={!!deleteId} title="Delete User" message="Are you sure?" onConfirm={() => { storageService.remove('users', deleteId); refresh(); setDeleteId(null); enqueueSnackbar('User deleted', { variant: 'success' }); }} onCancel={() => setDeleteId(null)} />
    </Box>
  );
}