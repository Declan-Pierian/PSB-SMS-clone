import React, { useState, useCallback } from 'react';
import { Box, Button, Tooltip, IconButton } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Freeze Test' }];

export default function FreezeTest() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch('tests');

  const handleFreeze = useCallback((row) => {
    storageService.update('tests', row.id, { ...row, status: 'Frozen' });
    enqueueSnackbar('Test frozen successfully', { variant: 'success' });
    refresh();
  }, [enqueueSnackbar, refresh]);

  const searchFields = [
    { name: 'name', label: 'Test Name', type: 'text', gridSize: 3 },
    { name: 'module', label: 'Module', type: 'text', gridSize: 3 },
    { name: 'status', label: 'Status', type: 'select', options: ['Draft', 'Published', 'Frozen'], gridSize: 2 },
  ];

  const columns = [
    { field: 'name', headerName: 'Test', flex: 1.2, minWidth: 160 },
    { field: 'moduleName', headerName: 'Module', flex: 1, minWidth: 130 },
    { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 100 },
    { field: 'maxMarks', headerName: 'Max Marks', flex: 0.5, minWidth: 80 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'actions', headerName: 'Actions', flex: 0.5, minWidth: 80, sortable: false, renderCell: (p) => p.row.status !== 'Frozen' ? (
      <Tooltip title="Freeze"><IconButton size="small" onClick={() => handleFreeze(p.row)} color="primary"><LockIcon fontSize="small" /></IconButton></Tooltip>
    ) : null },
  ];

  return (
    <Box>
      <PageHeader title="Freeze Test" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="freeze-test" />
    </Box>
  );
}
