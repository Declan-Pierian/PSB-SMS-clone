import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const STORAGE_KEY = 'biometricStudentAttendance';
const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Attendance' }, { label: 'Biometric - Student Attendance Dashboard' }];

export default function BiometricStudentDashboard() {
  const { data, handleSearch, handleReset } = useSearch(STORAGE_KEY);

  const searchFields = [
    { name: 'studentId', label: 'Student ID', type: 'text', gridSize: 2 },
    { name: 'studentName', label: 'Student Name', type: 'text', gridSize: 3 },
    { name: 'program', label: 'Program', type: 'text', gridSize: 3 },
    { name: 'date', label: 'Date', type: 'date', gridSize: 2 },
    { name: 'status', label: 'Status', type: 'select', options: ['Present', 'Absent', 'Late'], gridSize: 2 }
  ];

  const columns = [
    { field: 'studentId', headerName: 'Student ID', flex: 0.7, minWidth: 100 },
    { field: 'studentName', headerName: 'Student Name', flex: 1.2, minWidth: 150 },
    { field: 'program', headerName: 'Program', flex: 1, minWidth: 120 },
    { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 100 },
    { field: 'checkInTime', headerName: 'Check In', flex: 0.7, minWidth: 90 },
    { field: 'checkOutTime', headerName: 'Check Out', flex: 0.7, minWidth: 90 },
    { field: 'totalHours', headerName: 'Total Hours', flex: 0.6, minWidth: 90 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }
  ];

  return (
    <Box>
      <PageHeader title="Biometric - Student Attendance Dashboard" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="biometricStudentAttendance" />
    </Box>
  );
}
