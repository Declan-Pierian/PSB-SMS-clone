import React, { useState, useCallback, useMemo } from 'react';
import {
  Box, IconButton, Tooltip, Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import useSearch from '../../hooks/useSearch';
import { CREDIT_NOTE_STATUSES } from '../../data/constants';

export default function CreditNoteSearch() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch('credit_notes');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: '',
    note: null,
  });

  const searchFields = useMemo(
    () => [
      { name: 'creditNoteNo', label: 'Credit Note No', gridSize: 3 },
      { name: 'studentName', label: 'Student Name', gridSize: 3 },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: CREDIT_NOTE_STATUSES,
        gridSize: 3,
      },
    ],
    []
  );

  const handleSearchFilters = useCallback(
    (values) => {
      const filters = {};
      if (values.creditNoteNo) filters.creditNoteNo = values.creditNoteNo;
      if (values.studentName) filters.studentName = values.studentName;
      if (values.status) filters.status = values.status;
      handleSearch(filters);
    },
    [handleSearch]
  );

  const handleCreateSubmit = useCallback(
    (values) => {
      const amount = parseFloat(values.amount);
      if (isNaN(amount) || amount <= 0) {
        enqueueSnackbar('Please enter a valid amount', { variant: 'error' });
        return;
      }

      const creditNote = {
        id: uuidv4(),
        creditNoteNo: `CN-${Date.now().toString().slice(-8)}`,
        studentName: values.studentName,
        studentId: values.studentId,
        invoiceRef: values.invoiceRef,
        amount,
        reason: values.reason,
        status: 'Pending Approval',
        createdDate: new Date().toISOString().split('T')[0],
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
      };
      storageService.create('credit_notes', creditNote);
      setCreateDialogOpen(false);
      refresh();
      enqueueSnackbar(`Credit Note ${creditNote.creditNoteNo} created successfully`, {
        variant: 'success',
      });
    },
    [enqueueSnackbar, refresh]
  );

  const handleViewNote = useCallback((note) => {
    setSelectedNote(note);
    setDetailDialogOpen(true);
  }, []);

  const handleApprove = useCallback(
    (note, approvalType) => {
      setConfirmDialog({ open: true, action: approvalType, note });
    },
    []
  );

  const handleReject = useCallback((note) => {
    setConfirmDialog({ open: true, action: 'reject', note });
  }, []);

  const handleConfirmAction = useCallback(() => {
    const { action, note } = confirmDialog;
    let newStatus = '';
    let message = '';

    if (action === 'businessApprove') {
      newStatus = 'Business Approved';
      message = `Credit Note ${note.creditNoteNo} has been business approved`;
    } else if (action === 'financeApprove') {
      newStatus = 'Finance Approved';
      message = `Credit Note ${note.creditNoteNo} has been finance approved`;
    } else if (action === 'reject') {
      newStatus = 'Rejected';
      message = `Credit Note ${note.creditNoteNo} has been rejected`;
    }

    storageService.update('credit_notes', note.id, {
      status: newStatus,
      [`${action}Date`]: new Date().toISOString().split('T')[0],
      [`${action}By`]: 'Current User',
    });

    setConfirmDialog({ open: false, action: '', note: null });
    refresh();
    enqueueSnackbar(message, {
      variant: action === 'reject' ? 'warning' : 'success',
    });
  }, [confirmDialog, enqueueSnackbar, refresh]);

  const createFields = useMemo(
    () => [
      { name: 'studentName', label: 'Student Name', required: true },
      { name: 'studentId', label: 'Student ID' },
      { name: 'invoiceRef', label: 'Invoice Reference', required: true },
      { name: 'amount', label: 'Amount ($)', type: 'number', required: true },
      { name: 'reason', label: 'Reason', type: 'textarea', fullWidth: true, required: true },
    ],
    []
  );

  const columns = useMemo(
    () => [
      { field: 'creditNoteNo', headerName: 'Credit Note No', width: 150 },
      { field: 'studentName', headerName: 'Student Name', width: 180 },
      { field: 'invoiceRef', headerName: 'Invoice Ref', width: 140 },
      {
        field: 'amount',
        headerName: 'Amount',
        width: 120,
        renderCell: (params) => `$${(params.value || 0).toFixed(2)}`,
      },
      {
        field: 'reason',
        headerName: 'Reason',
        width: 200,
        renderCell: (params) => (
          <Tooltip title={params.value || ''}>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {params.value || '-'}
            </span>
          </Tooltip>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 150,
        renderCell: (params) => <StatusChip status={params.value} />,
      },
      { field: 'createdDate', headerName: 'Created Date', width: 130 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 180,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="View Details">
              <IconButton size="small" onClick={() => handleViewNote(params.row)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {params.row.status === 'Pending Approval' && (
              <>
                <Tooltip title="Business Approve">
                  <IconButton
                    size="small"
                    color="success"
                    onClick={() => handleApprove(params.row, 'businessApprove')}
                  >
                    <ThumbUpIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reject">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleReject(params.row)}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {params.row.status === 'Business Approved' && (
              <Tooltip title="Finance Approve">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleApprove(params.row, 'financeApprove')}
                >
                  <CheckCircleIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        ),
      },
    ],
    [handleViewNote, handleApprove, handleReject]
  );

  const detailFields = useMemo(
    () => [
      { name: 'creditNoteNo', label: 'Credit Note No', disabled: true },
      { name: 'studentName', label: 'Student Name', disabled: true },
      { name: 'studentId', label: 'Student ID', disabled: true },
      { name: 'invoiceRef', label: 'Invoice Reference', disabled: true },
      { name: 'amountDisplay', label: 'Amount', disabled: true },
      { name: 'status', label: 'Status', disabled: true },
      { name: 'createdDate', label: 'Created Date', disabled: true },
      { name: 'createdBy', label: 'Created By', disabled: true },
      { name: 'reason', label: 'Reason', disabled: true, fullWidth: true },
    ],
    []
  );

  return (
    <Box>
      <PageHeader
        title="Credit Note Search"
        breadcrumbs={[
          { label: 'Finance', path: '/finance' },
          { label: 'Credit Notes' },
        ]}
        actionLabel="Create Credit Note"
        actionIcon={<AddIcon />}
        onAction={() => setCreateDialogOpen(true)}
      />

      <SearchForm
        fields={searchFields}
        onSearch={handleSearchFilters}
        onReset={handleReset}
      />

      <DataTable
        rows={data}
        columns={columns}
        pageSize={10}
        exportFilename="credit_notes"
      />

      <FormDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateSubmit}
        title="Create Credit Note"
        fields={createFields}
        submitLabel="Create"
        maxWidth="sm"
      />

      <FormDialog
        open={detailDialogOpen}
        onClose={() => {
          setDetailDialogOpen(false);
          setSelectedNote(null);
        }}
        title="Credit Note Details"
        fields={detailFields}
        initialValues={
          selectedNote
            ? {
                ...selectedNote,
                amountDisplay: `$${(selectedNote.amount || 0).toFixed(2)}`,
              }
            : {}
        }
        submitLabel="Close"
        onSubmit={() => {
          setDetailDialogOpen(false);
          setSelectedNote(null);
        }}
        maxWidth="sm"
      />

      <ConfirmDialog
        open={confirmDialog.open}
        title={
          confirmDialog.action === 'reject'
            ? 'Reject Credit Note'
            : confirmDialog.action === 'businessApprove'
            ? 'Business Approve Credit Note'
            : 'Finance Approve Credit Note'
        }
        message={
          confirmDialog.action === 'reject'
            ? `Are you sure you want to reject credit note ${confirmDialog.note?.creditNoteNo}?`
            : `Are you sure you want to approve credit note ${confirmDialog.note?.creditNoteNo} (Amount: $${(confirmDialog.note?.amount || 0).toFixed(2)})?`
        }
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmDialog({ open: false, action: '', note: null })}
        confirmLabel={confirmDialog.action === 'reject' ? 'Reject' : 'Approve'}
        severity={confirmDialog.action === 'reject' ? 'error' : 'success'}
      />
    </Box>
  );
}
