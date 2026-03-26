import React, { useState, useMemo } from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, MenuItem, TextField, Button, Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import PivotTableIcon from '@mui/icons-material/PivotTableChart';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import storageService from '../../services/storageService';

const ROW_DIMENSIONS = [
  { value: 'program', label: 'Program', dataKey: 'programName', fallback: 'program' },
  { value: 'cohort', label: 'Cohort', dataKey: 'cohortName', fallback: 'cohort' },
  { value: 'status', label: 'Status', dataKey: 'status', fallback: 'status' },
];

const COL_DIMENSIONS = [
  { value: 'month', label: 'Month' },
  { value: 'status', label: 'Status' },
  { value: 'type', label: 'Type' },
];

const METRICS = [
  { value: 'count', label: 'Count' },
  { value: 'amount', label: 'Amount ($)' },
];

const getMonthFromDate = (dateStr) => {
  if (!dateStr) return 'Unknown';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Unknown';
  return d.toLocaleString('default', { month: 'short', year: 'numeric' });
};

export default function GridReport() {
  const { enqueueSnackbar } = useSnackbar();
  const [rowDim, setRowDim] = useState('program');
  const [colDim, setColDim] = useState('status');
  const [metric, setMetric] = useState('count');
  const [generated, setGenerated] = useState(false);

  const students = storageService.getAll('students');
  const payments = storageService.getAll('payments');

  const sourceData = metric === 'amount' ? payments : students;

  const pivotData = useMemo(() => {
    if (!generated) return { rows: [], colHeaders: [], data: {} };

    const rowDimConfig = ROW_DIMENSIONS.find((r) => r.value === rowDim);

    const getRowValue = (item) => {
      return item[rowDimConfig.dataKey] || item[rowDimConfig.fallback] || 'N/A';
    };

    const getColValue = (item) => {
      if (colDim === 'month') {
        return getMonthFromDate(item.createdAt || item.date || item.enrollmentDate || item.paymentDate);
      }
      if (colDim === 'status') return item.status || 'N/A';
      if (colDim === 'type') return item.type || item.category || item.paymentMethod || 'N/A';
      return 'N/A';
    };

    const rowSet = new Set();
    const colSet = new Set();
    const data = {};

    sourceData.forEach((item) => {
      const rv = getRowValue(item);
      const cv = getColValue(item);
      rowSet.add(rv);
      colSet.add(cv);
      const key = `${rv}__${cv}`;
      if (!data[key]) data[key] = { count: 0, amount: 0 };
      data[key].count += 1;
      data[key].amount += parseFloat(item.amount || item.totalAmount || item.fee || 0);
    });

    const rows = Array.from(rowSet).sort();
    const colHeaders = Array.from(colSet).sort();

    return { rows, colHeaders, data };
  }, [generated, sourceData, rowDim, colDim]);

  const handleGenerate = () => {
    setGenerated(true);
    enqueueSnackbar('Pivot report generated', { variant: 'success' });
  };

  const handleExport = () => {
    if (pivotData.rows.length === 0) return;
    const headers = ['Row / Column', ...pivotData.colHeaders, 'Total'];
    const csvRows = pivotData.rows.map((row) => {
      const vals = pivotData.colHeaders.map((col) => {
        const key = `${row}__${col}`;
        const cell = pivotData.data[key];
        return cell ? (metric === 'amount' ? cell.amount.toFixed(2) : cell.count) : 0;
      });
      const total = vals.reduce((a, b) => a + parseFloat(b), 0);
      return [row, ...vals, metric === 'amount' ? total.toFixed(2) : total].join(',');
    });
    const csv = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grid-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCellValue = (row, col) => {
    const key = `${row}__${col}`;
    const cell = pivotData.data[key];
    if (!cell) return 0;
    return metric === 'amount' ? `$${cell.amount.toFixed(2)}` : cell.count;
  };

  const getRowTotal = (row) => {
    let total = 0;
    pivotData.colHeaders.forEach((col) => {
      const key = `${row}__${col}`;
      const cell = pivotData.data[key];
      if (cell) total += metric === 'amount' ? cell.amount : cell.count;
    });
    return metric === 'amount' ? `$${total.toFixed(2)}` : total;
  };

  const getColTotal = (col) => {
    let total = 0;
    pivotData.rows.forEach((row) => {
      const key = `${row}__${col}`;
      const cell = pivotData.data[key];
      if (cell) total += metric === 'amount' ? cell.amount : cell.count;
    });
    return metric === 'amount' ? `$${total.toFixed(2)}` : total;
  };

  const getGrandTotal = () => {
    let total = 0;
    Object.values(pivotData.data).forEach((cell) => {
      total += metric === 'amount' ? cell.amount : cell.count;
    });
    return metric === 'amount' ? `$${total.toFixed(2)}` : total;
  };

  return (
    <Box>
      <PageHeader
        title="Grid / Pivot Report"
        breadcrumbs={[
          { label: 'Reports', path: '/reports' },
          { label: 'Grid Report' },
        ]}
      />

      <Paper sx={{ p: 2.5, mb: 3 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              fullWidth
              label="Rows Dimension"
              value={rowDim}
              onChange={(e) => { setRowDim(e.target.value); setGenerated(false); }}
              size="small"
            >
              {ROW_DIMENSIONS.map((d) => (
                <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              fullWidth
              label="Columns Dimension"
              value={colDim}
              onChange={(e) => { setColDim(e.target.value); setGenerated(false); }}
              size="small"
            >
              {COL_DIMENSIONS.map((d) => (
                <MenuItem key={d.value} value={d.value}>{d.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              fullWidth
              label="Metric"
              value={metric}
              onChange={(e) => { setMetric(e.target.value); setGenerated(false); }}
              size="small"
            >
              {METRICS.map((m) => (
                <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<PivotTableIcon />}
                onClick={handleGenerate}
                sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}
              >
                Generate
              </Button>
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={handleExport}
                disabled={pivotData.rows.length === 0}
                color="inherit"
              >
                Export
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {generated && pivotData.rows.length > 0 ? (
        <TableContainer component={Paper}>
          <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 1 }}>
            <PivotTableIcon sx={{ color: '#b30537' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Pivot Table
            </Typography>
            <Chip label={`${pivotData.rows.length} rows x ${pivotData.colHeaders.length} cols`} size="small" />
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                <TableCell sx={{ fontWeight: 700, minWidth: 150 }}>
                  {ROW_DIMENSIONS.find((r) => r.value === rowDim)?.label} / {COL_DIMENSIONS.find((c) => c.value === colDim)?.label}
                </TableCell>
                {pivotData.colHeaders.map((col) => (
                  <TableCell key={col} align="right" sx={{ fontWeight: 600, minWidth: 90 }}>
                    {col}
                  </TableCell>
                ))}
                <TableCell align="right" sx={{ fontWeight: 700, minWidth: 90, backgroundColor: '#f0f0f0' }}>
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pivotData.rows.map((row) => (
                <TableRow key={row} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{row}</TableCell>
                  {pivotData.colHeaders.map((col) => (
                    <TableCell key={col} align="right">
                      {getCellValue(row, col)}
                    </TableCell>
                  ))}
                  <TableCell align="right" sx={{ fontWeight: 600, backgroundColor: '#f9f9f9' }}>
                    {getRowTotal(row)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
                <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                {pivotData.colHeaders.map((col) => (
                  <TableCell key={col} align="right" sx={{ fontWeight: 600 }}>
                    {getColTotal(col)}
                  </TableCell>
                ))}
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {getGrandTotal()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : generated ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="textSecondary">No data available for the selected dimensions.</Typography>
        </Paper>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <PivotTableIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
          <Typography color="textSecondary">
            Select your dimensions and metric, then click Generate to create the pivot report.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
