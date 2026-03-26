import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'Reports', path: '/reports' }, { label: 'Video Stream Logs' }];

export default function VideoStreamLogs() {
  const { data, handleSearch, handleReset } = useSearch('auditTrail');

  const searchFields = [{ name: 'user', label: 'User', type: 'text', gridSize: 3 }, { name: 'action', label: 'Action', type: 'text', gridSize: 3 }];
  const columns = [{ field: 'timestamp', headerName: 'Date/Time', flex: 1, minWidth: 150 }, { field: 'user', headerName: 'User', flex: 0.8, minWidth: 110 }, { field: 'action', headerName: 'Action', flex: 0.8, minWidth: 100 }, { field: 'target', headerName: 'Target', flex: 1, minWidth: 130 }, { field: 'details', headerName: 'Details', flex: 1.5, minWidth: 200 }];

  return (
    <Box>
      <PageHeader title="Video Stream Logs" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="auditTrail" />
    </Box>
  );
}
