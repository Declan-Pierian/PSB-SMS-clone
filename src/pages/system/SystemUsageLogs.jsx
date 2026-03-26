import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'System', path: '/system' }, { label: 'Usage Logs' }];

export default function SystemUsageLogs() {
  const { data, handleSearch, handleReset } = useSearch('auditTrail');

  const searchFields = [{ name: 'user', label: 'User', type: 'text', gridSize: 3 }, { name: 'action', label: 'Action', type: 'select', options: ['Login', 'Create', 'Update', 'Delete', 'View', 'Export'], gridSize: 2 }];
  const columns = [{ field: 'timestamp', headerName: 'Timestamp', flex: 1, minWidth: 150 }, { field: 'user', headerName: 'User', flex: 0.8, minWidth: 110 }, { field: 'action', headerName: 'Action', flex: 0.6, minWidth: 90 }, { field: 'target', headerName: 'Target', flex: 1, minWidth: 130 }, { field: 'details', headerName: 'Details', flex: 1.5, minWidth: 200 }, { field: 'ipAddress', headerName: 'IP', flex: 0.7, minWidth: 100 }];

  return (
    <Box>
      <PageHeader title="System Usage Logs" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="auditTrail" />
    </Box>
  );
}
