import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'System', path: '/system' }, { label: 'Uploaded Docs Log' }];

export default function UploadedDocsLog() {
  const { data, handleSearch, handleReset } = useSearch('documents');

  const searchFields = [{ name: 'documentType', label: 'Type', type: 'text', gridSize: 3 }, { name: 'status', label: 'Status', type: 'select', options: ['Verified', 'Pending', 'Received'], gridSize: 2 }];
  const columns = [{ field: 'studentName', headerName: 'Uploaded For', flex: 1.2, minWidth: 150 }, { field: 'documentType', headerName: 'Type', flex: 0.8, minWidth: 100 }, { field: 'uploadDate', headerName: 'Upload Date', flex: 0.8, minWidth: 110 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];

  return (
    <Box>
      <PageHeader title="Uploaded Docs Log" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="documents" />
    </Box>
  );
}
