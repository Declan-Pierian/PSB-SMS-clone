import React, { useState, useCallback, useMemo } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import TableChartIcon from '@mui/icons-material/TableChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import storageService from '../../services/storageService';
import useSearch from '../../hooks/useSearch';

const STORAGE_KEY = 'holidays';

const breadcrumbs = [
  { label: 'HR', path: '/hr' },
  { label: 'Holiday List' },
];

const HOLIDAY_TYPES = ['Public', 'Company'];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const YEARS = ['2024', '2025', '2026', '2027', '2028'];

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const searchFields = [
  { name: 'year', label: 'Year', type: 'select', options: YEARS, gridSize: 3 },
  {
    name: 'month',
    label: 'Month',
    type: 'select',
    options: MONTHS.map((m, i) => ({ label: m, value: String(i + 1).padStart(2, '0') })),
    gridSize: 3,
  },
];

const formFields = [
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'name', label: 'Holiday Name', type: 'text', required: true },
  { name: 'type', label: 'Type', type: 'select', options: HOLIDAY_TYPES, required: true },
];

function getDayOfWeek(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return DAY_NAMES[d.getDay()] || '';
}

function getMonthIndex(dateStr) {
  if (!dateStr) return -1;
  return parseInt(dateStr.split('-')[1], 10) - 1;
}

function getYear(dateStr) {
  if (!dateStr) return '';
  return dateStr.split('-')[0];
}

function CalendarView({ holidays, year }) {
  const holidaysByMonth = useMemo(() => {
    const map = {};
    for (let i = 0; i < 12; i++) map[i] = [];
    holidays
      .filter((h) => getYear(h.date) === year)
      .forEach((h) => {
        const mi = getMonthIndex(h.date);
        if (mi >= 0 && mi < 12) map[mi].push(h);
      });
    return map;
  }, [holidays, year]);

  return (
    <Grid container spacing={2}>
      {MONTHS.map((month, idx) => {
        const monthHolidays = holidaysByMonth[idx] || [];
        return (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={month}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                minHeight: 140,
                borderColor: monthHolidays.length > 0 ? '#b30537' : '#e0e0e0',
                borderWidth: monthHolidays.length > 0 ? 2 : 1,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#333' }}>
                  {month}
                </Typography>
                {monthHolidays.length > 0 && (
                  <Chip
                    label={`${monthHolidays.length} holiday${monthHolidays.length > 1 ? 's' : ''}`}
                    size="small"
                    sx={{ backgroundColor: '#fce4ec', color: '#b30537', fontWeight: 600, fontSize: '0.7rem' }}
                  />
                )}
              </Box>
              {monthHolidays.length === 0 ? (
                <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                  No holidays
                </Typography>
              ) : (
                monthHolidays.map((h) => (
                  <Box
                    key={h.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 0.5,
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                        {h.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {h.date} ({getDayOfWeek(h.date)})
                      </Typography>
                    </Box>
                    <Chip
                      label={h.type}
                      size="small"
                      sx={{
                        fontSize: '0.65rem',
                        height: 20,
                        backgroundColor: h.type === 'Public' ? '#e3f2fd' : '#fff8e1',
                        color: h.type === 'Public' ? '#1565c0' : '#f9a825',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                ))
              )}
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default function HolidayList() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);

  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [calendarYear, setCalendarYear] = useState(String(new Date().getFullYear()));

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
        const dayOfWeek = getDayOfWeek(values.date);
        const withDay = { ...values, dayOfWeek };
        if (editItem) {
          storageService.update(STORAGE_KEY, editItem.id, withDay);
          enqueueSnackbar('Holiday updated successfully', { variant: 'success' });
        } else {
          storageService.create(STORAGE_KEY, withDay);
          enqueueSnackbar('Holiday created successfully', { variant: 'success' });
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
      enqueueSnackbar('Holiday deleted successfully', { variant: 'success' });
      setDeleteOpen(false);
      setDeleteItem(null);
      refresh();
    } catch (error) {
      enqueueSnackbar('Delete failed. Please try again.', { variant: 'error' });
    }
  }, [deleteItem, enqueueSnackbar, refresh]);

  const handleSearchWithMapping = useCallback(
    (filters) => {
      const mapped = {};
      if (filters.year) {
        mapped.date = filters.year;
      }
      if (filters.month) {
        mapped.date = (mapped.date || '') ? `${filters.year || ''}-${filters.month}` : `-${filters.month}-`;
      }
      handleSearch(mapped);
    },
    [handleSearch]
  );

  const columns = [
    { field: 'date', headerName: 'Date', flex: 0.8, minWidth: 110 },
    { field: 'name', headerName: 'Holiday Name', flex: 1.5, minWidth: 200 },
    {
      field: 'type',
      headerName: 'Type',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 600,
            borderRadius: '6px',
            height: 24,
            backgroundColor: params.value === 'Public' ? '#e3f2fd' : '#fff8e1',
            color: params.value === 'Public' ? '#1565c0' : '#f9a825',
          }}
        />
      ),
    },
    { field: 'dayOfWeek', headerName: 'Day of Week', flex: 0.8, minWidth: 120 },
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
        title="Holiday List"
        breadcrumbs={breadcrumbs}
        actionLabel="Add Holiday"
        actionIcon={<AddIcon />}
        onAction={handleAdd}
      />

      <SearchForm fields={searchFields} onSearch={handleSearchWithMapping} onReset={handleReset} />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, v) => { if (v) setViewMode(v); }}
          size="small"
        >
          <ToggleButton value="table">
            <Tooltip title="Table View">
              <TableChartIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="calendar">
            <Tooltip title="Calendar View">
              <CalendarMonthIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewMode === 'table' ? (
        <DataTable rows={data} columns={columns} exportFilename="holidays" />
      ) : (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Year:</Typography>
            {YEARS.map((y) => (
              <Chip
                key={y}
                label={y}
                onClick={() => setCalendarYear(y)}
                sx={{
                  fontWeight: 600,
                  backgroundColor: calendarYear === y ? '#b30537' : '#f5f5f5',
                  color: calendarYear === y ? '#fff' : '#333',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: calendarYear === y ? '#800025' : '#e0e0e0' },
                }}
              />
            ))}
          </Box>
          <CalendarView holidays={data} year={calendarYear} />
        </Box>
      )}

      <FormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        title={editItem ? 'Edit Holiday' : 'Add Holiday'}
        fields={formFields}
        initialValues={editItem || {}}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Holiday"
        message={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
}
