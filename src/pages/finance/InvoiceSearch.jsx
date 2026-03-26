import React, { useState, useCallback, useMemo } from 'react';
import {
  Box, Typography, Button, IconButton, Tooltip, Chip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import useSearch from '../../hooks/useSearch';
import { INVOICE_STATUSES } from '../../data/constants';

export default function InvoiceSearch() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch('invoices');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', invoice: null });

  const searchFields = useMemo(
    () => [
      { name: 'invoiceNo', label: 'Invoice No', gridSize: 3 },
      { name: 'studentName', label: 'Student Name', gridSize: 3 },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: INVOICE_STATUSES,
        gridSize: 2,
      },
      { name: 'fromDate', label: 'From Date', type: 'date', gridSize: 2 },
      { name: 'toDate', label: 'To Date', type: 'date', gridSize: 2 },
    ],
    []
  );

  const handleSearchFilters = useCallback(
    (values) => {
      const filters = {};
      if (values.invoiceNo) filters.invoiceNo = values.invoiceNo;
      if (values.studentName) filters.studentName = values.studentName;
      if (values.status) filters.status = values.status;
      handleSearch(filters);
    },
    [handleSearch]
  );

  const filteredData = useMemo(() => {
    return data;
  }, [data]);

  const handleViewInvoice = useCallback((invoice) => {
    setSelectedInvoice(invoice);
    setDetailDialogOpen(true);
  }, []);

  const handleMarkAsPaid = useCallback((invoice) => {
    setConfirmDialog({ open: true, action: 'markPaid', invoice });
  }, []);

  const handleCancelInvoice = useCallback((invoice) => {
    setConfirmDialog({ open: true, action: 'cancel', invoice });
  }, []);

  const handleConfirmAction = useCallback(() => {
    const { action, invoice } = confirmDialog;
    if (action === 'markPaid') {
      storageService.update('invoices', invoice.id, {
        status: 'Paid',
        paidAmount: invoice.amount,
        balance: 0,
        paidDate: new Date().toISOString().split('T')[0],
      });
      enqueueSnackbar(`Invoice ${invoice.invoiceNo} marked as Paid`, { variant: 'success' });
    } else if (action === 'cancel') {
      storageService.update('invoices', invoice.id, {
        status: 'Cancelled',
        cancelledDate: new Date().toISOString().split('T')[0],
        cancelledBy: 'Current User',
      });
      enqueueSnackbar(`Invoice ${invoice.invoiceNo} has been cancelled`, { variant: 'success' });
    }
    setConfirmDialog({ open: false, action: '', invoice: null });
    refresh();
  }, [confirmDialog, enqueueSnackbar, refresh]);

  const columns = useMemo(
    () => [
      { field: 'invoiceNo', headerName: 'Invoice No', width: 140 },
      { field: 'studentName', headerName: 'Student Name', width: 180 },
      { field: 'program', headerName: 'Program', width: 180 },
      {
        field: 'amount',
        headerName: 'Amount',
        width: 120,
        renderCell: (params) => `$${(params.value || 0).toFixed(2)}`,
      },
      {
        field: 'paidAmount',
        headerName: 'Paid',
        width: 110,
        renderCell: (params) => `$${(params.value || 0).toFixed(2)}`,
      },
      {
        field: 'balance',
        headerName: 'Balance',
        width: 110,
        renderCell: (params) => {
          const balance = (params.row.amount || 0) - (params.row.paidAmount || 0);
          return (
            <Typography
              sx={{
                color: balance > 0 ? '#c62828' : '#2e7d32',
                fontWeight: 600,
                fontSize: '0.83rem',
              }}
            >
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
        width: 160,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="View Details">
              <IconButton size="small" onClick={() => handleViewInvoice(params.row)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {['Generated', 'Sent', 'Partially Paid', 'Overdue'].includes(params.row.status) && (
              <>
                <Tooltip title="Mark as Paid">
                  <IconButton
                    size="small"
                    color="success"
                    onClick={() => handleMarkAsPaid(params.row)}
                  >
                    <CheckCircleIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Cancel Invoice">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleCancelInvoice(params.row)}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        ),
      },
    ],
    [handleViewInvoice, handleMarkAsPaid, handleCancelInvoice]
  );

  const detailFields = useMemo(
    () => [
      { name: 'invoiceNo', label: 'Invoice No', disabled: true },
      { name: 'studentName', label: 'Student Name', disabled: true },
      { name: 'program', label: 'Program', disabled: true },
      { name: 'cohort', label: 'Cohort', disabled: true },
      { name: 'amountDisplay', label: 'Invoice Amount', disabled: true },
      { name: 'paidAmountDisplay', label: 'Paid Amount', disabled: true },
      { name: 'balanceDisplay', label: 'Balance', disabled: true },
      { name: 'invoiceDate', label: 'Invoice Date', disabled: true },
      { name: 'dueDate', label: 'Due Date', disabled: true },
      { name: 'status', label: 'Status', disabled: true },
      { name: 'description', label: 'Description', disabled: true, fullWidth: true },
    ],
    []
  );

  return (
    <Box>
      <PageHeader
        title="Invoice Search"
        breadcrumbs={[
          { label: 'Finance', path: '/finance' },
          { label: 'Invoice Search' },
        ]}
      />

      <SearchForm
        fields={searchFields}
        onSearch={handleSearchFilters}
        onReset={handleReset}
      />

      <DataTable
        rows={filteredData}
        columns={columns}
        pageSize={10}
        exportFilename="invoices"
      />

      <FormDialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedInvoice(null);
        }}
        title="Invoice Details"
        fields={detailFields}
        initialValues={
          selectedInvoice
            ? {
                ...selectedInvoice,
                amountDisplay: `$${(selectedInvoice.amount || 0).toFixed(2)}`,
                paidAmountDisplay: `$${(selectedInvoice.paidAmount || 0).toFixed(2)}`,
                balanceDisplay: `$${((selectedInvoice.amount || 0) - (selectedInvoice.paidAmount || 0)).toFixed(2)}`,
              }
            : {}
        }
        submitLabel="Close"
        onSubmit={() => {
          setDetailDialogOpen(false);
          setSelectedInvoice(null);
        }}
        maxWidth="sm"
      />

      <ConfirmDialog
        open={confirmDialog.open}
        title={
          confirmDialog.action === 'markPaid'
            ? 'Mark Invoice as Paid'
            : 'Cancel Invoice'
        }
        message={
          confirmDialog.action === 'markPaid'
            ? `Are you sure you want to mark invoice ${confirmDialog.invoice?.invoiceNo} as fully paid? Amount: $${(confirmDialog.invoice?.amount || 0).toFixed(2)}`
            : `Are you sure you want to cancel invoice ${confirmDialog.invoice?.invoiceNo}? This action cannot be undone.`
        }
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmDialog({ open: false, action: '', invoice: null })}
        confirmLabel={confirmDialog.action === 'markPaid' ? 'Mark as Paid' : 'Cancel Invoice'}
        severity={confirmDialog.action === 'markPaid' ? 'success' : 'error'}
      />
    </Box>
  );
}
