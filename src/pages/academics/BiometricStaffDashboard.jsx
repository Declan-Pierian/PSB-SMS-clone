import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const STORAGE_KEY = 'biometricStaffAttendance';
const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Attendance' }, { label: 'Biometric - Staff Attendance Dashboard' }];

export default function BiometricStaffDashboard() {
  const { data, handleSearch, handleReset } = useSearch(STORAGE_KEY);

  const searchFields = [
    { name: 'employeeId', label: 'Employee ID', type: 'text', gridSize: 2 },
    { name: 'employeeName', label: 'Employee Name', type: 'text', gridSize: 3 },
    { name: 'department', label: 'Department', type: 'text', gridSize: 3 },
    { name: 'date', label: 'Date', type: 'date', gridSize: 2 },
    { name: 'status', label: 'Status', type: 'select', options: ['Present', 'Absent', 'Late'], gridSize: 2 }
  ];

  const columns = [
    { field: 'employeeId', headerName: 'Employee ID', flex: 0.7, minWidth: 100 },
    { field: 'employeeName', headerName: 'Employee Name', flex: 1.2, minWidth: 150 },
    { field: 'department', headerName: 'Department', flex: 1, minWidth: 120 },
    { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 100 },
    { field: 'checkInTime', headerName: 'Check In', flex: 0.7, minWidth: 90 },
    { field: 'checkOutTime', headerName: 'Check Out', flex: 0.7, minWidth: 90 },
    { field: 'totalHours', headerName: 'Total Hours', flex: 0.6, minWidth: 90 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }
  ];

  return (
    <Box>
      <PageHeader title="Biometric - Staff Attendance Dashboard" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="biometricStaffAttendance" />
    </Box>
  );
}
