import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useSnackbar } from 'notistack';
import PageHeader from '../../../components/common/PageHeader';
import DataTable from '../../../components/common/DataTable';
import FormDialog from '../../../components/common/FormDialog';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import StatusChip from '../../../components/common/StatusChip';
import storageService from '../../../services/storageService';

const STORAGE_KEY = 'centers';

const breadcrumbs = [
  { label: 'Masters', path: '/masters' },
  { label: 'Partners', path: '/masters/search-bu' },
  { label: 'Center Ingestion' },
];

export default function CenterIngestion() {
  const { enqueueSnackbar } = useSnackbar();
  const [tabIndex, setTabIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // File upload state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [importing, setImporting] = useState(false);

  // Manual form state
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const centers = useMemo(() => storageService.getAll(STORAGE_KEY), [refreshKey]);
  const schools = useMemo(() => storageService.getAll('schools'), []);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const schoolOptions = useMemo(
    () => schools.map((s) => ({ label: s.name, value: s.name })),
    [schools]
  );

  const formFields = [
    { name: 'name', label: 'Center Name', type: 'text', required: true },
    { name: 'code', label: 'Center Code', type: 'text', required: true },
    {
      name: 'school',
      label: 'School / Business Unit',
      type: 'select',
      options: schoolOptions,
      required: true,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: ['Active', 'Inactive'],
      required: true,
    },
    { name: 'address', label: 'Address', type: 'textarea', fullWidth: true },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'country', label: 'Country', type: 'text' },
    { name: 'postalCode', label: 'Postal Code', type: 'text' },
  ];

  const handleFileChange = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      return;
    }

    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n').filter((line) => line.trim());
      if (lines.length < 2) {
        setPreviewData([]);
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const rows = lines.slice(1).map((line, idx) => {
        const vals = line.split(',').map((v) => v.trim());
        const row = { id: `preview-${idx}` };
        headers.forEach((header, i) => {
          row[header] = vals[i] || '';
        });
        return row;
      });

      setPreviewData(rows);
    };
    reader.readAsText(file);
  }, []);

  const handleImport = useCallback(() => {
    if (!previewData.length) {
      enqueueSnackbar('No data to import', { variant: 'warning' });
      return;
    }

    setImporting(true);
    try {
      let importCount = 0;
      previewData.forEach((row) => {
        const center = {
          name: row.name || row.center_name || '',
          code: row.code || row.center_code || '',
          school: row.school || row.business_unit || '',
          address: row.address || '',
          city: row.city || '',
          country: row.country || '',
          postalCode: row.postal_code || row.postalcode || '',
          status: row.status || 'Active',
        };
        if (center.name && center.code) {
          storageService.create(STORAGE_KEY, center);
          importCount++;
        }
      });

      enqueueSnackbar(`Successfully imported ${importCount} centers`, { variant: 'success' });
      setUploadedFile(null);
      setPreviewData([]);
      refresh();
    } catch (error) {
      enqueueSnackbar('Import failed. Please check your file format.', { variant: 'error' });
    } finally {
      setImporting(false);
    }
  }, [previewData, enqueueSnackbar, refresh]);

  const handleFormSubmit = useCallback(
    (values) => {
      try {
        if (editItem) {
          storageService.update(STORAGE_KEY, editItem.id, values);
          enqueueSnackbar('Center updated successfully', { variant: 'success' });
        } else {
          storageService.create(STORAGE_KEY, values);
          enqueueSnackbar('Center created successfully', { variant: 'success' });
        }
        setFormOpen(false);
        setEditItem(null);
        refresh();
      } catch (error) {
        enqueueSnackbar('Operation failed', { variant: 'error' });
      }
    },
    [editItem, enqueueSnackbar, refresh]
  );

  const handleEdit = useCallback((row) => {
    setEditItem(row);
    setFormOpen(true);
  }, []);

  const handleDeleteClick = useCallback((row) => {
    setDeleteItem(row);
    setDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    try {
      storageService.remove(STORAGE_KEY, deleteItem.id);
      enqueueSnackbar('Center deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setDeleteItem(null);
      refresh();
    } catch (error) {
      enqueueSnackbar('Delete failed', { variant: 'error' });
    }
  }, [deleteItem, enqueueSnackbar, refresh]);

  const previewColumns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'code', headerName: 'Code', flex: 0.7, minWidth: 100 },
    { field: 'school', headerName: 'School', flex: 1, minWidth: 150 },
    { field: 'address', headerName: 'Address', flex: 1.2, minWidth: 180 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 80 },
  ];

  const existingColumns = [
    { field: 'code', headerName: 'Code', flex: 0.7, minWidth: 100 },
    { field: 'name', headerName: 'Center Name', flex: 1.2, minWidth: 150 },
    { field: 'school', headerName: 'School', flex: 1, minWidth: 150 },
    { field: 'address', headerName: 'Address', flex: 1.2, minWidth: 180 },
    { field: 'city', headerName: 'City', flex: 0.7, minWidth: 100 },
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
        title="Center Ingestion"
        breadcrumbs={breadcrumbs}
        actionLabel="Add Center"
        onAction={() => {
          setEditItem(null);
          setFormOpen(true);
        }}
      />

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab label="Bulk Import" />
          <Tab label="Existing Centers" />
        </Tabs>

        {tabIndex === 0 && (
          <Box sx={{ p: 3 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Upload a CSV file with columns: name, code, school, address, city, country,
              postalCode, status
            </Alert>

            <Box
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                mb: 2,
                backgroundColor: '#fafafa',
                '&:hover': { borderColor: '#b30537', backgroundColor: '#fff5f7' },
                cursor: 'pointer',
              }}
              onClick={() => document.getElementById('file-upload-input').click()}
            >
              <input
                id="file-upload-input"
                type="file"
                accept=".csv,.txt"
                hidden
                onChange={handleFileChange}
              />
              <CloudUploadIcon sx={{ fontSize: 48, color: '#999', mb: 1 }} />
              <Typography variant="body1" color="textSecondary">
                {uploadedFile
                  ? `Selected: ${uploadedFile.name}`
                  : 'Click or drag a CSV file here to upload'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Supports .csv and .txt files
              </Typography>
            </Box>

            {previewData.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Preview ({previewData.length} records)
                </Typography>
                <DataTable rows={previewData} columns={previewColumns} pageSize={5} />
                <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => {
                      setUploadedFile(null);
                      setPreviewData([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<UploadFileIcon />}
                    onClick={handleImport}
                    disabled={importing}
                    sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}
                  >
                    {importing ? 'Importing...' : `Import ${previewData.length} Centers`}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {tabIndex === 1 && (
          <Box sx={{ p: 0 }}>
            <DataTable rows={centers} columns={existingColumns} exportFilename="centers" />
          </Box>
        )}
      </Paper>

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        title={editItem ? 'Edit Center' : 'Add Center'}
        fields={formFields}
        initialValues={editItem || { status: 'Active' }}
        maxWidth="md"
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Center"
        message={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}
