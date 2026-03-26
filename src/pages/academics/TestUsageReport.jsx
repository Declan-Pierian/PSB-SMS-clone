import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Test Usage Report' }];

export default function TestUsageReport() {
  const { data, handleSearch, handleReset } = useSearch('tests');

  const searchFields = [{ name: 'name', label: 'Test', type: 'text', gridSize: 3 }, { name: 'moduleName', label: 'Module', type: 'text', gridSize: 3 }];
  const columns = [{ field: 'name', headerName: 'Test', flex: 1.2, minWidth: 150 },
    { field: 'moduleName', headerName: 'Module', flex: 1, minWidth: 130 },
    { field: 'category', headerName: 'Category', flex: 0.7, minWidth: 100 },
    { field: 'date', headerName: 'Last Used', flex: 0.7, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];

  return (
    <Box>
      <PageHeader title="Test Usage Report" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="tests" />
    </Box>
  );
}
