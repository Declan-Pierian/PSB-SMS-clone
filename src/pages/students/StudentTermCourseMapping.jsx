import React, { useState, useCallback } from 'react';
import { Box, Button, Tooltip, IconButton } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import useSearch from '../../hooks/useSearch';

const STORAGE_KEY = 'termCourseMapping';
const breadcrumbs = [{ label: 'Student', path: '/students' }, { label: 'Term Course Mapping' }];

export default function StudentTermCourseMapping() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);

  const searchFields = [
    { name: 'studentName', label: 'Student', type: 'text', gridSize: 3 },
    { name: 'term', label: 'Term', type: 'text', gridSize: 2 },
    { name: 'status', label: 'Status', type: 'select', options: ['Mapped', 'Unmapped'], gridSize: 2 },
  ];

  const handleToggleMap = useCallback((row) => {
    const newStatus = row.status === 'Mapped' ? 'Unmapped' : 'Mapped';
    storageService.update(STORAGE_KEY, row.id, { ...row, status: newStatus, mappedDate: newStatus === 'Mapped' ? new Date().toISOString().split('T')[0] : '' });
    enqueueSnackbar(`Student ${newStatus.toLowerCase()}`, { variant: 'success' });
    refresh();
  }, [enqueueSnackbar, refresh]);

  const columns = [
    { field: 'studentCode', headerName: 'Student Code', flex: 0.8, minWidth: 110 },
    { field: 'studentName', headerName: 'Student', flex: 1.2, minWidth: 150 },
    { field: 'term', headerName: 'Term', flex: 0.7, minWidth: 90 },
    { field: 'module', headerName: 'Module', flex: 1, minWidth: 130 },
    { field: 'section', headerName: 'Section', flex: 0.7, minWidth: 90 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'mappedDate', headerName: 'Mapped Date', flex: 0.8, minWidth: 100 },
    { field: 'actions', headerName: 'Actions', flex: 0.6, minWidth: 80, sortable: false, renderCell: (p) => (
      <Tooltip title={p.row.status === 'Mapped' ? 'Unmap' : 'Map'}>
        <IconButton size="small" onClick={() => handleToggleMap(p.row)} color={p.row.status === 'Mapped' ? 'error' : 'primary'}>
          {p.row.status === 'Mapped' ? <LinkOffIcon fontSize="small" /> : <LinkIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
    )},
  ];

  return (
    <Box>
      <PageHeader title="Student Term Course Mapping" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="term-course-mapping" />
    </Box>
  );
}