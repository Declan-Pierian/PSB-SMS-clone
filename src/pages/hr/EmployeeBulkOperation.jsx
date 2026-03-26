import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import {
  EMPLOYEE_TYPES,
  EMPLOYEE_DESIGNATIONS,
  EMPLOYEE_STATUSES,
} from '../../data/constants';

const STORAGE_KEY = 'employees';

const breadcrumbs = [
  { label: 'HR', path: '/hr' },
  { label: 'Bulk Operations' },
];

const OPERATIONS = [
  { value: 'statusChange', label: 'Status Change' },
  { value: 'departmentTransfer', label: 'Department Transfer' },
  { value: 'designationChange', label: 'Designation Change' },
];

const DEPARTMENTS = [
  'Computer Science',
  'Business Administration',
  'Engineering',
  'Arts & Social Sciences',
  'Finance',
  'Human Resources',
  'Marketing',
  'Operations',
  'Student Services',
  'IT Support',
];

const steps = ['Select Operation', 'Select Employees', 'Enter New Value', 'Confirm & Apply'];

function getOptionsForOperation(operation) {
  switch (operation) {
    case 'statusChange':
      return EMPLOYEE_STATUSES;
    case 'departmentTransfer':
      return DEPARTMENTS;
    case 'designationChange':
      return EMPLOYEE_DESIGNATIONS;
    default:
      return [];
  }
}

function getFieldForOperation(operation) {
  switch (operation) {
    case 'statusChange':
      return 'status';
    case 'departmentTransfer':
      return 'department';
    case 'designationChange':
      return 'designation';
    default:
      return '';
  }
}

function getLabelForOperation(operation) {
  switch (operation) {
    case 'statusChange':
      return 'New Status';
    case 'departmentTransfer':
      return 'New Department';
    case 'designationChange':
      return 'New Designation';
    default:
      return 'New Value';
  }
}

