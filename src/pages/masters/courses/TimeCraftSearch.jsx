import React, { useState } from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../../components/common/PageHeader';
import SearchForm from '../../../components/common/SearchForm';
import DataTable from '../../../components/common/DataTable';
import storageService from '../../../services/storageService';

export default function TimeCraftSearch() {
  const [data, setData] = useState(storageService.getAll('timetable'));
  const refresh = () => setData(storageService.getAll('timetable'));

  const searchFields = [
    { name: 'module', label: 'Module' },
    { name: 'day', label: 'Day', type: 'select', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
    { name: 'room', label: 'Room' },
    { name: 'lecturer', label: 'Lecturer' },
  ];

  const columns = [
    { field: 'module', headerName: 'Module', flex: 1 },
    { field: 'day', headerName: 'Day', width: 120 },
    { field: 'startTime', headerName: 'Start Time', width: 110 },
    { field: 'endTime', headerName: 'End Time', width: 110 },
    { field: 'room', headerName: 'Room', width: 120 },
    { field: 'lecturer', headerName: 'Lecturer', width: 150 },
    { field: 'cohort', headerName: 'Cohort', width: 130 },
  ];

  return (
    <Box>
      <PageHeader title="TimeCraft Search" breadcrumbs={[{ label: 'Masters' }, { label: 'TimeCraft' }]} />
      <SearchForm fields={searchFields} onSearch={(f) => setData(storageService.search('timetable', f))} onReset={refresh} />
      <DataTable rows={data} columns={columns} exportFilename="timecraft" />
    </Box>
  );
}