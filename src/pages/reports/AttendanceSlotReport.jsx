import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'Reports', path: '/reports' }, { label: 'Attendance Slot' }];

export default function AttendanceSlotReport() {
  const { data, handleSearch, handleReset } = useSearch('timetable');

  const searchFields = [{ name: 'cohort', label: 'Cohort', type: 'text', gridSize: 3 }];
  const columns = [{ field: 'time', headerName: 'Slot', flex: 0.8, minWidth: 100 }, { field: 'moduleName', headerName: 'Module', flex: 1.2, minWidth: 150 }, { field: 'day', headerName: 'Day', flex: 0.6, minWidth: 80 }, { field: 'cohort', headerName: 'Cohort', flex: 0.8, minWidth: 100 }, { field: 'room', headerName: 'Room', flex: 0.5, minWidth: 70 }];

  return (
    <Box>
      <PageHeader title="Attendance Slot Report" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="timetable" />
    </Box>
  );
}
