import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Student Attendance' }];

export default function StudentAttendance() {
  const { data, handleSearch, handleReset } = useSearch('attendance');

  const searchFields = [{ name: 'studentName', label: 'Student', type: 'text', gridSize: 3 }, { name: 'module', label: 'Module', type: 'text', gridSize: 3 }, { name: 'status', label: 'Status', type: 'select', options: ['Present', 'Absent', 'Late', 'Excused'], gridSize: 2 }];
  const columns = [{ field: 'date', headerName: 'Date', flex: 0.7, minWidth: 100 },
    { field: 'studentName', headerName: 'Student', flex: 1.2, minWidth: 150 },
    { field: 'module', headerName: 'Module', flex: 1, minWidth: 130 },
    { field: 'time', headerName: 'Time', flex: 0.6, minWidth: 90 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];

  return (
    <Box>
      <PageHeader title="Student Attendance" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="attendance" />
    </Box>
  );
}
