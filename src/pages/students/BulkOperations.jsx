import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Paper, Typography, TextField, MenuItem, Button, Alert, Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import { useSnackbar } from 'notistack';
import { STUDENT_STATUSES, ENQUIRY_TYPES, SORT_BY_OPTIONS } from '../../data/constants';

const OPERATION_TYPES = [
  { value: 'status_change', label: 'Change Placement Status' },
  { value: 'program_transfer', label: 'Program Transfer' },
  { value: 'update_transport', label: 'Update Transport Template' },
  { value: 'add_sub_batch', label: 'Add Sub-Batch' },
  { value: 'payment_slips', label: 'Payment Slips' },
  { value: 'add_demand', label: 'Add Demand (Fee)' },
  { value: 'assign_staff', label: 'Assign to Staff' },
  { value: 'assign_mentor', label: 'Assign Mentor' },
  { value: 'inventory', label: 'Inventory Management' },
  { value: 'student_enrollment', label: 'Student Enrollment' },
  { value: 'issue_material', label: 'Issue Material' },
  { value: 'reminder_slip', label: 'Reminder Slip' },
  { value: 'student_photos', label: 'Student Photos (Bulk Print)' },
  { value: 'add_group', label: 'Add Group' },
  { value: 'batch_delete', label: 'Batch Delete' },
];

