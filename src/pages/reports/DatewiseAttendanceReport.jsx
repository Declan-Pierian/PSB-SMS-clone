import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'Reports', path: '/reports' }, { label: 'Date Wise Attendance' }];

export default function DateWiseAttendanceReport() {
  const { data, handleSearch, handleReset } = useSearch('timetable');

  const searchFields = [{ name: 'day', label: 'Day', type: 'select', options: ['Monday','Tuesday','Wednesday','Thursday','Friday'], gridSize: 2 }, { name: 'moduleName', label: 'Module', type: 'text', gridSize: 3 }];
  const columns = [{ field: 'day', headerName: 'Day', flex: 0.6, minWidth: 80 }, { field: 'moduleName', headerName: 'Module', flex: 1.2, minWidth: 150 }, { field: 'cohort', headerName: 'Cohort', flex: 0.8, minWidth: 100 }, { field: 'time', headerName: 'Time', flex: 0.7, minWidth: 100 }, { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 }];

  return (
    <Box>
      <PageHeader title="Date Wise Attendance Report" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="timetable" />
    </Box>
  );
}
