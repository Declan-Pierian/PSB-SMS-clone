import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import useSearch from '../../hooks/useSearch';

const STORAGE_KEY = 'alumni';
const breadcrumbs = [{ label: 'Agent Management', path: '/agents' }, { label: 'Alumni Approvals' }];

export default function AlumniApprovals() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);


  const searchFields = [{ name: 'name', label: 'Name', type: 'text', gridSize: 3 }, { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Rejected'], gridSize: 2 }];
  const columns = [{ field: 'name', headerName: 'Name', flex: 1.2, minWidth: 150 }, { field: 'program', headerName: 'Program', flex: 0.8, minWidth: 100 }, { field: 'graduationYear', headerName: 'Grad Year', flex: 0.6, minWidth: 80 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];


  return (
    <Box>
      <PageHeader title="Alumni Approvals" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="alumni" />

    </Box>
  );
}
