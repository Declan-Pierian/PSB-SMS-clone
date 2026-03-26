import React, { useState, useCallback, useMemo } from 'react';
import {
  Box, Paper, Typography, TextField, Button, MenuItem, Alert, Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';

export default function InvoiceRun() {
  const { enqueueSnackbar } = useSnackbar();
  const [formValues, setFormValues] = useState({
    program: '',
    cohort: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    description: '',
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [invoiceRuns, setInvoiceRuns] = useState(() => storageService.getAll('invoice_runs'));
  const [generating, setGenerating] = useState(false);

  const programs = useMemo(() => storageService.getAll('programs'), []);
  const cohorts = useMemo(() => {
    if (!formValues.program) return [];
    const batches = storageService.getAll('batches');
    return batches.filter(
      (b) => b.program === formValues.program || b.programId === formValues.program
    );
  }, [formValues.program]);

  const handleChange = useCallback((field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleGenerate = useCallback(() => {
    if (!formValues.program) {
      enqueueSnackbar('Please select a program', { variant: 'warning' });
      return;
    }
    if (!formValues.invoiceDate) {
      enqueueSnackbar('Please select an invoice date', { variant: 'warning' });
      return;
    }
    if (!formValues.dueDate) {
      enqueueSnackbar('Please select a due date', { variant: 'warning' });
      return;
    }
    setConfirmOpen(true);
  }, [formValues, enqueueSnackbar]);

  const handleConfirmGenerate = useCallback(() => {
    setConfirmOpen(false);
    setGenerating(true);

    // Get students for the selected program/cohort
    const allStudents = storageService.getAll('students');
    let eligibleStudents = allStudents.filter(
      (s) =>
        (s.program === formValues.program || s.programName === formValues.program) &&
        s.status === 'Active'
    );

    if (formValues.cohort) {
      eligibleStudents = eligibleStudents.filter(
        (s) => s.cohort === formValues.cohort || s.batchId === formValues.cohort
      );
    }

    if (eligibleStudents.length === 0) {
      enqueueSnackbar('No eligible students found for the selected criteria', { variant: 'warning' });
      setGenerating(false);
      return;
    }

    // Find program fee
    const programData = programs.find(
      (p) => p.name === formValues.program || p.id === formValues.program
    );
    const feeAmount = programData?.fee || programData?.tuitionFee || 5000;

    // Generate invoices for each student
    const generatedInvoices = eligibleStudents.map((student) => {
      const invoiceNo = `INV-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`;
      return {
        id: uuidv4(),
        invoiceNo,
        studentId: student.id,
        studentName: student.name || `${student.firstName || ''} ${student.lastName || ''}`,
        program: formValues.program,
        cohort: formValues.cohort || '-',
        amount: feeAmount,
        paidAmount: 0,
        balance: feeAmount,
        invoiceDate: formValues.invoiceDate,
        dueDate: formValues.dueDate,
        status: 'Generated',
        description: formValues.description || `Tuition fee for ${formValues.program}`,
        createdAt: new Date().toISOString(),
      };
    });

    // Save each invoice
    generatedInvoices.forEach((inv) => storageService.create('invoices', inv));

    // Create an invoice run record
    const runRecord = {
      id: uuidv4(),
      runNo: `RUN-${Date.now().toString().slice(-8)}`,
      program: formValues.program,
      cohort: formValues.cohort || 'All Cohorts',
      invoiceDate: formValues.invoiceDate,
      dueDate: formValues.dueDate,
      description: formValues.description,
      totalInvoices: generatedInvoices.length,
      totalAmount: generatedInvoices.reduce((sum, inv) => sum + inv.amount, 0),
      status: 'Completed',
      generatedBy: 'Current User',
      createdAt: new Date().toISOString(),
    };
    storageService.create('invoice_runs', runRecord);

    setInvoiceRuns(storageService.getAll('invoice_runs'));
    setGenerating(false);
    setFormValues({
      program: '',
      cohort: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      description: '',
    });
    enqueueSnackbar(
      `Successfully generated ${generatedInvoices.length} invoices totaling $${runRecord.totalAmount.toFixed(2)}`,
      { variant: 'success' }
    );
  }, [formValues, programs, enqueueSnackbar]);

  const columns = useMemo(
    () => [
      { field: 'runNo', headerName: 'Run No', width: 150 },
      { field: 'program', headerName: 'Program', width: 200 },
      { field: 'cohort', headerName: 'Cohort', width: 140 },
      { field: 'invoiceDate', headerName: 'Invoice Date', width: 120 },
      { field: 'dueDate', headerName: 'Due Date', width: 120 },
      { field: 'totalInvoices', headerName: 'Invoices', width: 100, type: 'number' },
      {
        field: 'totalAmount',
        headerName: 'Total Amount',
        width: 140,
        renderCell: (params) => `$${(params.value || 0).toFixed(2)}`,
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 130,
        renderCell: (params) => <StatusChip status={params.value} />,
      },
      { field: 'generatedBy', headerName: 'Generated By', width: 140 },
      { field: 'createdAt', headerName: 'Created', width: 160, renderCell: (params) => new Date(params.value).toLocaleString() },
    ],
    []
  );

  return (
    <Box>
      <PageHeader
        title="Invoice Run"
        breadcrumbs={[
          { label: 'Finance', path: '/finance' },
          { label: 'Invoice Run' },
        ]}
      />

      <Paper sx={{ p: 2.5, mb: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptLongIcon fontSize="small" /> Batch Invoice Generation
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Program *"
              value={formValues.program}
              onChange={(e) => handleChange('program', e.target.value)}
            >
              <MenuItem value="">Select Program</MenuItem>
              {programs.map((p) => (
                <MenuItem key={p.id} value={p.name || p.id}>
                  {p.name || p.programName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Cohort"
              value={formValues.cohort}
              onChange={(e) => handleChange('cohort', e.target.value)}
              disabled={!formValues.program}
            >
              <MenuItem value="">All Cohorts</MenuItem>
              {cohorts.map((c) => (
                <MenuItem key={c.id} value={c.name || c.batchName || c.id}>
                  {c.name || c.batchName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              type="date"
              size="small"
              label="Invoice Date *"
              value={formValues.invoiceDate}
              onChange={(e) => handleChange('invoiceDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              type="date"
              size="small"
              label="Due Date *"
              value={formValues.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Description"
              value={formValues.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="e.g., Tuition fee for Term 1 2026"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={handleGenerate}
              disabled={generating}
              sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}
            >
              {generating ? 'Generating...' : 'Generate Invoices'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
        Invoice Run History
      </Typography>
      <DataTable
        rows={invoiceRuns.slice().reverse()}
        columns={columns}
        pageSize={10}
        exportFilename="invoice_runs"
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Invoice Generation"
        message={`Are you sure you want to generate invoices for program "${formValues.program}"${
          formValues.cohort ? ` (Cohort: ${formValues.cohort})` : ''
        }? Invoice Date: ${formValues.invoiceDate}, Due Date: ${formValues.dueDate}. This action will create invoices for all eligible active students.`}
        onConfirm={handleConfirmGenerate}
        onCancel={() => setConfirmOpen(false)}
        confirmLabel="Generate"
        severity="warning"
      />
    </Box>
  );
}
