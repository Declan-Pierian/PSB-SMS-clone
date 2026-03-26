import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import useSearch from '../../hooks/useSearch';

const STORAGE_KEY = 'appraisals';
const breadcrumbs = [{ label: 'Agent Management', path: '/agents' }, { label: 'Appraisal' }];

export default function AppraisalSection() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);


  const searchFields = [{ name: 'employeeName', label: 'Employee', type: 'text', gridSize: 3 }, { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'In Progress', 'Completed'], gridSize: 2 }];
  const columns = [{ field: 'employeeName', headerName: 'Employee', flex: 1.2, minWidth: 150 }, { field: 'department', headerName: 'Department', flex: 0.8, minWidth: 110 }, { field: 'period', headerName: 'Period', flex: 0.7, minWidth: 90 }, { field: 'selfRating', headerName: 'Self', flex: 0.4, minWidth: 60 }, { field: 'managerRating', headerName: 'Manager', flex: 0.5, minWidth: 70 }, { field: 'finalRating', headerName: 'Final', flex: 0.4, minWidth: 60 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];


  return (
    <Box>
      <PageHeader title="Appraisal Section" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="appraisals" />

    </Box>
  );
}
