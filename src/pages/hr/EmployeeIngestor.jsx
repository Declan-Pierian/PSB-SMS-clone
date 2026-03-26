import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  Alert,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PublishIcon from '@mui/icons-material/Publish';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import FileUpload from '../../components/common/FileUpload';
import FormDialog from '../../components/common/FormDialog';
import storageService from '../../services/storageService';
import {
  EMPLOYEE_TYPES,
  EMPLOYEE_DESIGNATIONS,
  EMPLOYEE_STATUSES,
} from '../../data/constants';

const STORAGE_KEY = 'employees';

const breadcrumbs = [
  { label: 'HR', path: '/hr' },
  { label: 'Employee Ingestor' },
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

const manualFormFields = [
  { name: 'name', label: 'Full Name', type: 'text', required: true },
  { name: 'employeeId', label: 'Employee ID', type: 'text', required: true },
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'phone', label: 'Phone', type: 'text', required: true },
  { name: 'department', label: 'Department', type: 'select', options: DEPARTMENTS, required: true },
  { name: 'designation', label: 'Designation', type: 'select', options: EMPLOYEE_DESIGNATIONS, required: true },
  { name: 'type', label: 'Employee Type', type: 'select', options: EMPLOYEE_TYPES, required: true },
  { name: 'joinDate', label: 'Join Date', type: 'date', required: true },
  { name: 'status', label: 'Status', type: 'select', options: EMPLOYEE_STATUSES, required: true },
  { name: 'address', label: 'Address', type: 'textarea', fullWidth: true },
];

const previewColumns = [
  { field: 'employeeId', headerName: 'Employee ID', flex: 0.8, minWidth: 110 },
  { field: 'name', headerName: 'Name', flex: 1.2, minWidth: 150 },
  { field: 'email', headerName: 'Email', flex: 1.2, minWidth: 180 },
  { field: 'phone', headerName: 'Phone', flex: 0.8, minWidth: 120 },
  { field: 'department', headerName: 'Department', flex: 1, minWidth: 140 },
  { field: 'designation', headerName: 'Designation', flex: 1, minWidth: 140 },
  { field: 'type', headerName: 'Type', flex: 0.8, minWidth: 110 },
  { field: 'joinDate', headerName: 'Join Date', flex: 0.8, minWidth: 110 },
  { field: 'status', headerName: 'Status', flex: 0.7, minWidth: 100 },
];

function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    if (vals.length !== headers.length) continue;
    const row = {};
    headers.forEach((h, idx) => {
      const key = h
        .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
        .replace(/^(.)/, (c) => c.toLowerCase())
        .replace(/[^a-zA-Z0-9]/g, '');
      row[key] = vals[idx];
    });
    row._rowId = `import_${i}`;
    rows.push(row);
  }
  return rows;
}

