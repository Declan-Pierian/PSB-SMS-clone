import React, { useState, useMemo, useCallback } from 'react';
import {
  Box, IconButton, Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import useSearch from '../../hooks/useSearch';
import {
  ENQUIRY_TYPES,
  TERMS,
  ACADEMIC_YEARS,
  TEST_CATEGORIES,
  TEST_TYPES,
  PUBLISH_STATUSES,
  S3_CACHE_STATUSES,
  COURSE_TYPE_2,
} from '../../data/constants';

const STORAGE_KEY = 'tests';

export default function TestSearch() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const programs = useMemo(() => {
    const progs = storageService.getAll('programs');
    return progs.length > 0
      ? progs.map((p) => p.name || p.programName || p.title)
      : ['Bachelor of Science', 'Master of Business', 'Diploma in IT', 'Certificate in Management'];
  }, []);

  const modules = useMemo(() => {
    const mods = storageService.getAll('modules');
    return mods.length > 0
      ? mods.map((m) => m.name || m.moduleName || m.title)
      : ['Mathematics', 'Physics', 'Computer Science', 'Business Studies', 'English', 'Statistics', 'Accounting', 'Economics'];
  }, []);

  const searchFields = useMemo(() => [
    { name: 'testId', label: 'Test ID', gridSize: 3 },
    { name: 'name', label: 'Test Name', gridSize: 3 },
    { name: 'enquiryType', label: 'Enquiry Type', type: 'select', options: ENQUIRY_TYPES, gridSize: 3 },
    { name: 'program', label: 'Program', type: 'select', options: programs, gridSize: 3 },
    { name: 'term', label: 'Term', type: 'select', options: TERMS, gridSize: 3 },
    { name: 'courseName', label: 'Course Name', type: 'select', options: modules, gridSize: 3 },
    { name: 'academicYear', label: 'Academic Year', type: 'select', options: ACADEMIC_YEARS, gridSize: 3 },
    { name: 'category', label: 'Test Category', type: 'select', options: TEST_CATEGORIES, gridSize: 3 },
    { name: 'type', label: 'Test Type', type: 'select', options: TEST_TYPES, gridSize: 3 },
    { name: 'status', label: 'Publish Status', type: 'select', options: PUBLISH_STATUSES, gridSize: 3 },
    { name: 'cachedOnS3', label: 'Cached on S3', type: 'select', options: S3_CACHE_STATUSES, gridSize: 3 },
    { name: 'courseType2', label: 'Course Type 2', type: 'select', options: COURSE_TYPE_2, gridSize: 3 },
    { name: 'fromDate', label: 'From Date', type: 'date', gridSize: 3 },
    { name: 'toDate', label: 'To Date', type: 'date', gridSize: 3 },
  ], [programs, modules]);

  const formFields = useMemo(() => [
    { name: 'name', label: 'Test Name', required: true },
    { name: 'module', label: 'Module', type: 'select', required: true, options: modules },
    { name: 'category', label: 'Category', type: 'select', required: true, options: TEST_CATEGORIES },
    { name: 'type', label: 'Type', type: 'select', required: true, options: TEST_TYPES },
    { name: 'date', label: 'Test Date', type: 'date', required: true },
    { name: 'maxMarks', label: 'Max Marks', type: 'number', required: true },
    { name: 'passMarks', label: 'Pass Marks', type: 'number', required: true },
    { name: 'duration', label: 'Duration (mins)', type: 'number' },
    { name: 'status', label: 'Status', type: 'select', options: PUBLISH_STATUSES },
    { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
  ], [modules]);

  const handleCreate = useCallback(() => {
    setEditItem(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((row) => {
    setEditItem(row);
    setFormOpen(true);
  }, []);

  const handleDelete = useCallback((row) => {
    setDeleteConfirm(row);
  }, []);

  const handleFormSubmit = useCallback((values) => {
    if (editItem) {
      storageService.update(STORAGE_KEY, editItem.id, values);
      enqueueSnackbar('Test updated successfully', { variant: 'success' });
    } else {
      storageService.create(STORAGE_KEY, {
        ...values,
        status: values.status || 'Draft',
        maxMarks: parseFloat(values.maxMarks) || 100,
        passMarks: parseFloat(values.passMarks) || 50,
      });
      enqueueSnackbar('Test created successfully', { variant: 'success' });
    }
    setFormOpen(false);
    setEditItem(null);
    refresh();
  }, [editItem, enqueueSnackbar, refresh]);

  const handleConfirmDelete = useCallback(() => {
    storageService.remove(STORAGE_KEY, deleteConfirm.id);
    enqueueSnackbar('Test deleted successfully', { variant: 'success' });
    setDeleteConfirm(null);
    refresh();
  }, [deleteConfirm, enqueueSnackbar, refresh]);

  const columns = useMemo(() => [
    { field: 'name', headerName: 'Test Name', width: 200 },
    { field: 'module', headerName: 'Module', width: 160 },
    { field: 'category', headerName: 'Category', width: 120 },
    { field: 'type', headerName: 'Type', width: 100 },
    { field: 'date', headerName: 'Date', width: 120 },
    { field: 'maxMarks', headerName: 'Max Marks', width: 100 },
    { field: 'passMarks', headerName: 'Pass Marks', width: 100 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusChip status={params.value || 'Draft'} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(params.row); }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(params.row); }} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ], [handleEdit, handleDelete]);

  return (
    <Box>
      <PageHeader
        title="Test Search"
        breadcrumbs={[
          { label: 'Academics', path: '/academics' },
          { label: 'Test Search' },
        ]}
        actionLabel="Add Test"
        actionIcon={<AddIcon />}
        onAction={handleCreate}
      />

      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      <DataTable
        rows={data}
        columns={columns}
        pageSize={10}
        exportFilename="tests"
      />

      <FormDialog
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditItem(null); }}
        onSubmit={handleFormSubmit}
        title={editItem ? 'Edit Test' : 'Create Test'}
        fields={formFields}
        initialValues={editItem || { status: 'Draft', date: new Date().toISOString().split('T')[0] }}
        maxWidth="md"
        submitLabel={editItem ? 'Update' : 'Create'}
      />

      <ConfirmDialog
        open={!!deleteConfirm}
        title="Delete Test"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        confirmLabel="Delete"
        severity="error"
      />
    </Box>
  );
}
