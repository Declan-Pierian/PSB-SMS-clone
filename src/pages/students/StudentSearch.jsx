import React, { useState, useEffect } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';
import storageService from '../../services/storageService';
import { useSnackbar } from 'notistack';
import { STUDENT_STATUSES, COUNTRIES, ENQUIRY_STAGES, ENQUIRY_MODES, STUDENT_INTEREST_LEVELS, SORT_BY_OPTIONS, BATCH_STATUSES, ACADEMIC_YEARS, SEARCH_TYPES } from '../../data/constants';

export default function StudentSearch() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch('students');
  const [programs, setPrograms] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const progs = storageService.getAll('programs');
    setPrograms(progs);
  }, []);

  const programOptions = programs.map((p) => ({
    value: p.name || p.programName || p.courseName || p.id,
    label: p.name || p.programName || p.courseName || p.id,
  }));

  const searchFields = [
    { name: 'enquiryId', label: 'Enquiry ID / Name / Email', gridSize: 3 },
    { name: 'studentCode', label: 'Student Code', gridSize: 2 },
    { name: 'batch', label: 'Batch', gridSize: 2 },
    { name: 'agent', label: 'Agent', gridSize: 2 },
    { name: 'openId', label: 'Open ID', gridSize: 2 },
    { name: 'companyName', label: 'Company Name', gridSize: 2 },
    { name: 'fromEnquiryId', label: 'From Enquiry ID', gridSize: 2 },
    { name: 'toEnquiryId', label: 'To Enquiry ID', gridSize: 2 },
    { name: 'name', label: 'Name', gridSize: 2 },
    { name: 'enquiryFormNumber', label: 'Enquiry Form Number', gridSize: 2 },
    { name: 'year', label: 'Year', type: 'select', options: ACADEMIC_YEARS, gridSize: 2 },
    { name: 'program', label: 'Program', type: 'select', options: programOptions, gridSize: 3 },
    { name: 'searchType', label: 'Search Types', type: 'select', options: SEARCH_TYPES, gridSize: 2 },
    { name: 'batchStatus', label: 'Batch Status', type: 'select', options: BATCH_STATUSES, gridSize: 2 },
    { name: 'state', label: 'State', type: 'select', options: STUDENT_STATUSES, gridSize: 2 },
    { name: 'enquiryMode', label: 'Enquiry Mode', type: 'select', options: ENQUIRY_MODES, gridSize: 2 },
    { name: 'interestLevel', label: 'Student Interest Level', type: 'select', options: STUDENT_INTEREST_LEVELS, gridSize: 2 },
    { name: 'sortBy', label: 'Sort By', type: 'select', options: SORT_BY_OPTIONS, gridSize: 2 },
    { name: 'startStage', label: 'Start Stage', type: 'select', options: ENQUIRY_STAGES, gridSize: 2 },
  ];

  const columns = [
    { field: 'studentId', headerName: 'Enquiry ID', width: 110 },
    { field: 'name', headerName: 'Student Name', width: 180, flex: 1 },
    { field: 'email', headerName: 'Email', width: 190 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { field: 'program', headerName: 'Program', width: 180 },
    { field: 'intake', headerName: 'Intake', width: 110 },
    { field: 'batch', headerName: 'Batch', width: 120 },
    { field: 'nationality', headerName: 'Nationality', width: 110 },
    {
      field: 'status',
      headerName: 'Stage',
      width: 120,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    { field: 'enquiryMode', headerName: 'Source', width: 100 },
    { field: 'enrollmentDate', headerName: 'Enrollment Date', width: 130 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Student">
            <IconButton size="small" onClick={() => handleView(params.row)} color="info">
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(params.row)} color="primary">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => handleDeleteClick(params.row)} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const formFields = [
    { name: 'studentId', label: 'Student ID', disabled: !isNew },
    { name: 'name', label: 'Full Name', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', required: true },
    { name: 'program', label: 'Program', type: 'select', options: programOptions },
    { name: 'intake', label: 'Intake' },
    { name: 'status', label: 'Status', type: 'select', options: STUDENT_STATUSES, required: true },
    { name: 'nationality', label: 'Nationality', type: 'select', options: COUNTRIES },
    { name: 'enrollmentDate', label: 'Enrollment Date', type: 'date' },
    { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
    { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
    { name: 'address', label: 'Address', type: 'textarea', fullWidth: true },
  ];

  const viewFields = [
    { name: 'studentId', label: 'Student ID', disabled: true },
    { name: 'name', label: 'Full Name', disabled: true },
    { name: 'email', label: 'Email', disabled: true },
    { name: 'phone', label: 'Phone', disabled: true },
    { name: 'program', label: 'Program', disabled: true },
    { name: 'intake', label: 'Intake', disabled: true },
    { name: 'status', label: 'Status', disabled: true },
    { name: 'nationality', label: 'Nationality', disabled: true },
    { name: 'enrollmentDate', label: 'Enrollment Date', disabled: true },
    { name: 'dateOfBirth', label: 'Date of Birth', disabled: true },
    { name: 'gender', label: 'Gender', disabled: true },
    { name: 'address', label: 'Address', disabled: true, fullWidth: true },
  ];

  const handleNew = () => {
    setSelected(null);
    setIsNew(true);
    setFormOpen(true);
  };

  const handleView = (row) => {
    setSelected(row);
    setViewOpen(true);
  };

  const handleEdit = (row) => {
    setSelected(row);
    setIsNew(false);
    setFormOpen(true);
  };

  const handleDeleteClick = (row) => {
    setSelected(row);
    setDeleteOpen(true);
  };

  const handleFormSubmit = (values) => {
    if (isNew) {
      const studentId = values.studentId || `STU${new Date().getFullYear().toString().slice(-2)}${String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0')}`;
      storageService.create('students', { ...values, studentId });
      enqueueSnackbar('Student created successfully', { variant: 'success' });
    } else {
      storageService.update('students', selected.id, values);
      enqueueSnackbar('Student updated successfully', { variant: 'success' });
    }
    setFormOpen(false);
    setSelected(null);
    refresh();
  };

  const handleDelete = () => {
    storageService.remove('students', selected.id);
    enqueueSnackbar('Student deleted successfully', { variant: 'success' });
    setDeleteOpen(false);
    setSelected(null);
    refresh();
  };

  return (
    <Box>
      <PageHeader
        title="Student Search"
        breadcrumbs={[
          { label: 'Students', path: '/students/search' },
          { label: 'Student Search' },
        ]}
        actionLabel="Add Student"
        actionIcon={<PersonAddIcon />}
        onAction={handleNew}
      />

      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      <DataTable
        rows={data}
        columns={columns}
        exportFilename="students"
      />

      <FormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setSelected(null); }}
        onSubmit={handleFormSubmit}
        title={isNew ? 'Add New Student' : 'Edit Student'}
        fields={formFields}
        initialValues={selected || {}}
        maxWidth="md"
      />

      <FormDialog
        open={viewOpen}
        onClose={() => { setViewOpen(false); setSelected(null); }}
        onSubmit={() => setViewOpen(false)}
        title="Student Details"
        fields={viewFields}
        initialValues={selected || {}}
        maxWidth="md"
        submitLabel="Close"
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Student"
        message={`Are you sure you want to delete student "${selected?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteOpen(false); setSelected(null); }}
      />
    </Box>
  );
}
