import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Failed Percentage Report' }];

export default function FailedPercentageReport() {
  const { data, handleSearch, handleReset } = useSearch('tests');

  const searchFields = [{ name: 'moduleName', label: 'Module', type: 'text', gridSize: 3 }, { name: 'program', label: 'Program', type: 'text', gridSize: 3 }];
  const columns = [{ field: 'moduleName', headerName: 'Module', flex: 1.2, minWidth: 150 },
    { field: 'maxMarks', headerName: 'Max Marks', flex: 0.5, minWidth: 80 },
    { field: 'passMarks', headerName: 'Pass Marks', flex: 0.5, minWidth: 80 },
    { field: 'category', headerName: 'Category', flex: 0.7, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];

  return (
    <Box>
      <PageHeader title="Failed Percentage Report" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="tests" />
    </Box>
  );
}
