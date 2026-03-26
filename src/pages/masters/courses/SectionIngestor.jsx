import React, { useState } from 'react';
import { Box, Button, Paper, Typography, LinearProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import { useSnackbar } from 'notistack';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/common/DataTable';
import { v4 as uuidv4 } from 'uuid';

const breadcrumbs = [
  { label: 'Masters', path: '/masters' },
  { label: 'Courses', path: '/masters/courses' },
  { label: 'Section Ingestor' },
];

export default function SectionIngestor() {
  const { enqueueSnackbar } = useSnackbar();
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setUploading(true);
      setTimeout(() => {
        const mockResults = [
          { id: uuidv4(), row: 1, name: 'Section A - CS101', code: 'SEC-A-CS101', status: 'Success', message: 'Imported successfully' },
          { id: uuidv4(), row: 2, name: 'Section B - CS201', code: 'SEC-B-CS201', status: 'Success', message: 'Imported successfully' },
          { id: uuidv4(), row: 3, name: 'Section C - BA101', code: 'SEC-C-BA101', status: 'Warning', message: 'Duplicate code, skipped' },
          { id: uuidv4(), row: 4, name: 'Section D - MBA501', code: 'SEC-D-MBA501', status: 'Success', message: 'Imported successfully' },
          { id: uuidv4(), row: 5, name: '', code: '', status: 'Error', message: 'Missing required fields' },
        ];
        setResults(mockResults);
        setUploading(false);
        enqueueSnackbar('File processed. 3 sections imported, 1 skipped, 1 error.', { variant: 'info' });
      }, 2000);
    }
  };

  const columns = [
    { field: 'row', headerName: 'Row', flex: 0.3, minWidth: 60 },
    { field: 'name', headerName: 'Section Name', flex: 1.2, minWidth: 150 },
    { field: 'code', headerName: 'Code', flex: 0.8, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 80, renderCell: (p) => (
      <Typography variant="body2" sx={{ color: p.value === 'Success' ? 'green' : p.value === 'Warning' ? 'orange' : 'red', fontWeight: 600 }}>{p.value}</Typography>
    )},
    { field: 'message', headerName: 'Message', flex: 1.5, minWidth: 200 },
  ];

  return (
    <Box>
      <PageHeader title="Section Ingestor" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Upload Section Data</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Upload a CSV or Excel file with section data. Download the template for the correct format.</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => enqueueSnackbar('Template downloaded', { variant: 'success' })}>Download Template</Button>
          <Button variant="contained" component="label" startIcon={<CloudUploadIcon />} sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>
            Upload File
            <input type="file" hidden accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
          </Button>
        </Box>
        {fileName && <Typography variant="body2" sx={{ mb: 1 }}>File: {fileName}</Typography>}
        {uploading && <LinearProgress sx={{ mb: 2, '& .MuiLinearProgress-bar': { backgroundColor: '#b30537' } }} />}
        {results.length > 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Processed {results.length} rows: {results.filter(r => r.status === 'Success').length} success, {results.filter(r => r.status === 'Warning').length} warnings, {results.filter(r => r.status === 'Error').length} errors
          </Alert>
        )}
      </Paper>
      {results.length > 0 && <DataTable rows={results} columns={columns} exportFilename="section-import-results" />}
    </Box>
  );
}