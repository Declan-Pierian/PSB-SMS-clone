import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import useSearch from '../../hooks/useSearch';

const STORAGE_KEY = 'tests';
const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Test Papers Download' }];

export default function TestPapersDownload() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);


  const searchFields = [{ name: 'name', label: 'Test', type: 'text', gridSize: 3 }, { name: 'moduleName', label: 'Module', type: 'text', gridSize: 3 }];
  const columns = [{ field: 'name', headerName: 'Test', flex: 1.2, minWidth: 160 },
    { field: 'moduleName', headerName: 'Module', flex: 1, minWidth: 130 },
    { field: 'category', headerName: 'Category', flex: 0.7, minWidth: 100 },
    { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];


  return (
    <Box>
      <PageHeader title="Test Papers Download" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="tests" />

    </Box>
  );
}