export default function EmployeeIngestor() {
  const { enqueueSnackbar } = useSnackbar();
  const [tab, setTab] = useState(0);
  const [previewData, setPreviewData] = useState([]);
  const [importing, setImporting] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const handleFilesChange = useCallback((files) => {
    setImportResult(null);
    if (!files.length) {
      setPreviewData([]);
      return;
    }
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          setPreviewData([]);
          return;
        }
        setPreviewData(parsed);
      } catch (err) {
        setPreviewData([]);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleImport = useCallback(() => {
    if (!previewData.length) {
      enqueueSnackbar('No data to import', { variant: 'warning' });
      return;
    }
    setImporting(true);
    let successCount = 0;
    let errorCount = 0;

    previewData.forEach((row) => {
      try {
        const employee = { ...row };
        delete employee._rowId;
        if (!employee.status) employee.status = 'Active';
        storageService.create(STORAGE_KEY, employee);
        successCount++;
      } catch (err) {
        errorCount++;
      }
    });

    setImporting(false);
    setImportResult({ success: successCount, errors: errorCount });
    enqueueSnackbar(
      `Import complete: ${successCount} employees imported${errorCount > 0 ? `, ${errorCount} errors` : ''}`,
      { variant: successCount > 0 ? 'success' : 'error' }
    );

    if (successCount > 0) {
      setPreviewData([]);
    }
  }, [previewData, enqueueSnackbar]);

  const handleManualSubmit = useCallback(
    (values) => {
      try {
        storageService.create(STORAGE_KEY, values);
        enqueueSnackbar('Employee added successfully', { variant: 'success' });
        setManualOpen(false);
      } catch (error) {
        enqueueSnackbar('Failed to add employee. Please try again.', { variant: 'error' });
      }
    },
    [enqueueSnackbar]
  );

  const handleDownloadTemplate = useCallback(() => {
    const headers = 'employeeId,name,email,phone,department,designation,type,joinDate,status,address';
    const sampleRow = 'EMP001,John Doe,john@psb.edu.sg,+65 9123 4567,Computer Science,Lecturer,Teaching,2025-01-15,Active,"123 Main St"';
    const csv = `${headers}\n${sampleRow}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <Box>
      <PageHeader title="Employee Ingestor" breadcrumbs={breadcrumbs} />

      <Paper sx={{ mb: 2.5 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            borderBottom: '1px solid #eee',
            '& .MuiTab-root.Mui-selected': { color: '#b30537' },
            '& .MuiTabs-indicator': { backgroundColor: '#b30537' },
          }}
        >
          <Tab icon={<CloudUploadIcon />} label="File Upload" iconPosition="start" />
          <Tab icon={<PersonAddIcon />} label="Manual Entry" iconPosition="start" />
        </Tabs>

        {tab === 0 && (
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Upload Employee Data (CSV)
              </Typography>
              <Button size="small" variant="outlined" onClick={handleDownloadTemplate}>
                Download Template
              </Button>
            </Box>

            <Alert severity="info" sx={{ mb: 2 }}>
              Upload a CSV file with columns: employeeId, name, email, phone, department,
              designation, type, joinDate, status, address. Download the template for reference.
            </Alert>

            <FileUpload
              onFilesChange={handleFilesChange}
              accept=".csv,.txt"
              label="Click or drag CSV file here to upload"
              maxSize={10}
            />

            {importResult && (
              <Alert
                severity={importResult.errors > 0 ? 'warning' : 'success'}
                sx={{ mt: 2 }}
              >
                Import completed: {importResult.success} employees imported successfully
                {importResult.errors > 0 && `, ${importResult.errors} errors encountered`}.
              </Alert>
            )}

            {previewData.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Preview ({previewData.length} records)
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<PublishIcon />}
                    onClick={handleImport}
                    disabled={importing}
                    sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}
                  >
                    {importing ? 'Importing...' : `Import ${previewData.length} Employees`}
                  </Button>
                </Box>
                <Paper variant="outlined">
                  <DataGrid
                    rows={previewData}
                    columns={previewColumns}
                    getRowId={(row) => row._rowId}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    autoHeight
                    density="compact"
                    disableRowSelectionOnClick
                    sx={{
                      border: 'none',
                      '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f8f9fa',
                        fontWeight: 600,
                        fontSize: '0.83rem',
                      },
                      '& .MuiDataGrid-cell': { fontSize: '0.83rem' },
                    }}
                  />
                </Paper>
              </Box>
            )}
          </Box>
        )}

        {tab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Manual Employee Entry
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Add employees one at a time using the form below. For bulk imports, use the File Upload tab.
            </Alert>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => setManualOpen(true)}
              sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}
            >
              Add Employee Manually
            </Button>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="textSecondary">
                Total employees in system: <Chip label={storageService.getAll(STORAGE_KEY).length} size="small" sx={{ fontWeight: 600 }} />
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>

      <FormDialog
        open={manualOpen}
        onClose={() => setManualOpen(false)}
        onSubmit={handleManualSubmit}
        title="Add Employee Manually"
        fields={manualFormFields}
        initialValues={{}}
        maxWidth="md"
      />
    </Box>
  );
}
