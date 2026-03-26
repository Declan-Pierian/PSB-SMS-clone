import React, { useState } from 'react';
import { Box, Button, Paper, Typography, LinearProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import { v4 as uuidv4 } from 'uuid';

const breadcrumbs = [{ label: 'Finance', path: '/finance' }, { label: 'Payment Ingestion' }];

export default function PaymentIngestion() {
  const { enqueueSnackbar } = useSnackbar();
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      setTimeout(() => {
        const mock = [
          { id: uuidv4(), row: 1, studentCode: 'PSB2025001', studentName: 'Arun Kumar', invoiceNo: 'INV-2025-0001', amount: 8000, paymentDate: '2025-03-01', paymentMode: 'Bank Transfer', refNo: 'TXN001', status: 'Success' },
          { id: uuidv4(), row: 2, studentCode: 'PSB2025002', studentName: 'Li Wei', invoiceNo: 'INV-2025-0002', amount: 8000, paymentDate: '2025-03-02', paymentMode: 'Credit Card', refNo: 'TXN002', status: 'Success' },
          { id: uuidv4(), row: 3, studentCode: 'PSB2025099', studentName: 'Unknown', invoiceNo: 'INV-9999', amount: 5000, paymentDate: '2025-03-03', paymentMode: 'Cash', refNo: '', status: 'Error' },
        ];
        setResults(mock);
        setUploading(false);
        enqueueSnackbar('File processed: 2 success, 1 error', { variant: 'info' });
      }, 2000);
    }
  };

  const columns = [
    { field: 'row', headerName: 'Row', flex: 0.3, minWidth: 50 },
    { field: 'studentCode', headerName: 'Student Code', flex: 0.8, minWidth: 110 },
    { field: 'studentName', headerName: 'Student Name', flex: 1, minWidth: 130 },
    { field: 'invoiceNo', headerName: 'Invoice No', flex: 0.8, minWidth: 110 },
    { field: 'amount', headerName: 'Amount', flex: 0.6, minWidth: 80, renderCell: (p) => `$${Number(p.value).toLocaleString()}` },
    { field: 'paymentDate', headerName: 'Date', flex: 0.7, minWidth: 100 },
    { field: 'paymentMode', headerName: 'Mode', flex: 0.7, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 0.5, minWidth: 80, renderCell: (p) => (
      <Typography variant="body2" sx={{ color: p.value === 'Success' ? 'green' : 'red', fontWeight: 600 }}>{p.value}</Typography>
    )},
  ];

  return (
    <Box>
      <PageHeader title="Payment Ingestion" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Upload Payment Records</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Upload CSV/Excel file with payment data.</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => enqueueSnackbar('Template downloaded', { variant: 'success' })}>Download Template</Button>
          <Button variant="contained" component="label" startIcon={<CloudUploadIcon />} sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>
            Upload File<input type="file" hidden accept=".csv,.xlsx,.xls" onChange={handleFileChange} />
          </Button>
        </Box>
        {uploading && <LinearProgress sx={{ mb: 2 }} />}
        {results.length > 0 && <Alert severity="info" sx={{ mb: 2 }}>Processed {results.length} rows</Alert>}
      </Paper>
      {results.length > 0 && <DataTable rows={results} columns={columns} exportFilename="payment-import-results" />}
    </Box>
  );
}