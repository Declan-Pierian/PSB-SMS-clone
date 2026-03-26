import React, { useState, useCallback, useMemo } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Alert, Tooltip, IconButton, Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import PaymentIcon from '@mui/icons-material/Payment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import { PAYMENT_METHODS } from '../../data/constants';

export default function AppPaymentConsole() {
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [recentPayments, setRecentPayments] = useState(() =>
    storageService.getAll('app_payments')
  );
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleSearch = useCallback(() => {
    if (!searchTerm.trim()) {
      enqueueSnackbar('Please enter an Application ID or Applicant Name', { variant: 'warning' });
      return;
    }
    const applications = storageService.getAll('applications');
    const found = applications.find(
      (a) =>
        a.applicationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (!found) {
      enqueueSnackbar('Application not found', { variant: 'error' });
      setSelectedApplication(null);
      return;
    }
    setSelectedApplication(found);
    enqueueSnackbar(
      `Found application: ${found.applicationId || found.id}`,
      { variant: 'success' }
    );
  }, [searchTerm, enqueueSnackbar]);

  const applicationFee = selectedApplication?.applicationFee || 500;
  const existingPayment = useMemo(() => {
    if (!selectedApplication) return null;
    return recentPayments.find((p) => p.applicationId === (selectedApplication.applicationId || selectedApplication.id));
  }, [selectedApplication, recentPayments]);

  const isPaid = !!existingPayment;

  const handleRecordPayment = useCallback(() => {
    setPaymentDialogOpen(true);
  }, []);

  const handlePaymentSubmit = useCallback(
    (values) => {
      const amount = parseFloat(values.amount);
      if (isNaN(amount) || amount <= 0) {
        enqueueSnackbar('Please enter a valid payment amount', { variant: 'error' });
        return;
      }

      const payment = {
        id: uuidv4(),
        receiptNo: `ARCP-${Date.now().toString().slice(-8)}`,
        applicationId: selectedApplication.applicationId || selectedApplication.id,
        applicantName:
          selectedApplication.applicantName ||
          selectedApplication.name ||
          `${selectedApplication.firstName || ''} ${selectedApplication.lastName || ''}`,
        program: selectedApplication.program || selectedApplication.programApplied || '-',
        amount,
        paymentMethod: values.paymentMethod,
        referenceNo: values.referenceNo,
        paymentDate: values.paymentDate || new Date().toISOString().split('T')[0],
        remarks: values.remarks,
        collector: 'Current User',
        status: 'Paid',
        createdAt: new Date().toISOString(),
      };
      storageService.create('app_payments', payment);

      // Update application fee status
      storageService.update('applications', selectedApplication.id, {
        feeStatus: 'Paid',
        feePaidDate: payment.paymentDate,
        feePaidAmount: amount,
      });

      setRecentPayments(storageService.getAll('app_payments'));
      setPaymentDialogOpen(false);
      enqueueSnackbar(
        `Application fee of $${amount.toFixed(2)} recorded successfully (Receipt: ${payment.receiptNo})`,
        { variant: 'success' }
      );
    },
    [selectedApplication, enqueueSnackbar]
  );

  const handleViewPayment = useCallback((payment) => {
    setSelectedPayment(payment);
    setDetailDialogOpen(true);
  }, []);

  const paymentColumns = useMemo(
    () => [
      { field: 'receiptNo', headerName: 'Receipt No', width: 150 },
      { field: 'applicationId', headerName: 'Application ID', width: 150 },
      { field: 'applicantName', headerName: 'Applicant Name', width: 180 },
      { field: 'program', headerName: 'Program', width: 180 },
      {
        field: 'amount',
        headerName: 'Amount',
        width: 120,
        renderCell: (params) => `$${(params.value || 0).toFixed(2)}`,
      },
      { field: 'paymentMethod', headerName: 'Method', width: 150 },
      { field: 'referenceNo', headerName: 'Reference', width: 140 },
      { field: 'paymentDate', headerName: 'Date', width: 120 },
      {
        field: 'status',
        headerName: 'Status',
        width: 110,
        renderCell: (params) => <StatusChip status={params.value || 'Paid'} />,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 80,
        sortable: false,
        renderCell: (params) => (
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => handleViewPayment(params.row)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [handleViewPayment]
  );

  const paymentDialogFields = useMemo(
    () => [
      {
        name: 'applicationId',
        label: 'Application ID',
        disabled: true,
        defaultValue: selectedApplication?.applicationId || selectedApplication?.id || '',
      },
      {
        name: 'applicantName',
        label: 'Applicant Name',
        disabled: true,
        defaultValue:
          selectedApplication?.applicantName ||
          selectedApplication?.name ||
          `${selectedApplication?.firstName || ''} ${selectedApplication?.lastName || ''}`,
      },
      {
        name: 'amount',
        label: 'Application Fee ($)',
        type: 'number',
        required: true,
        defaultValue: applicationFee,
      },
      {
        name: 'paymentMethod',
        label: 'Payment Method',
        type: 'select',
        required: true,
        options: PAYMENT_METHODS,
      },
      { name: 'referenceNo', label: 'Reference No' },
      {
        name: 'paymentDate',
        label: 'Payment Date',
        type: 'date',
        required: true,
        defaultValue: new Date().toISOString().split('T')[0],
      },
      { name: 'remarks', label: 'Remarks', type: 'textarea', fullWidth: true },
    ],
    [selectedApplication, applicationFee]
  );

  return (
    <Box>
      <PageHeader
        title="Application Fee Payment"
        breadcrumbs={[
          { label: 'Finance', path: '/finance' },
          { label: 'Application Fee Payment' },
        ]}
      />

      <Paper sx={{ p: 2.5, mb: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Search Application
        </Typography>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Application ID or Applicant Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 'auto' }}>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {selectedApplication && (
        <Paper sx={{ p: 2.5, mb: 2.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Applicant Details
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="textSecondary">Application ID</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {selectedApplication.applicationId || selectedApplication.id}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="textSecondary">Applicant Name</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {selectedApplication.applicantName ||
                  selectedApplication.name ||
                  `${selectedApplication.firstName || ''} ${selectedApplication.lastName || ''}`}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="textSecondary">Program Applied</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {selectedApplication.program || selectedApplication.programApplied || '-'}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="caption" color="textSecondary">Application Fee</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                ${applicationFee.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {isPaid ? (
            <Alert severity="success" sx={{ mt: 1 }}>
              Application fee has already been paid. Receipt: {existingPayment.receiptNo} |
              Amount: ${existingPayment.amount?.toFixed(2)} | Date: {existingPayment.paymentDate}
            </Alert>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<PaymentIcon />}
                onClick={handleRecordPayment}
                sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}
              >
                Record Application Fee Payment
              </Button>
            </Box>
          )}
        </Paper>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
        Recent Application Fee Payments
      </Typography>
      <DataTable
        rows={recentPayments.slice().reverse().slice(0, 50)}
        columns={paymentColumns}
        pageSize={10}
        exportFilename="app_fee_payments"
      />

      <FormDialog
        open={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        onSubmit={handlePaymentSubmit}
        title="Record Application Fee Payment"
        fields={paymentDialogFields}
        initialValues={{
          applicationId: selectedApplication?.applicationId || selectedApplication?.id || '',
          applicantName:
            selectedApplication?.applicantName ||
            selectedApplication?.name ||
            `${selectedApplication?.firstName || ''} ${selectedApplication?.lastName || ''}`,
          amount: applicationFee,
          paymentDate: new Date().toISOString().split('T')[0],
        }}
        submitLabel="Record Payment"
        maxWidth="sm"
      />

      <FormDialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedPayment(null);
        }}
        title="Payment Details"
        fields={[
          { name: 'receiptNo', label: 'Receipt No', disabled: true },
          { name: 'applicationId', label: 'Application ID', disabled: true },
          { name: 'applicantName', label: 'Applicant Name', disabled: true },
          { name: 'program', label: 'Program', disabled: true },
          { name: 'amount', label: 'Amount', disabled: true },
          { name: 'paymentMethod', label: 'Payment Method', disabled: true },
          { name: 'referenceNo', label: 'Reference No', disabled: true },
          { name: 'paymentDate', label: 'Payment Date', disabled: true },
          { name: 'remarks', label: 'Remarks', disabled: true, fullWidth: true },
        ]}
        initialValues={
          selectedPayment
            ? { ...selectedPayment, amount: `$${(selectedPayment.amount || 0).toFixed(2)}` }
            : {}
        }
        submitLabel="Close"
        onSubmit={() => {
          setDetailDialogOpen(false);
          setSelectedPayment(null);
        }}
        maxWidth="sm"
      />
    </Box>
  );
}
