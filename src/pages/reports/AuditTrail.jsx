import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import storageService from '../../services/storageService';

export default function AuditTrail() {
  const [data, setData] = useState([]);
  useEffect(() => { setData(storageService.getAll('audit_trail')); }, []);
  const refresh = () => setData(storageService.getAll('audit_trail'));

  const searchFields = [
    { name: 'user', label: 'User' },
    { name: 'action', label: 'Action', type: 'select', options: ['Create', 'Update', 'Delete', 'Login', 'Logout'] },
    { name: 'entity', label: 'Entity' },
  ];

  const columns = [
    { field: 'timestamp', headerName: 'Timestamp', width: 180 },
    { field: 'user', headerName: 'User', width: 130 },
    { field: 'action', headerName: 'Action', width: 100 },
    { field: 'entity', headerName: 'Entity', width: 130 },
    { field: 'entityId', headerName: 'Entity ID', width: 120 },
    { field: 'details', headerName: 'Details', flex: 1 },
  ];

  return (
    <Box>
      <PageHeader title="Audit Trail" breadcrumbs={[{ label: 'Reports' }, { label: 'Audit Trail' }]} />
      <SearchForm fields={searchFields} onSearch={(f) => setData(storageService.search('audit_trail', f))} onReset={refresh} />
      <DataTable rows={data} columns={columns} exportFilename="audit-trail" />
    </Box>
  );
}