export default function BulkOperations() {
  const { enqueueSnackbar } = useSnackbar();
  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [operationType, setOperationType] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newProgram, setNewProgram] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState(null);

  const [searchFilters, setSearchFilters] = useState({});

  const loadStudents = useCallback(() => {
    let allStudents = storageService.getAll('students');
    if (Object.keys(searchFilters).length > 0) {
      allStudents = allStudents.filter((s) => {
        return Object.entries(searchFilters).every(([key, val]) => {
          if (!val) return true;
          const sVal = String(s[key] || '').toLowerCase();
          return sVal.includes(String(val).toLowerCase());
        });
      });
    }
    setStudents(allStudents);
  }, [searchFilters]);

  useEffect(() => {
    loadStudents();
    setPrograms(storageService.getAll('programs'));
  }, [loadStudents]);

  const handleSearchFilter = (vals) => setSearchFilters(vals);
  const handleResetFilter = () => setSearchFilters({});

  const filterFields = [
    { name: 'studentId', label: 'Student Code', gridSize: 2 },
    { name: 'name', label: 'Name', gridSize: 2 },
    { name: 'hallTicket', label: 'Hall Ticket Number', gridSize: 2 },
    { name: 'batch', label: 'Batch Code', gridSize: 2 },
    { name: 'status', label: 'Status', type: 'select', options: STUDENT_STATUSES, gridSize: 2 },
    { name: 'enquiryType', label: 'Enquiry Type', type: 'select', options: ENQUIRY_TYPES, gridSize: 2 },
    { name: 'sortBy', label: 'Sort By', type: 'select', options: SORT_BY_OPTIONS, gridSize: 2 },
  ];

  const columns = [
    { field: 'studentId', headerName: 'Student Code', width: 120 },
    { field: 'name', headerName: 'Student Name', width: 180, flex: 1 },
    { field: 'program', headerName: 'Course', width: 180 },
    { field: 'term', headerName: 'Term', width: 90 },
    { field: 'intake', headerName: 'Intake', width: 120 },
    { field: 'intakeStartDate', headerName: 'Intake Start', width: 110 },
    { field: 'intakeEndDate', headerName: 'Intake End', width: 110 },
    { field: 'moduleStartDate', headerName: 'Module Start', width: 110 },
    { field: 'moduleEndDate', headerName: 'Module End', width: 110 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
  ];

  const programOptions = programs.map((p) => ({
    value: p.name || p.programName || p.courseName || p.id,
    label: p.name || p.programName || p.courseName || p.id,
  }));

  const handleSelectionChange = (selectionModel) => {
    setSelectedIds(selectionModel);
  };

  const getConfirmMessage = () => {
    const count = selectedIds.length;
    switch (operationType) {
      case 'status_change':
        return `Are you sure you want to change the status of ${count} student(s) to "${newStatus}"?`;
      case 'program_transfer':
        return `Are you sure you want to transfer ${count} student(s) to program "${newProgram}"?`;
      case 'batch_delete':
        return `Are you sure you want to DELETE ${count} student(s)? This action cannot be undone.`;
      default:
        return '';
    }
  };

  const handleExecuteClick = () => {
    if (selectedIds.length === 0) {
      enqueueSnackbar('Please select at least one student', { variant: 'warning' });
      return;
    }

    if (operationType === 'status_change' && !newStatus) {
      enqueueSnackbar('Please select a new status', { variant: 'warning' });
      return;
    }

    if (operationType === 'program_transfer' && !newProgram) {
      enqueueSnackbar('Please select a target program', { variant: 'warning' });
      return;
    }

    setConfirmOpen(true);
  };

  const handleExecute = () => {
    let successCount = 0;
    let failCount = 0;

    selectedIds.forEach((id) => {
      try {
        switch (operationType) {
          case 'status_change':
            storageService.update('students', id, { status: newStatus });
            successCount++;
            break;
          case 'program_transfer':
            storageService.update('students', id, { program: newProgram });
            successCount++;
            break;
          case 'batch_delete':
            storageService.remove('students', id);
            successCount++;
            break;
          default:
            break;
        }
      } catch {
        failCount++;
      }
    });

    const opLabel = OPERATION_TYPES.find((o) => o.value === operationType)?.label || operationType;
    setResult({
      type: failCount === 0 ? 'success' : 'warning',
      message: `${opLabel} completed: ${successCount} succeeded, ${failCount} failed out of ${selectedIds.length} selected.`,
    });

    enqueueSnackbar(`Bulk operation completed: ${successCount} student(s) processed`, {
      variant: failCount === 0 ? 'success' : 'warning',
    });

    setConfirmOpen(false);
    setSelectedIds([]);
    loadStudents();
  };

  const isExecuteDisabled = !operationType || selectedIds.length === 0 ||
    (operationType === 'status_change' && !newStatus) ||
    (operationType === 'program_transfer' && !newProgram);

  return (
    <Box>
      <PageHeader
        title="Bulk Student Operations"
        breadcrumbs={[
          { label: 'Students', path: '/students/search' },
          { label: 'Bulk Operations' },
        ]}
      />

      <SearchForm fields={filterFields} onSearch={handleSearchFilter} onReset={handleResetFilter} />

      <Paper sx={{ p: 2.5, mb: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#333' }}>
          Operation Configuration
        </Typography>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              select fullWidth label="Operation Type" value={operationType}
              onChange={(e) => { setOperationType(e.target.value); setResult(null); }}
              size="small" required
            >
              {OPERATION_TYPES.map((op) => (
                <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {operationType === 'status_change' && (
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                select fullWidth label="New Status" value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                size="small" required
              >
                {STUDENT_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </TextField>
            </Grid>
          )}

          {operationType === 'program_transfer' && (
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                select fullWidth label="Target Program" value={newProgram}
                onChange={(e) => setNewProgram(e.target.value)}
                size="small" required
              >
                {programOptions.map((p) => (
                  <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                ))}
                {programOptions.length === 0 && (
                  <MenuItem disabled value="">No programs available</MenuItem>
                )}
              </TextField>
            </Grid>
          )}

          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={handleExecuteClick}
              disabled={isExecuteDisabled}
              fullWidth
              sx={{ backgroundColor: operationType === 'batch_delete' ? '#d32f2f' : '#b30537', '&:hover': { backgroundColor: operationType === 'batch_delete' ? '#b71c1c' : '#800025' } }}
            >
              Execute ({selectedIds.length} selected)
            </Button>
          </Grid>
        </Grid>

        {operationType && (
          <Box sx={{ mt: 2 }}>
            <Alert severity={operationType === 'batch_delete' ? 'warning' : 'info'} icon={operationType === 'batch_delete' ? <WarningAmberIcon /> : undefined}>
              {operationType === 'status_change' && 'Select students below, then choose a new status to apply to all selected students.'}
              {operationType === 'program_transfer' && 'Select students below, then choose a target program to transfer all selected students.'}
              {operationType === 'batch_delete' && 'WARNING: Select students below for permanent deletion. This action cannot be undone.'}
            </Alert>
          </Box>
        )}
      </Paper>

      {result && (
        <Alert
          severity={result.type}
          icon={result.type === 'success' ? <CheckCircleOutlineIcon /> : <WarningAmberIcon />}
          onClose={() => setResult(null)}
          sx={{ mb: 2 }}
        >
          {result.message}
        </Alert>
      )}

      <Box sx={{ mb: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          {selectedIds.length} of {students.length} students selected
        </Typography>
        {selectedIds.length > 0 && (
          <Chip
            label="Clear Selection"
            size="small"
            variant="outlined"
            onClick={() => setSelectedIds([])}
            onDelete={() => setSelectedIds([])}
          />
        )}
      </Box>

      <DataTable
        rows={students}
        columns={columns}
        checkboxSelection
        onSelectionChange={handleSelectionChange}
        exportFilename="students_bulk"
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Bulk Operation"
        message={getConfirmMessage()}
        onConfirm={handleExecute}
        onCancel={() => setConfirmOpen(false)}
        confirmLabel="Execute"
        severity={operationType === 'batch_delete' ? 'error' : 'warning'}
      />
    </Box>
  );
}
