import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'Reports', path: '/reports' }, { label: 'Section Reports' }];

export default function SectionReports() {
  const { data, handleSearch, handleReset } = useSearch('sections');

  const searchFields = [{ name: 'name', label: 'Section', type: 'text', gridSize: 3 }, { name: 'module', label: 'Module', type: 'text', gridSize: 3 }];
  const columns = [{ field: 'name', headerName: 'Section', flex: 1, minWidth: 130 },
    { field: 'module', headerName: 'Module', flex: 1, minWidth: 130 },
    { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 },
    { field: 'capacity', headerName: 'Capacity', flex: 0.5, minWidth: 70 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];

  return (
    <Box>
      <PageHeader title="Section Reports" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="sections" />
    </Box>
  );
}
