import React, { useState, useCallback } from 'react';
import { Box, Button, Paper, Typography, TextField, LinearProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/common/DataTable';
import StatusChip from '../../../components/common/StatusChip';
import storageService from '../../../services/storageService';

const breadcrumbs = [
  { label: 'Masters', path: '/masters' },
  { label: 'Courses', path: '/masters/courses' },
  { label: 'Module Ingestion' },
];

export default function ModuleIngestion() {
  const { enqueueSnackbar } = useSnackbar();
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [history, setHistory] = useState(() => storageService.getAll('moduleIngestions'));

  const refreshHistory = useCallback(() => {
    setHistory(storageService.getAll('moduleIngestions'));
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  }, []);

  const handleUpload = useCallback(() => {
    if (!fileName) {
      enqueueSnackbar('Please select a file to upload', { variant: 'warning' });
      return;
    }

    setUploading(true);
    setStatusMessage(null);

    // Simulate file processing
    setTimeout(() => {
      const totalRecords = Math.floor(Math.random() * 80) + 15;
      const failedCount = Math.floor(Math.random() * 5);
      const successCount = totalRecords - failedCount;

      const ingestionRecord = {
        id: uuidv4(),
        batchId: `MB-${Date.now().toString().slice(-8)}`,
        fileName,
        uploadDate: new Date().toISOString().split('T')[0],
        totalRecords,
        successCount,
        failedCount,
        status: failedCount === 0 ? 'Completed' : 'Partial',
        uploadedBy: 'Current User',
      };

      storageService.create('moduleIngestions', ingestionRecord);
      setUploading(false);
      setFileName('');
      refreshHistory();

      setStatusMessage({
        severity: failedCount === 0 ? 'success' : 'warning',
        text: `File processed: ${successCount} modules imported successfully${failedCount > 0 ? `, ${failedCount} failed` : ''}.`,
      });

      enqueueSnackbar(`Module ingestion completed - ${successCount} of ${totalRecords} records processed`, {
        variant: failedCount === 0 ? 'success' : 'warning',
      });
    }, 2000);
  }, [fileName, enqueueSnackbar, refreshHistory]);

  const columns = [
    { field: 'batchId', headerName: 'Batch ID', width: 140 },
    { field: 'fileName', headerName: 'File Name', flex: 1, minWidth: 180 },
    { field: 'uploadDate', headerName: 'Upload Date', width: 130 },
    { field: 'totalRecords', headerName: 'Total Records', width: 130 },
    { field: 'successCount', headerName: 'Success', width: 100 },
    { field: 'failedCount', headerName: 'Failed', width: 100 },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    { field: 'uploadedBy', headerName: 'Uploaded By', width: 140 },
  ];

  return (
    <Box>
      <PageHeader title="Module Ingestion" breadcrumbs={breadcrumbs} />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Upload Module Data</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Upload a CSV or Excel file containing module data. Download the template for the correct format.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField
            size="small"
            value={fileName}
            placeholder="No file selected"
            InputProps={{ readOnly: true }}
            sx={{ flex: 1, maxWidth: 400 }}
          />
          <Button
            variant="contained"
            component="label"
            startIcon={<CloudUploadIcon />}
            sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}
          >
            Choose File
            <input type="file" hidden accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
          </Button>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={handleUpload}
            disabled={uploading || !fileName}
            sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => enqueueSnackbar('Template downloaded', { variant: 'success' })}
          >
            Download Template
          </Button>
        </Box>
        {uploading && <LinearProgress sx={{ mb: 2, '& .MuiLinearProgress-bar': { backgroundColor: '#b30537' } }} />}
        {statusMessage && (
          <Alert severity={statusMessage.severity} sx={{ mb: 2 }}>
            {statusMessage.text}
          </Alert>
        )}
      </Paper>

      <Typography variant="h6" sx={{ mb: 2 }}>Ingestion History</Typography>
      <DataTable rows={history} columns={columns} exportFilename="module-ingestion-history" />
    </Box>
  );
}