import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'System', path: '/system' }, { label: 'Usage Report' }];

export default function UsageReport() {
  const { data, handleSearch, handleReset } = useSearch('auditTrail');

  const searchFields = [{ name: 'user', label: 'User', type: 'text', gridSize: 3 }, { name: 'action', label: 'Action', type: 'text', gridSize: 3 }];
  const columns = [{ field: 'action', headerName: 'Feature', flex: 0.8, minWidth: 100 }, { field: 'target', headerName: 'Module', flex: 1, minWidth: 130 }, { field: 'user', headerName: 'User', flex: 0.8, minWidth: 110 }, { field: 'timestamp', headerName: 'Last Used', flex: 1, minWidth: 150 }];

  return (
    <Box>
      <PageHeader title="Usage Report" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="auditTrail" />
    </Box>
  );
}
