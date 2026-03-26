import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../../components/common/PageHeader';
import FileUpload from '../../../components/common/FileUpload';
import storageService from '../../../services/storageService';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function InstallmentIngestion() {
  const [preview, setPreview] = useState([]);
  const [imported, setImported] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleFiles = (files) => {
    // Simulate parsing CSV
    setPreview([
      { name: 'Standard Plan A', installments: 6, totalAmount: 12000, program: 'Business Management' },
      { name: 'Standard Plan B', installments: 4, totalAmount: 8000, program: 'Information Technology' },
      { name: 'Premium Plan', installments: 12, totalAmount: 24000, program: 'Engineering' },
    ]);
    setImported(false);
  };

  const handleImport = () => {
    preview.forEach(row => {
      storageService.create('installment_templates', { ...row, status: 'Active' });
    });
    setImported(true);
    enqueueSnackbar(`${preview.length} templates imported successfully`, { variant: 'success' });
  };

  return (
    <Box>
      <PageHeader title="Installment Template Ingestion" breadcrumbs={[{ label: 'Masters' }, { label: 'Installment Ingestion' }]} />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Upload File</Typography>
        <FileUpload onFilesChange={handleFiles} accept=".csv,.xlsx,.xls" label="Upload CSV/Excel file with installment templates" />
      </Paper>
      {preview.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Preview ({preview.length} records)</Typography>
            <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={handleImport} disabled={imported} sx={{ backgroundColor: '#b30537' }}>
              {imported ? 'Imported' : 'Import All'}
            </Button>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead><TableRow sx={{ backgroundColor: '#f8f9fa' }}><TableCell sx={{ fontWeight: 700 }}>Name</TableCell><TableCell sx={{ fontWeight: 700 }}>Installments</TableCell><TableCell sx={{ fontWeight: 700 }}>Total Amount</TableCell><TableCell sx={{ fontWeight: 700 }}>Program</TableCell></TableRow></TableHead>
              <TableBody>
                {preview.map((r, i) => <TableRow key={i} hover><TableCell>{r.name}</TableCell><TableCell>{r.installments}</TableCell><TableCell>${r.totalAmount.toLocaleString()}</TableCell><TableCell>{r.program}</TableCell></TableRow>)}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}