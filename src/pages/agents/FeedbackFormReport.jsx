import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'Agent Management', path: '/agents' }, { label: 'Feedback Report' }];

export default function FeedbackFormReport() {
  const { data, handleSearch, handleReset } = useSearch('feedbackForms');

  const searchFields = [{ name: 'title', label: 'Form Title', type: 'text', gridSize: 3 }];
  const columns = [{ field: 'title', headerName: 'Form', flex: 1.2, minWidth: 150 }, { field: 'target', headerName: 'Target', flex: 0.7, minWidth: 90 }, { field: 'period', headerName: 'Period', flex: 0.7, minWidth: 90 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];

  return (
    <Box>
      <PageHeader title="Feedback Form Report" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="feedbackForms" />
    </Box>
  );
}
