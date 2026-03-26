import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import FileUpload from '../../components/common/FileUpload';
import storageService from '../../services/storageService';
import { RESOURCE_TYPES } from '../../data/constants';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function BulkResourceUpload() {
  const [files, setFiles] = useState([]);
  const [mappings, setMappings] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const modules = storageService.getAll('modules');

  const handleFiles = (selectedFiles) => {
    setFiles(selectedFiles);
    const maps = {};
    selectedFiles.forEach((f, i) => { maps[i] = { module: '', type: 'Document' }; });
    setMappings(maps);
  };

  const updateMapping = (index, field, value) => {
    setMappings(prev => ({ ...prev, [index]: { ...prev[index], [field]: value } }));
  };

  const handleImport = () => {
    files.forEach((file, i) => {
      storageService.create('study_resources', {
        title: file.name.replace(/\.[^/.]+$/, ''),
        module: mappings[i]?.module || '',
        type: mappings[i]?.type || 'Document',
        status: 'Draft',
        uploadedBy: 'Admin',
        uploadDate: new Date().toISOString().split('T')[0],
        downloads: 0,
      });
    });
    enqueueSnackbar(`${files.length} resources uploaded`, { variant: 'success' });
    setFiles([]);
  };

  return (
    <Box>
      <PageHeader title="Bulk StudyResource Upload" breadcrumbs={[{ label: 'Academics' }, { label: 'Bulk Upload' }]} />
      <Paper sx={{ p: 3, mb: 3 }}>
        <FileUpload onFilesChange={handleFiles} multiple accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mp3,.jpg,.png" label="Select multiple resource files" />
      </Paper>
      {files.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{files.length} files selected</Typography>
            <Button variant="contained" startIcon={<CloudUploadIcon />} onClick={handleImport} sx={{ backgroundColor: '#b30537' }}>Upload All</Button>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead><TableRow sx={{ backgroundColor: '#f8f9fa' }}><TableCell sx={{ fontWeight: 700 }}>File</TableCell><TableCell sx={{ fontWeight: 700 }}>Module</TableCell><TableCell sx={{ fontWeight: 700 }}>Type</TableCell></TableRow></TableHead>
              <TableBody>
                {files.map((f, i) => (
                  <TableRow key={i}>
                    <TableCell>{f.name}</TableCell>
                    <TableCell><TextField select size="small" value={mappings[i]?.module || ''} onChange={(e) => updateMapping(i, 'module', e.target.value)} sx={{ width: 200 }}><MenuItem value="">-- Select --</MenuItem>{modules.map(m => <MenuItem key={m.id} value={m.name}>{m.name}</MenuItem>)}</TextField></TableCell>
                    <TableCell><TextField select size="small" value={mappings[i]?.type || 'Document'} onChange={(e) => updateMapping(i, 'type', e.target.value)} sx={{ width: 150 }}>{RESOURCE_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}</TextField></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
}