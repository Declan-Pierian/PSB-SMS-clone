import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'Reports', path: '/reports' }, { label: 'Instructor Feedback' }];

export default function InstructorFeedbackReport() {
  const { data, handleSearch, handleReset } = useSearch('employees');

  const searchFields = [{ name: 'name', label: 'Instructor', type: 'text', gridSize: 3 }, { name: 'department', label: 'Department', type: 'text', gridSize: 3 }];
  const columns = [{ field: 'name', headerName: 'Instructor', flex: 1.2, minWidth: 150 }, { field: 'department', headerName: 'Department', flex: 0.8, minWidth: 110 }, { field: 'designation', headerName: 'Designation', flex: 0.8, minWidth: 110 }, { field: 'type2', headerName: 'Type', flex: 0.6, minWidth: 90 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];

  return (
    <Box>
      <PageHeader title="Instructor Feedback Report" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="employees" />
    </Box>
  );
}
