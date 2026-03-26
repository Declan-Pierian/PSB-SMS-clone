import React, { useState } from 'react';
import { Box, IconButton, Tooltip, Chip } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';
import storageService from '../../services/storageService';
import { useSnackbar } from 'notistack';
import { DOCUMENT_TYPES, DOCUMENT_STATUSES, COUNTRIES, ACADEMIC_YEARS, ENQUIRY_STAGES, SORT_BY_OPTIONS } from '../../data/constants';

export default function DocumentSearch() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch('documents');
  const [formOpen, setFormOpen] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [remarksOpen, setRemarksOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isNew, setIsNew] = useState(false);

  const searchFields = [
    { name: 'targetFromDate', label: 'Target From Date', type: 'date', gridSize: 2 },
    { name: 'targetToDate', label: 'Target To Date', type: 'date', gridSize: 2 },
    { name: 'enquiryId', label: 'Enquiry ID', gridSize: 2 },
    { name: 'studentName', label: 'Student Name', gridSize: 2 },
    { name: 'mobile', label: 'Mobile', gridSize: 2 },
    { name: 'agentName', label: 'Agent Name', gridSize: 2 },
    { name: 'applicationFromDate', label: 'Application From Date', type: 'date', gridSize: 2 },
    { name: 'applicationToDate', label: 'Application To Date', type: 'date', gridSize: 2 },
    { name: 'country', label: 'Country', type: 'select', options: COUNTRIES, gridSize: 2 },
    { name: 'program', label: 'Program', type: 'select', options: [], gridSize: 3 },
    { name: 'year', label: 'Year', type: 'select', options: ACADEMIC_YEARS, gridSize: 2 },
    { name: 'documentType', label: 'Document Type', type: 'select', options: DOCUMENT_TYPES, gridSize: 2 },
    { name: 'currentStage', label: 'Current Stage', type: 'select', options: ENQUIRY_STAGES, gridSize: 2 },
    { name: 'sortBy', label: 'Sort By', type: 'select', options: SORT_BY_OPTIONS, gridSize: 2 },
    { name: 'status', label: 'Status', type: 'select', options: DOCUMENT_STATUSES, gridSize: 2 },
  ];

  const columns = [
    { field: 'studentName', headerName: 'Student Name', width: 180, flex: 1 },
    { field: 'documentType', headerName: 'Document Type', width: 180 },
    { field: 'fileName', headerName: 'File Name', width: 200 },
    { field: 'uploadDate', headerName: 'Upload Date', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    { field: 'remarks', headerName: 'Remarks', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <IconButton size="small" onClick={() => handleView(params.row)} color="info">
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(params.row)} color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {(params.row.status === 'Pending' || params.row.status === 'Received') && (
            <>
              <Tooltip title="Verify">
                <IconButton size="small" onClick={() => handleVerifyClick(params.row)} color="success">
                  <VerifiedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton size="small" onClick={() => handleRejectClick(params.row)} color="error">
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      ),
    },
  ];

  const formFields = [
    { name: 'studentName', label: 'Student Name', required: true },
    { name: 'studentId', label: 'Student ID' },
    { name: 'documentType', label: 'Document Type', type: 'select', options: DOCUMENT_TYPES, required: true },
    { name: 'fileName', label: 'File Name', required: true },
    { name: 'uploadDate', label: 'Upload Date', type: 'date' },
    { name: 'status', label: 'Status', type: 'select', options: DOCUMENT_STATUSES, required: true },
    { name: 'remarks', label: 'Remarks', type: 'textarea', fullWidth: true },
  ];

  const viewFields = [
    { name: 'studentName', label: 'Student Name', disabled: true },
    { name: 'studentId', label: 'Student ID', disabled: true },
    { name: 'documentType', label: 'Document Type', disabled: true },
    { name: 'fileName', label: 'File Name', disabled: true },
    { name: 'uploadDate', label: 'Upload Date', disabled: true },
    { name: 'status', label: 'Status', disabled: true },
    { name: 'remarks', label: 'Remarks', disabled: true, fullWidth: true },
  ];

  const handleNew = () => {
    setSelected(null);
    setIsNew(true);
    setFormOpen(true);
  };

  const handleView = (row) => {
    setSelected(row);
    setRemarksOpen(true);
  };

  const handleEdit = (row) => {
    setSelected(row);
    setIsNew(false);
    setFormOpen(true);
  };

  const handleVerifyClick = (row) => {
    setSelected(row);
    setVerifyOpen(true);
  };

  const handleRejectClick = (row) => {
    setSelected(row);
    setRejectOpen(true);
  };

  const handleFormSubmit = (values) => {
    if (isNew) {
      storageService.create('documents', {
        ...values,
        uploadDate: values.uploadDate || new Date().toISOString().split('T')[0],
        status: values.status || 'Pending',
      });
      enqueueSnackbar('Document record created successfully', { variant: 'success' });
    } else {
      storageService.update('documents', selected.id, values);
      enqueueSnackbar('Document record updated successfully', { variant: 'success' });
    }
    setFormOpen(false);
    setSelected(null);
    refresh();
  };

  const handleVerify = () => {
    storageService.update('documents', selected.id, {
      status: 'Verified',
      verifiedDate: new Date().toISOString().split('T')[0],
      verifiedBy: 'Current User',
    });
    enqueueSnackbar(`Document "${selected.documentType}" verified for ${selected.studentName}`, { variant: 'success' });
    setVerifyOpen(false);
    setSelected(null);
    refresh();
  };

  const handleReject = () => {
    storageService.update('documents', selected.id, {
      status: 'Rejected',
      rejectedDate: new Date().toISOString().split('T')[0],
      rejectedBy: 'Current User',
    });
    enqueueSnackbar(`Document "${selected.documentType}" rejected for ${selected.studentName}`, { variant: 'warning' });
    setRejectOpen(false);
    setSelected(null);
    refresh();
  };

  // Compute summary stats
  const statusCounts = data.reduce((acc, doc) => {
    acc[doc.status] = (acc[doc.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <Box>
      <PageHeader
        title="Document Search"
        breadcrumbs={[
          { label: 'Students', path: '/students/search' },
          { label: 'Document Search' },
        ]}
        actionLabel="Add Document"
        actionIcon={<NoteAddIcon />}
        onAction={handleNew}
      />

      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      {data.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {Object.entries(statusCounts).map(([status, count]) => (
            <Chip
              key={status}
              label={`${status}: ${count}`}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
          ))}
          <Chip label={`Total: ${data.length}`} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
        </Box>
      )}

      <DataTable
        rows={data}
        columns={columns}
        exportFilename="documents"
      />

      <FormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setSelected(null); }}
        onSubmit={handleFormSubmit}
        title={isNew ? 'Add Document Record' : 'Edit Document'}
        fields={formFields}
        initialValues={selected || {}}
        maxWidth="sm"
      />

      <FormDialog
        open={remarksOpen}
        onClose={() => { setRemarksOpen(false); setSelected(null); }}
        onSubmit={() => setRemarksOpen(false)}
        title="Document Details"
        fields={viewFields}
        initialValues={selected || {}}
        maxWidth="sm"
        submitLabel="Close"
      />

      <ConfirmDialog
        open={verifyOpen}
        title="Verify Document"
        message={`Are you sure you want to verify "${selected?.documentType}" for student "${selected?.studentName}"?`}
        onConfirm={handleVerify}
        onCancel={() => { setVerifyOpen(false); setSelected(null); }}
        confirmLabel="Verify"
        severity="success"
      />

      <ConfirmDialog
        open={rejectOpen}
        title="Reject Document"
        message={`Are you sure you want to reject "${selected?.documentType}" for student "${selected?.studentName}"? The student will need to re-upload this document.`}
        onConfirm={handleReject}
        onCancel={() => { setRejectOpen(false); setSelected(null); }}
        confirmLabel="Reject"
        severity="error"
      />
    </Box>
  );
}
