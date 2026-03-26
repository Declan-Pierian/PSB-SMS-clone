import React from 'react';
import { Box, Button, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export default function DataTable({
  rows = [],
  columns = [],
  loading = false,
  pageSize = 10,
  onRowClick,
  toolbar,
  exportFilename = 'export',
  checkboxSelection = false,
  onSelectionChange,
  getRowId,
  sx = {},
  autoHeight = true,
  density = 'standard',
}) {
  const handleExport = () => {
    if (!rows.length) return;
    const visibleCols = columns.filter((c) => c.field !== 'actions');
    const headers = visibleCols.map((c) => c.headerName || c.field);
    const csvRows = rows.map((row) =>
      visibleCols.map((c) => {
        const val = row[c.field];
        if (val === null || val === undefined) return '';
        const str = String(val);
        return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
      })
    );
    const csv = [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportFilename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', ...sx }}>
      {(toolbar || rows.length > 0) && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderBottom: '1px solid #eee' }}>
          <Box>{toolbar}</Box>
          <Button size="small" startIcon={<FileDownloadIcon />} onClick={handleExport} disabled={!rows.length}>
            Export CSV
          </Button>
        </Box>
      )}
      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: { paginationModel: { pageSize } },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        checkboxSelection={checkboxSelection}
        onRowSelectionModelChange={onSelectionChange}
        onRowClick={onRowClick}
        getRowId={getRowId || ((row) => row.id)}
        disableRowSelectionOnClick
        autoHeight={autoHeight}
        density={density}
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f8f9fa',
            fontWeight: 600,
            fontSize: '0.83rem',
          },
          '& .MuiDataGrid-cell': {
            fontSize: '0.83rem',
          },
          '& .MuiDataGrid-row:hover': {
            backgroundColor: 'rgba(179, 5, 55, 0.03)',
          },
        }}
      />
    </Paper>
  );
}
