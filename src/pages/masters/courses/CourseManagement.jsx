import React, { useState, useCallback, useMemo } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';
import PageHeader from '../../../components/common/PageHeader';
import SearchForm from '../../../components/common/SearchForm';
import DataTable from '../../../components/common/DataTable';
import FormDialog from '../../../components/common/FormDialog';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import StatusChip from '../../../components/common/StatusChip';
import storageService from '../../../services/storageService';
import useSearch from '../../../hooks/useSearch';

const STORAGE_KEY = 'programs';

const breadcrumbs = [
  { label: 'Masters', path: '/masters' },
  { label: 'Courses', path: '/masters/courses' },
  { label: 'Course Management' },
];

const courseTypes = [
  'Certificate',
  'Diploma',
  'Advanced Diploma',
  'Bachelor Degree',
  'Master Degree',
  'Doctorate',
  'Short Course',
  'Professional Certificate',
];

export default function CourseManagement() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);
  const schools = useMemo(() => storageService.getAll('schools'), []);

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const schoolOptions = useMemo(
    () => schools.map((s) => ({ label: s.name, value: s.name })),
    [schools]
  );

  const searchFields = [
    { name: 'name', label: 'Course Name', type: 'text', gridSize: 3 },
    {
      name: 'school',
      label: 'School',
      type: 'select',
      options: schoolOptions,
      gridSize: 3,
    },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      options: courseTypes,
      gridSize: 2,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: ['Active', 'Inactive', 'Draft', 'Archived'],
      gridSize: 2,
    },
  ];

  const formFields = [
    { name: 'name', label: 'Course Name', type: 'text', required: true, fullWidth: true },
    { name: 'code', label: 'Course Code', type: 'text', required: true },
    {
      name: 'school',
      label: 'School',
      type: 'select',
      options: schoolOptions,
      required: true,
    },
    {
      name: 'type',
      label: 'Course Type',
      type: 'select',
      options: courseTypes,
      required: true,
    },
    { name: 'duration', label: 'Duration (months)', type: 'number', required: true },
    { name: 'credits', label: 'Total Credits', type: 'number' },
    { name: 'fees', label: 'Course Fees ($)', type: 'number', required: true },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: ['Active', 'Inactive', 'Draft', 'Archived'],
      required: true,
    },
    { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    { name: 'entryRequirements', label: 'Entry Requirements', type: 'textarea', fullWidth: true },
  ];

  const handleAdd = useCallback(() => {
    setEditItem(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((row) => {
    setEditItem(row);
    setFormOpen(true);
  }, []);

  const handleDeleteClick = useCallback((row) => {
    setDeleteItem(row);
    setDeleteOpen(true);
  }, []);

  const handleFormSubmit = useCallback(
    (values) => {
      try {
        if (editItem) {
          storageService.update(STORAGE_KEY, editItem.id, values);
          enqueueSnackbar('Course updated successfully', { variant: 'success' });
        } else {
          storageService.create(STORAGE_KEY, values);
          enqueueSnackbar('Course created successfully', { variant: 'success' });
        }
        setFormOpen(false);
        setEditItem(null);
        refresh();
      } catch (error) {
        enqueueSnackbar('Operation failed. Please try again.', { variant: 'error' });
      }
    },
    [editItem, enqueueSnackbar, refresh]
  );

  const handleDeleteConfirm = useCallback(() => {
    try {
      storageService.remove(STORAGE_KEY, deleteItem.id);
      enqueueSnackbar('Course deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setDeleteItem(null);
      refresh();
    } catch (error) {
      enqueueSnackbar('Delete failed. Please try again.', { variant: 'error' });
    }
  }, [deleteItem, enqueueSnackbar, refresh]);

  const columns = [
    { field: 'code', headerName: 'Code', flex: 0.7, minWidth: 100 },
    { field: 'name', headerName: 'Course Name', flex: 1.5, minWidth: 200 },
    { field: 'school', headerName: 'School', flex: 1, minWidth: 140 },
    { field: 'type', headerName: 'Type', flex: 0.8, minWidth: 120 },
    {
      field: 'duration',
      headerName: 'Duration',
      flex: 0.6,
      minWidth: 90,
      renderCell: (params) => (params.value ? `${params.value} months` : '-'),
    },
    {
      field: 'fees',
      headerName: 'Fees',
      flex: 0.6,
      minWidth: 100,
      renderCell: (params) =>
        params.value ? `$${Number(params.value).toLocaleString()}` : '-',
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.6,
      minWidth: 100,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.7,
      minWidth: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
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

  return (
    <Box>
      <PageHeader
        title="Course Management"
        breadcrumbs={breadcrumbs}
        actionLabel="Add Course"
        actionIcon={<AddIcon />}
        onAction={handleAdd}
      />

      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      <DataTable rows={data} columns={columns} exportFilename="courses" />

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        title={editItem ? 'Edit Course' : 'Add Course'}
        fields={formFields}
        initialValues={editItem || { status: 'Active' }}
        maxWidth="md"
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Course"
        message={`Are you sure you want to delete "${deleteItem?.name}"? This will affect all associated modules and cohorts.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}
