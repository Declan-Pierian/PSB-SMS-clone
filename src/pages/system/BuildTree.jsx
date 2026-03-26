import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'System', path: '/system' }, { label: 'Build Tree' }];

export default function BuildTree() {
  const { data, handleSearch, handleReset } = useSearch('modules');

  const searchFields = [{ name: 'name', label: 'Module', type: 'text', gridSize: 3 }];
  const columns = [{ field: 'name', headerName: 'Module', flex: 1.5, minWidth: 200 }, { field: 'code', headerName: 'Code', flex: 0.7, minWidth: 90 }, { field: 'program', headerName: 'Program', flex: 0.8, minWidth: 100 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];

  return (
    <Box>
      <PageHeader title="Build Tree" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="modules" />
    </Box>
  );
}
