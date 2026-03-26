import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'Reports', path: '/reports' }, { label: 'Daily Consolidated' }];

export default function DailyConsolidatedAttendance() {
  const { data, handleSearch, handleReset } = useSearch('timetable');

  const searchFields = [{ name: 'day', label: 'Day', type: 'select', options: ['Monday','Tuesday','Wednesday','Thursday','Friday'], gridSize: 2 }];
  const columns = [{ field: 'moduleName', headerName: 'Module', flex: 1.2, minWidth: 150 }, { field: 'cohort', headerName: 'Cohort', flex: 0.8, minWidth: 100 }, { field: 'day', headerName: 'Day', flex: 0.6, minWidth: 80 }, { field: 'time', headerName: 'Time', flex: 0.7, minWidth: 100 }, { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 }];

  return (
    <Box>
      <PageHeader title="Daily Consolidated Attendance" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="timetable" />
    </Box>
  );
}
