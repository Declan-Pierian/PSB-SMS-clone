import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import FileUpload from '../../components/common/FileUpload';
import storageService from '../../services/storageService';

export default function ResourceIngestion() {
  const [source, setSource] = useState('file');
  const [preview, setPreview] = useState([]);
  const [imported, setImported] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleFiles = () => {
    setPreview([
      { title: 'Introduction to Business', module: 'Business Fundamentals', type: 'PDF' },
      { title: 'Marketing Concepts Video', module: 'Marketing', type: 'Video' },
      { title: 'Financial Accounting Guide', module: 'Accounting', type: 'Document' },
    ]);
    setImported(false);
  };

  const handleImport = () => {
    preview.forEach(r => {
      storageService.create('study_resources', { ...r, status: 'Draft', uploadedBy: 'System', uploadDate: new Date().toISOString().split('T')[0], downloads: 0 });
    });
    setImported(true);
    enqueueSnackbar(`${preview.length} resources ingested`, { variant: 'success' });
  };

  return (
    <Box>
      <PageHeader title="Study Resource Ingestion" breadcrumbs={[{ label: 'Academics' }, { label: 'Resource Ingestion' }]} />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <TextField select label="Source Type" value={source} onChange={(e) => setSource(e.target.value)} size="small" sx={{ width: 300 }}>
              <MenuItem value="file">File Upload</MenuItem>
              <MenuItem value="url">URL Import</MenuItem>
              <MenuItem value="lms">LMS Integration</MenuItem>
            </TextField>
          </Grid>
          <Grid size={12}>
            <FileUpload onFilesChange={handleFiles} accept=".csv,.xlsx,.json" label="Upload resource manifest file" />
          </Grid>
        </Grid>
      </Paper>
      {preview.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Preview ({preview.length} resources)</Typography>
            <Button variant="contained" onClick={handleImport} disabled={imported} sx={{ backgroundColor: '#b30537' }}>{imported ? 'Imported' : 'Import All'}</Button>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead><TableRow sx={{ backgroundColor: '#f8f9fa' }}><TableCell sx={{ fontWeight: 700 }}>Title</TableCell><TableCell sx={{ fontWeight: 700 }}>Module</TableCell><TableCell sx={{ fontWeight: 700 }}>Type</TableCell></TableRow></TableHead>
              <TableBody>{preview.map((r, i) => <TableRow key={i}><TableCell>{r.title}</TableCell><TableCell>{r.module}</TableCell><TableCell>{r.type}</TableCell></TableRow>)}</TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}