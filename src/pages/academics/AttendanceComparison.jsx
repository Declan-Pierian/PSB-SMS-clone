import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Attendance Comparison' }];

export default function AttendanceComparisonReport() {
  const { data, handleSearch, handleReset } = useSearch('timetable');

  const searchFields = [{ name: 'cohort', label: 'Cohort', type: 'text', gridSize: 3 }, { name: 'moduleName', label: 'Module', type: 'text', gridSize: 3 }];
  const columns = [{ field: 'moduleName', headerName: 'Module', flex: 1.2, minWidth: 150 },
    { field: 'cohort', headerName: 'Cohort', flex: 0.8, minWidth: 100 },
    { field: 'day', headerName: 'Day', flex: 0.6, minWidth: 80 },
    { field: 'time', headerName: 'Time', flex: 0.7, minWidth: 100 },
    { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 }];

  return (
    <Box>
      <PageHeader title="Attendance Comparison Report" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="timetable" />
    </Box>
  );
}
