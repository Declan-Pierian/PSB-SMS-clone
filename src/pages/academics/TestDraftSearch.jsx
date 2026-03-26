import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import useSearch from '../../hooks/useSearch';

const STORAGE_KEY = 'testDrafts';
const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Test Drafts' }];

export default function TestDraftSearch() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);


  const searchFields = [{ name: 'name', label: 'Draft Name', type: 'text', gridSize: 3 }, { name: 'module', label: 'Module', type: 'text', gridSize: 3 }];
  const columns = [{ field: 'name', headerName: 'Draft Name', flex: 1.2, minWidth: 150 },
    { field: 'module', headerName: 'Module', flex: 0.8, minWidth: 100 },
    { field: 'test', headerName: 'Test', flex: 0.8, minWidth: 100 },
    { field: 'questionsCount', headerName: 'Questions', flex: 0.5, minWidth: 70 },
    { field: 'totalMarks', headerName: 'Marks', flex: 0.5, minWidth: 70 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];


  return (
    <Box>
      <PageHeader title="Test Draft Search" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="testDrafts" />

    </Box>
  );
}
