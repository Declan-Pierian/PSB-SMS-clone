import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import useSearch from '../../hooks/useSearch';

const STORAGE_KEY = 'agentRenewals';
const breadcrumbs = [{ label: 'Agent Management', path: '/agents' }, { label: 'Renewal Approval' }];

export default function RenewalApproval() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);


  const searchFields = [{ name: 'agentName', label: 'Agent', type: 'text', gridSize: 3 }, { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Rejected'], gridSize: 2 }];
  const columns = [{ field: 'agentName', headerName: 'Agent', flex: 1, minWidth: 130 }, { field: 'company', headerName: 'Company', flex: 1, minWidth: 130 }, { field: 'recommendation', headerName: 'Recommendation', flex: 0.8, minWidth: 110 }, { field: 'performanceScore', headerName: 'Score', flex: 0.5, minWidth: 70 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];


  return (
    <Box>
      <PageHeader title="Renewal Approval" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="agentRenewals" />

    </Box>
  );
}
