import React, { useState } from 'react';
import { Box, Button, Paper, Typography, LinearProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import { v4 as uuidv4 } from 'uuid';

const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Marks Ingestor' }];

export default function MarksIngestor() {
  const { enqueueSnackbar } = useSnackbar();
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      setTimeout(() => {
        setResults([
          { id: uuidv4(), row: 1, item: 'Record 1', status: 'Success', message: 'Imported successfully' },
          { id: uuidv4(), row: 2, item: 'Record 2', status: 'Success', message: 'Imported successfully' },
          { id: uuidv4(), row: 3, item: 'Record 3', status: 'Error', message: 'Validation failed' },
        ]);
        setUploading(false);
        enqueueSnackbar('File processed', { variant: 'info' });
      }, 2000);
    }
  };

  const columns = [
    { field: 'row', headerName: 'Row', flex: 0.3, minWidth: 50 },
    { field: 'item', headerName: 'Item', flex: 1.2, minWidth: 150 },
    { field: 'status', headerName: 'Status', flex: 0.5, minWidth: 80, renderCell: (p) => <Typography variant="body2" sx={{ color: p.value === 'Success' ? 'green' : 'red', fontWeight: 600 }}>{p.value}</Typography> },
    { field: 'message', headerName: 'Message', flex: 1.5, minWidth: 200 },
  ];

  return (
    <Box>
      <PageHeader title="Marks Ingestor" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Upload Data</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />}>Download Template</Button>
          <Button variant="contained" component="label" startIcon={<CloudUploadIcon />} sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Upload File<input type="file" hidden accept=".csv,.xlsx" onChange={handleFileChange} /></Button>
        </Box>
        {uploading && <LinearProgress sx={{ mb: 2 }} />}
        {results.length > 0 && <Alert severity="info">Processed {results.length} rows</Alert>}
      </Paper>
      {results.length > 0 && <DataTable rows={results} columns={columns} exportFilename="testMarks-import" />}
    </Box>
  );
}
