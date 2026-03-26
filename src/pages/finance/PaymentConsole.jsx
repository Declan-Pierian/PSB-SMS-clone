import React, { useState, useCallback, useMemo } from 'react';
import {
  Box, Paper, Typography, TextField, Button, MenuItem, Card, CardContent,
  IconButton, Tooltip, Divider, Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import { PAYMENT_METHODS } from '../../data/constants';

export default function PaymentConsole() {
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [outstandingInvoices, setOutstandingInvoices] = useState([]);
  const [recentPayments, setRecentPayments] = useState(() => storageService.getAll('payments'));
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleSearch = useCallback(() => {
    if (!searchTerm.trim()) {
      enqueueSnackbar('Please enter a Student ID or Name', { variant: 'warning' });
      return;
    }
    const students = storageService.getAll('students');
    const found = students.find(
      (s) =>
        s.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (!found) {
      enqueueSnackbar('Student not found', { variant: 'error' });
      setSelectedStudent(null);
      setOutstandingInvoices([]);
      return;
    }
    setSelectedStudent(found);
    const invoices = storageService.getAll('invoices').filter(
      (inv) =>
        inv.studentId === found.id &&
        ['Generated', 'Sent', 'Partially Paid', 'Overdue'].includes(inv.status)
    );
    setOutstandingInvoices(invoices);
    enqueueSnackbar(`Found student: ${found.name || `${found.firstName} ${found.lastName}`}`, { variant: 'success' });
  }, [searchTerm, enqueueSnackbar]);

  const handleRecordPayment = useCallback((invoice) => {
    setSelectedInvoice(invoice);
    setPaymentDialogOpen(true);
  }, []);

  const handlePaymentSubmit = useCallback(
    (values) => {
      const amount = parseFloat(values.amount);
      if (isNaN(amount) || amount <= 0) {
        enqueueSnackbar('Please enter a valid payment amount', { variant: 'error' });
        return;
      }
      const balance = (selectedInvoice.amount || 0) - (selectedInvoice.paidAmount || 0);
      if (amount > balance) {
        enqueueSnackbar(`Payment amount cannot exceed balance of $${balance.toFixed(2)}`, { variant: 'error' });
        return;
      }

      const payment = {
        id: uuidv4(),
        receiptNo: `RCP-${Date.now().toString().slice(-8)}`,
        invoiceId: selectedInvoice.id,
        invoiceNo: selectedInvoice.invoiceNo,
        studentId: selectedStudent.id,
        studentName: selectedStudent.name || `${selectedStudent.firstName} ${selectedStudent.lastName}`,
        amount,
        paymentMethod: values.paymentMethod,
        referenceNo: values.referenceNo,
        paymentDate: values.paymentDate || new Date().toISOString().split('T')[0],
        remarks: values.remarks,
        collector: 'Current User',
        createdAt: new Date().toISOString(),
      };
      storageService.create('payments', payment);

      const newPaidAmount = (selectedInvoice.paidAmount || 0) + amount;
      const newBalance = (selectedInvoice.amount || 0) - newPaidAmount;
      const newStatus = newBalance <= 0 ? 'Paid' : 'Partially Paid';
      storageService.update('invoices', selectedInvoice.id, {
        paidAmount: newPaidAmount,
        balance: newBalance,
        status: newStatus,
      });

      setOutstandingInvoices((prev) =>
        prev
          .map((inv) =>
            inv.id === selectedInvoice.id
              ? { ...inv, paidAmount: newPaidAmount, balance: newBalance, status: newStatus }
              : inv
          )
          .filter((inv) => inv.status !== 'Paid')
      );

      setRecentPayments(storageService.getAll('payments'));
      setPaymentDialogOpen(false);
      setSelectedInvoice(null);
      enqueueSnackbar(`Payment of $${amount.toFixed(2)} recorded successfully (Receipt: ${payment.receiptNo})`, {
        variant: 'success',
      });
    },
    [selectedInvoice, selectedStudent, enqueueSnackbar]
  );

  const handleViewPayment = useCallback((payment) => {
    setSelectedPayment(payment);
    setDetailDialogOpen(true);
  }, []);

  const invoiceColumns = useMemo(
    () => [
      { field: 'invoiceNo', headerName: 'Invoice No', width: 140 },
      { field: 'program', headerName: 'Program', width: 200 },
      {
        field: 'amount',
        headerName: 'Amount',
        width: 120,
        renderCell: (params) => `$${(params.value || 0).toFixed(2)}`,
      },
      {
        field: 'paidAmount',
        headerName: 'Paid',
        width: 120,
        renderCell: (params) => `$${(params.value || 0).toFixed(2)}`,
      },
      {
        field: 'balance',
        headerName: 'Balance',
        width: 120,
        renderCell: (params) => {
          const balance = (params.row.amount || 0) - (params.row.paidAmount || 0);
          return (
            <Typography sx={{ color: balance > 0 ? '#c62828' : '#2e7d32', fontWeight: 600, fontSize: '0.83rem' }}>
              ${balance.toFixed(2)}
            </Typography>
          );
        },
      },
      { field: 'dueDate', headerName: 'Due Date', width: 120 },
      {
        field: 'status',
        headerName: 'Status',
        width: 130,
        renderCell: (params) => <StatusChip status={params.value} />,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
        sortable: false,
        renderCell: (params) => (
          <Button
            size="small"
            variant="contained"
            startIcon={<PaymentIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleRecordPayment(params.row);
            }}
            sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' }, fontSize: '0.72rem' }}
          >
            Pay
          </Button>
        ),
      },
    ],
    [handleRecordPayment]
  );

  const paymentColumns = useMemo(
    () => [
      { field: 'receiptNo', headerName: 'Receipt No', width: 140 },
      { field: 'invoiceNo', headerName: 'Invoice No', width: 140 },
      { field: 'studentName', headerName: 'Student', width: 180 },
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

  const paymentDialogFields = useMemo(() => {
    const balance = selectedInvoice
      ? (selectedInvoice.amount || 0) - (selectedInvoice.paidAmount || 0)
      : 0;
    return [
      {
        name: 'invoiceNo',
        label: 'Invoice No',
        disabled: true,
        defaultValue: selectedInvoice?.invoiceNo || '',
      },
      {
        name: 'balanceDisplay',
        label: 'Outstanding Balance',
        disabled: true,
        defaultValue: `$${balance.toFixed(2)}`,
      },
      { name: 'amount', label: 'Payment Amount ($)', type: 'number', required: true },
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
    ];
  }, [selectedInvoice]);

  return (
    <Box>
      <PageHeader
        title="Payment Console"
        breadcrumbs={[
          { label: 'Finance', path: '/finance' },
          { label: 'Payment Console' },
        ]}
      />

      <Paper sx={{ p: 2.5, mb: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Search Student
        </Typography>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              size="small"
              label="Student ID or Name"
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

      {selectedStudent && (
        <>
          <Paper sx={{ p: 2.5, mb: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Student Details
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography variant="caption" color="textSecondary">Student ID</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedStudent.studentId || selectedStudent.id}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography variant="caption" color="textSecondary">Name</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedStudent.name || `${selectedStudent.firstName} ${selectedStudent.lastName}`}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography variant="caption" color="textSecondary">Program</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedStudent.program || '-'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Typography variant="caption" color="textSecondary">Status</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <StatusChip status={selectedStudent.status || 'Active'} />
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {outstandingInvoices.length > 0 ? (
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                Outstanding Invoices ({outstandingInvoices.length})
              </Typography>
              <DataTable
                rows={outstandingInvoices}
                columns={invoiceColumns}
                pageSize={5}
                exportFilename="outstanding_invoices"
              />
            </Box>
          ) : (
            <Alert severity="info" sx={{ mb: 2.5 }}>
              No outstanding invoices found for this student.
            </Alert>
          )}
        </>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
        Recent Payments
      </Typography>
      <DataTable
        rows={recentPayments.slice().reverse().slice(0, 50)}
        columns={paymentColumns}
        pageSize={10}
        exportFilename="recent_payments"
      />

      <FormDialog
        open={paymentDialogOpen}
        onClose={() => {
          setPaymentDialogOpen(false);
          setSelectedInvoice(null);
        }}
        onSubmit={handlePaymentSubmit}
        title="Record Payment"
        fields={paymentDialogFields}
        initialValues={{
          invoiceNo: selectedInvoice?.invoiceNo || '',
          balanceDisplay: selectedInvoice
            ? `$${((selectedInvoice.amount || 0) - (selectedInvoice.paidAmount || 0)).toFixed(2)}`
            : '$0.00',
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
          { name: 'invoiceNo', label: 'Invoice No', disabled: true },
          { name: 'studentName', label: 'Student Name', disabled: true },
          { name: 'amount', label: 'Amount', disabled: true },
          { name: 'paymentMethod', label: 'Payment Method', disabled: true },
          { name: 'referenceNo', label: 'Reference No', disabled: true },
          { name: 'paymentDate', label: 'Payment Date', disabled: true },
          { name: 'remarks', label: 'Remarks', disabled: true, fullWidth: true },
          { name: 'collector', label: 'Collected By', disabled: true },
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
