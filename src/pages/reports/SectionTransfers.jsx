import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'Reports', path: '/reports' }, { label: 'Section Transfers' }];

export default function SectionTransfers() {
  const { data, handleSearch, handleReset } = useSearch('sectionTransfers');

  const searchFields = [{ name: 'studentName', label: 'Student', type: 'text', gridSize: 3 }];
  const columns = [{ field: 'studentName', headerName: 'Student', flex: 1.2, minWidth: 150 },
    { field: 'fromSection', headerName: 'From Section', flex: 1, minWidth: 130 },
    { field: 'toSection', headerName: 'To Section', flex: 1, minWidth: 130 },
    { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];

  return (
    <Box>
      <PageHeader title="Section Transfers" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="sectionTransfers" />
    </Box>
  );
}
