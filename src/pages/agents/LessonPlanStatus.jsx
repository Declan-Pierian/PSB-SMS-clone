import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'Agent Management', path: '/agents' }, { label: 'LessonPlan Status' }];

export default function LessonPlanStatus() {
  const { data, handleSearch, handleReset } = useSearch('lessonPlans');

  const searchFields = [{ name: 'module', label: 'Module', type: 'text', gridSize: 3 }, { name: 'instructor', label: 'Instructor', type: 'text', gridSize: 3 }];
  const columns = [{ field: 'module', headerName: 'Module', flex: 1.2, minWidth: 150 }, { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }];

  return (
    <Box>
      <PageHeader title="LessonPlan Status" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="lessonPlans" />
    </Box>
  );
}