export default function EmployeeBulkOperation() {
  const { enqueueSnackbar } = useSnackbar();

  const [activeStep, setActiveStep] = useState(0);
  const [operation, setOperation] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [newValue, setNewValue] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [result, setResult] = useState(null);

  const employees = useMemo(() => storageService.getAll(STORAGE_KEY), [result]);

  const selectedEmployees = useMemo(
    () => employees.filter((e) => selectedIds.includes(e.id)),
    [employees, selectedIds]
  );

  const handleOperationChange = useCallback((value) => {
    setOperation(value);
    setSelectedIds([]);
    setNewValue('');
    setResult(null);
    if (value) {
      setActiveStep(1);
    }
  }, []);

  const handleSelectionChange = useCallback((selectionModel) => {
    setSelectedIds(selectionModel);
  }, []);

  const handleNext = useCallback(() => {
    if (activeStep === 1 && selectedIds.length === 0) {
      enqueueSnackbar('Please select at least one employee', { variant: 'warning' });
      return;
    }
    if (activeStep === 2 && !newValue) {
      enqueueSnackbar('Please select a new value', { variant: 'warning' });
      return;
    }
    if (activeStep === 3) {
      setConfirmOpen(true);
      return;
    }
    setActiveStep((prev) => prev + 1);
  }, [activeStep, selectedIds, newValue, enqueueSnackbar]);

  const handleBack = useCallback(() => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleApply = useCallback(() => {
    const field = getFieldForOperation(operation);
    let successCount = 0;
    let errorCount = 0;

    selectedIds.forEach((id) => {
      try {
        storageService.update(STORAGE_KEY, id, { [field]: newValue });
        successCount++;
      } catch (err) {
        errorCount++;
      }
    });

    setConfirmOpen(false);
    setResult({ success: successCount, errors: errorCount });
    enqueueSnackbar(
      `Bulk operation complete: ${successCount} employees updated${errorCount > 0 ? `, ${errorCount} errors` : ''}`,
      { variant: successCount > 0 ? 'success' : 'error' }
    );
  }, [operation, selectedIds, newValue, enqueueSnackbar]);

  const handleReset = useCallback(() => {
    setActiveStep(0);
    setOperation('');
    setSelectedIds([]);
    setNewValue('');
    setResult(null);
  }, []);

  const columns = [
    { field: 'employeeId', headerName: 'Employee ID', flex: 0.8, minWidth: 110 },
    { field: 'name', headerName: 'Name', flex: 1.2, minWidth: 150 },
    { field: 'department', headerName: 'Department', flex: 1, minWidth: 140 },
    { field: 'designation', headerName: 'Designation', flex: 1, minWidth: 140 },
    { field: 'type', headerName: 'Type', flex: 0.8, minWidth: 110 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
  ];

  const summaryColumns = [
    { field: 'employeeId', headerName: 'Employee ID', flex: 0.8, minWidth: 110 },
    { field: 'name', headerName: 'Name', flex: 1.2, minWidth: 150 },
    {
      field: getFieldForOperation(operation),
      headerName: 'Current Value',
      flex: 1,
      minWidth: 140,
      renderCell: (params) => {
        const val = params.value;
        if (getFieldForOperation(operation) === 'status') return <StatusChip status={val} />;
        return val;
      },
    },
    {
      field: '_newValue',
      headerName: 'New Value',
      flex: 1,
      minWidth: 140,
      renderCell: () => {
        if (getFieldForOperation(operation) === 'status') return <StatusChip status={newValue} />;
        return (
          <Chip
            label={newValue}
            size="small"
            sx={{ backgroundColor: '#e8f5e9', color: '#2e7d32', fontWeight: 600, fontSize: '0.75rem' }}
          />
        );
      },
    },
  ];

  return (
    <Box>
      <PageHeader title="Employee Bulk Operations" breadcrumbs={breadcrumbs} />

      <Paper sx={{ p: 3, mb: 2.5 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {result && (
          <Alert
            severity={result.errors > 0 ? 'warning' : 'success'}
            icon={<CheckCircleIcon />}
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={handleReset}>
                Start New Operation
              </Button>
            }
          >
            Bulk operation completed: {result.success} employees updated successfully
            {result.errors > 0 && `, ${result.errors} errors encountered`}.
          </Alert>
        )}

        {/* Step 0: Select Operation */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Select Bulk Operation
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  select
                  fullWidth
                  label="Operation Type"
                  value={operation}
                  onChange={(e) => handleOperationChange(e.target.value)}
                  size="small"
                >
                  {OPERATIONS.map((op) => (
                    <MenuItem key={op.value} value={op.value}>
                      {op.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Step 1: Select Employees */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Select Employees ({selectedIds.length} selected)
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Use the checkboxes to select employees for the {OPERATIONS.find((o) => o.value === operation)?.label || 'operation'}.
            </Alert>
            <DataTable
              rows={employees}
              columns={columns}
              checkboxSelection
              onSelectionChange={handleSelectionChange}
              exportFilename="employees-bulk"
            />
          </Box>
        )}

        {/* Step 2: Enter New Value */}
        {activeStep === 2 && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              {getLabelForOperation(operation)}
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              {selectedIds.length} employee{selectedIds.length !== 1 ? 's' : ''} selected. Choose the new value to apply.
            </Alert>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  select
                  fullWidth
                  label={getLabelForOperation(operation)}
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  size="small"
                >
                  {getOptionsForOperation(operation).map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Step 3: Confirm */}
        {activeStep === 3 && (
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Review Changes
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              The following {selectedIds.length} employee{selectedIds.length !== 1 ? 's' : ''} will have their{' '}
              <strong>{getFieldForOperation(operation)}</strong> changed to <strong>"{newValue}"</strong>.
            </Alert>
            <DataTable
              rows={selectedEmployees}
              columns={summaryColumns}
              exportFilename="bulk-operation-preview"
            />
          </Box>
        )}

        {/* Navigation Buttons */}
        {!result && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
            {activeStep > 0 && (
              <Button variant="outlined" color="inherit" onClick={handleBack}>
                Back
              </Button>
            )}
            {activeStep > 0 && (
              <Button
                variant="contained"
                startIcon={activeStep === 3 ? <PlayArrowIcon /> : undefined}
                onClick={handleNext}
                sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}
              >
                {activeStep === 3 ? 'Apply Changes' : 'Next'}
              </Button>
            )}
          </Box>
        )}
      </Paper>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Bulk Operation"
        message={`Are you sure you want to update ${selectedIds.length} employee${selectedIds.length !== 1 ? 's' : ''}? This will change the ${getFieldForOperation(operation)} to "${newValue}" for all selected employees.`}
        onConfirm={handleApply}
        onCancel={() => setConfirmOpen(false)}
        severity="warning"
        confirmLabel="Apply Changes"
      />
    </Box>
  );
}
