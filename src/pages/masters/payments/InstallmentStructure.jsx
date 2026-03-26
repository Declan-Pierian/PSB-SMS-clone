import React, { useState, useMemo } from 'react';
import { Box, Paper, TextField, MenuItem, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../../components/common/PageHeader';
import storageService from '../../../services/storageService';

export default function InstallmentStructure() {
  const [templateId, setTemplateId] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const templates = storageService.getAll('installment_templates');

  const template = templates.find(t => t.id === templateId);
  const structure = useMemo(() => {
    if (!template) return [];
    const count = parseInt(template.installments) || 3;
    const total = parseFloat(template.totalAmount) || 0;
    const perInstallment = total / count;
    return Array.from({ length: count }, (_, i) => ({
      number: i + 1,
      dueDate: `Month ${i + 1}`,
      amount: perInstallment.toFixed(2),
      percentage: (100 / count).toFixed(1),
    }));
  }, [template]);

  return (
    <Box>
      <PageHeader title="Installment Structure" breadcrumbs={[{ label: 'Masters' }, { label: 'Installment Structure' }]} />
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField select label="Select Template" value={templateId} onChange={(e) => setTemplateId(e.target.value)} size="small" sx={{ width: 400 }}>
          <MenuItem value="">-- Select Template --</MenuItem>
          {templates.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
        </TextField>
      </Paper>
      {template && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 700 }}>Installment #</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Due Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Amount</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Percentage</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {structure.map(row => (
                <TableRow key={row.number} hover>
                  <TableCell>{row.number}</TableCell>
                  <TableCell>{row.dueDate}</TableCell>
                  <TableCell align="right">${row.amount}</TableCell>
                  <TableCell align="right">{row.percentage}%</TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell colSpan={2} sx={{ fontWeight: 700 }}>Total</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>${template.totalAmount || 0}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}