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

const STORAGE_KEY = 'modules';

const breadcrumbs = [
  { label: 'Masters', path: '/masters' },
  { label: 'Courses', path: '/masters/courses' },
  { label: 'Module Management' },
];

export default function ModuleManagement() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);
  const programs = useMemo(() => storageService.getAll('programs'), []);
  const employees = useMemo(() => storageService.getAll('employees'), []);

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const courseOptions = useMemo(
    () => programs.map((p) => ({ label: p.name, value: p.name })),
    [programs]
  );

  const lecturerOptions = useMemo(
    () =>
      employees
        .filter((e) => e.role === 'Lecturer' || e.department === 'Academic')
        .map((e) => ({ label: e.name, value: e.name })),
    [employees]
  );

  const searchFields = [
    { name: 'name', label: 'Module Name', type: 'text', gridSize: 3 },
    { name: 'code', label: 'Module Code', type: 'text', gridSize: 2 },
    {
      name: 'course',
      label: 'Course',
      type: 'select',
      options: courseOptions,
      gridSize: 3,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: ['Active', 'Inactive', 'Draft'],
      gridSize: 2,
    },
  ];

  const formFields = [
    { name: 'name', label: 'Module Name', type: 'text', required: true, fullWidth: true },
    { name: 'code', label: 'Module Code', type: 'text', required: true },
    {
      name: 'course',
      label: 'Course / Program',
      type: 'select',
      options: courseOptions,
      required: true,
    },
    { name: 'credits', label: 'Credits', type: 'number', required: true },
    {
      name: 'lecturer',
      label: 'Lecturer',
      type: 'select',
      options: lecturerOptions.length > 0 ? lecturerOptions : [{ label: 'No lecturers available', value: '' }],
    },
    { name: 'hours', label: 'Contact Hours', type: 'number' },
    {
      name: 'assessmentType',
      label: 'Assessment Type',
      type: 'select',
      options: ['Exam', 'Coursework', 'Mixed', 'Practical'],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: ['Active', 'Inactive', 'Draft'],
      required: true,
    },
    { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    { name: 'learningOutcomes', label: 'Learning Outcomes', type: 'textarea', fullWidth: true },
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
          enqueueSnackbar('Module updated successfully', { variant: 'success' });
        } else {
          storageService.create(STORAGE_KEY, values);
          enqueueSnackbar('Module created successfully', { variant: 'success' });
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
      enqueueSnackbar('Module deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setDeleteItem(null);
      refresh();
    } catch (error) {
      enqueueSnackbar('Delete failed. Please try again.', { variant: 'error' });
    }
  }, [deleteItem, enqueueSnackbar, refresh]);

  const columns = [
    { field: 'code', headerName: 'Code', flex: 0.7, minWidth: 100 },
    { field: 'name', headerName: 'Module Name', flex: 1.5, minWidth: 200 },
    { field: 'course', headerName: 'Course', flex: 1.2, minWidth: 160 },
    {
      field: 'credits',
      headerName: 'Credits',
      flex: 0.5,
      minWidth: 70,
      type: 'number',
    },
    { field: 'lecturer', headerName: 'Lecturer', flex: 1, minWidth: 140 },
    { field: 'assessmentType', headerName: 'Assessment', flex: 0.7, minWidth: 100 },
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
        title="Module Management"
        breadcrumbs={breadcrumbs}
        actionLabel="Add Module"
        actionIcon={<AddIcon />}
        onAction={handleAdd}
      />

      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      <DataTable rows={data} columns={columns} exportFilename="modules" />

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        title={editItem ? 'Edit Module' : 'Add Module'}
        fields={formFields}
        initialValues={editItem || { status: 'Active' }}
        maxWidth="md"
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Module"
        message={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}
