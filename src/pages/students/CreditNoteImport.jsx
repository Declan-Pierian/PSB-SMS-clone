import React, { useState } from 'react';
import { Box, Button, Paper, Typography, LinearProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import { v4 as uuidv4 } from 'uuid';

const breadcrumbs = [{ label: 'Student', path: '/students' }, { label: 'Credit Note Import' }];

export default function CreditNoteImport() {
  const { enqueueSnackbar } = useSnackbar();
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      setTimeout(() => {
        setResults([
          { id: uuidv4(), row: 1, studentCode: 'PSB2025003', studentName: 'Nguyen Thi Mai', invoiceNo: 'INV-2025-0003', amount: 500, reason: 'Module withdrawal', status: 'Success' },
          { id: uuidv4(), row: 2, studentCode: 'PSB2025004', studentName: 'Muhammad Rizky', invoiceNo: 'INV-2025-0004', amount: 1000, reason: 'Fee adjustment', status: 'Success' },
          { id: uuidv4(), row: 3, studentCode: 'INVALID', studentName: '', invoiceNo: '', amount: 0, reason: '', status: 'Error' },
        ]);
        setUploading(false);
        enqueueSnackbar('File processed', { variant: 'info' });
      }, 2000);
    }
  };

  const columns = [
    { field: 'row', headerName: 'Row', flex: 0.3, minWidth: 50 },
    { field: 'studentCode', headerName: 'Student Code', flex: 0.8, minWidth: 110 },
    { field: 'studentName', headerName: 'Student', flex: 1, minWidth: 130 },
    { field: 'invoiceNo', headerName: 'Invoice', flex: 0.8, minWidth: 110 },
    { field: 'amount', headerName: 'Amount', flex: 0.6, minWidth: 80, renderCell: (p) => p.value ? `$${Number(p.value).toLocaleString()}` : '-' },
    { field: 'reason', headerName: 'Reason', flex: 1, minWidth: 130 },
    { field: 'status', headerName: 'Status', flex: 0.5, minWidth: 80, renderCell: (p) => <Typography variant="body2" sx={{ color: p.value === 'Success' ? 'green' : 'red', fontWeight: 600 }}>{p.value}</Typography> },
  ];

  return (
    <Box>
      <PageHeader title="Credit Note Import" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Upload Credit Notes</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />}>Download Template</Button>
          <Button variant="contained" component="label" startIcon={<CloudUploadIcon />} sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Upload File<input type="file" hidden accept=".csv,.xlsx" onChange={handleFileChange} /></Button>
        </Box>
        {uploading && <LinearProgress sx={{ mb: 2 }} />}
        {results.length > 0 && <Alert severity="info">Processed {results.length} rows</Alert>}
      </Paper>
      {results.length > 0 && <DataTable rows={results} columns={columns} exportFilename="credit-note-import" />}
    </Box>
  );
}