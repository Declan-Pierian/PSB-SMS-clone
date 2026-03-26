import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Exam Attendance' }];

export default function ExamScheduleAttendance() {
  const { data, handleSearch, handleReset } = useSearch('tests');

  const searchFields = [{ name: 'name', label: 'Exam', type: 'text', gridSize: 3 }, { name: 'date', label: 'Date', type: 'date', gridSize: 2 }];
  const columns = [{ field: 'name', headerName: 'Exam', flex: 1.2, minWidth: 150 },
    { field: 'moduleName', headerName: 'Module', flex: 1, minWidth: 130 },
    { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 100 },
    { field: 'maxMarks', headerName: 'Max Marks', flex: 0.5, minWidth: 80 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];

  return (
    <Box>
      <PageHeader title="Exam Schedule Attendance" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="tests" />
    </Box>
  );
}
