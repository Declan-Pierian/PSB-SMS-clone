import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import useSearch from '../../hooks/useSearch';

const STORAGE_KEY = 'biometricAbsentees';
const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Attendance' }, { label: 'Biometric - Absentees Report' }];

export default function BiometricAbsentees() {
  const { data, handleSearch, handleReset } = useSearch(STORAGE_KEY);

  const searchFields = [
    { name: 'date', label: 'Date', type: 'date', gridSize: 2 },
    { name: 'program', label: 'Program', type: 'text', gridSize: 3 },
    { name: 'cohort', label: 'Cohort', type: 'text', gridSize: 2 },
    { name: 'threshold', label: 'Threshold (%)', type: 'text', gridSize: 2 }
  ];

  const columns = [
    { field: 'studentId', headerName: 'Student ID', flex: 0.7, minWidth: 100 },
    { field: 'studentName', headerName: 'Student Name', flex: 1.2, minWidth: 150 },
    { field: 'program', headerName: 'Program', flex: 1, minWidth: 120 },
    { field: 'cohort', headerName: 'Cohort', flex: 0.7, minWidth: 90 },
    { field: 'absentDays', headerName: 'Absent Days', flex: 0.7, minWidth: 90 },
    { field: 'totalDays', headerName: 'Total Days', flex: 0.7, minWidth: 90 },
    { field: 'attendancePercentage', headerName: 'Attendance %', flex: 0.7, minWidth: 100 },
    { field: 'lastPresent', headerName: 'Last Present', flex: 0.8, minWidth: 110 }
  ];

  return (
    <Box>
      <PageHeader title="Biometric - Absentees Report" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="biometricAbsentees" />
    </Box>
  );
}
