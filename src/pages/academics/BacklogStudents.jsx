import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Backlog Students' }];

export default function BacklogStudentsReport() {
  const { data, handleSearch, handleReset } = useSearch('students');

  const searchFields = [{ name: 'program', label: 'Program', type: 'text', gridSize: 3 }, { name: 'cohort', label: 'Cohort', type: 'text', gridSize: 3 }];
  const columns = [{ field: 'studentCode', headerName: 'Student Code', flex: 0.8, minWidth: 110 },
    { field: 'name', headerName: 'Student', flex: 1.2, minWidth: 150 },
    { field: 'program', headerName: 'Program', flex: 0.8, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];

  return (
    <Box>
      <PageHeader title="Backlog Students Report" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="students" />
    </Box>
  );
}
