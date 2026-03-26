import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import useSearch from '../../hooks/useSearch';

const STORAGE_KEY = 'evaluatedTests';
const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Evaluated Tests' }];

export default function EvaluatedStudentTestSearch() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);


  const searchFields = [{ name: 'studentName', label: 'Student', type: 'text', gridSize: 3 }, { name: 'testName', label: 'Test', type: 'text', gridSize: 3 }, { name: 'module', label: 'Module', type: 'text', gridSize: 3 }];
  const columns = [{ field: 'studentName', headerName: 'Student', flex: 1, minWidth: 140 },
    { field: 'testName', headerName: 'Test', flex: 1, minWidth: 130 },
    { field: 'module', headerName: 'Module', flex: 0.8, minWidth: 110 },
    { field: 'marks', headerName: 'Marks', flex: 0.5, minWidth: 70 },
    { field: 'evaluator', headerName: 'Evaluator', flex: 0.8, minWidth: 110 },
    { field: 'secondMarks', headerName: '2nd Eval Marks', flex: 0.6, minWidth: 100 },
    { field: 'finalMarks', headerName: 'Final Marks', flex: 0.6, minWidth: 90 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];


  return (
    <Box>
      <PageHeader title="Evaluated Student Test Search" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="evaluatedTests" />

    </Box>
  );
}
