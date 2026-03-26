import React, { useState, useCallback, useMemo } from 'react';
import {
  Box, IconButton, Tooltip,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import storageService from '../../services/storageService';
import useSearch from '../../hooks/useSearch';

export default function InvoiceSearch() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch('invoices');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, action: '', invoice: null });

  const searchFields = useMemo(
    () => [
      { name: 'invoiceNumber', label: 'Invoice Number', gridSize: 4 },
      { name: 'amount', label: 'Amount', gridSize: 4 },
      { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', gridSize: 4 },
    ],
    []
  );

  const handleSearchFilters = useCallback(
    (values) => {
      const filters = {};
      if (values.invoiceNumber) filters.invoiceNumber = values.invoiceNumber;
      if (values.amount) filters.amount = values.amount;
      if (values.dateOfBirth) filters.dateOfBirth = values.dateOfBirth;
      handleSearch(filters);
    },
    [handleSearch]
  );

  const filteredData = useMemo(() => {
    return data;
  }, [data]);

  const handleMarkAsPaid = useCallback((invoice) => {
    setConfirmDialog({ open: true, action: 'markPaid', invoice });
  }, []);

  const handleCancelInvoice = useCallback((invoice) => {
    setConfirmDialog({ open: true, action: 'cancel', invoice });
  }, []);

  const handleGenerateCreditNote = useCallback((invoice) => {
    setConfirmDialog({ open: true, action: 'generateCreditNote', invoice });
  }, []);

  const handleViewPrintInvoice = useCallback((invoice) => {
    setSelectedInvoice(invoice);
    setDetailDialogOpen(true);
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
    } else if (action === 'generateCreditNote') {
      storageService.update('invoices', invoice.id, {
        creditNote: `CN-${invoice.invoiceNo}`,
        creditNoteDate: new Date().toISOString().split('T')[0],
      });
      enqueueSnackbar(`Credit Note generated for Invoice ${invoice.invoiceNo}`, { variant: 'success' });
    }
    setConfirmDialog({ open: false, action: '', invoice: null });
    refresh();
  }, [confirmDialog, enqueueSnackbar, refresh]);

  const columns = useMemo(
    () => [
      { field: 'invoiceNo', headerName: 'Invoice Number', width: 140 },
      { field: 'invoiceDate', headerName: 'Invoice Date', width: 120 },
      { field: 'dueDate', headerName: 'Due Date', width: 120 },
      { field: 'appNumber', headerName: 'App Number', width: 130 },
      { field: 'studentName', headerName: 'Student Name', width: 180 },
      { field: 'invoiceTo', headerName: 'Invoice To', width: 160 },
      {
        field: 'amount',
        headerName: 'Amount',
        width: 120,
        renderCell: (params) => `$${(params.value || 0).toFixed(2)}`,
      },
      {
        field: 'taxAmount',
        headerName: 'Tax Amount',
        width: 120,
        renderCell: (params) => `$${(params.value || 0).toFixed(2)}`,
      },
      {
        field: 'totalAmount',
        headerName: 'Total Amount',
        width: 130,
        renderCell: (params) => `$${(params.value || 0).toFixed(2)}`,
      },
      { field: 'creditNote', headerName: 'Credit Note', width: 130 },
      {
        field: 'actions',
        headerName: 'Action',
        width: 200,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Generate Credit Note">
              <IconButton size="small" color="primary" onClick={() => handleGenerateCreditNote(params.row)}>
                <NoteAddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="View/Print Invoice">
              <IconButton size="small" onClick={() => handleViewPrintInvoice(params.row)}>
                <PrintIcon fontSize="small" />
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
    [handleViewPrintInvoice, handleGenerateCreditNote, handleMarkAsPaid, handleCancelInvoice]
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
