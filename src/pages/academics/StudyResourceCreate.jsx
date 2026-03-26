import React, { useState } from 'react';
import { Box, Paper, TextField, MenuItem, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import FileUpload from '../../components/common/FileUpload';
import storageService from '../../services/storageService';
import { RESOURCE_TYPES } from '../../data/constants';

export default function StudyResourceCreate() {
  const [values, setValues] = useState({ title: '', description: '', module: '', type: '', tags: '', status: 'Draft' });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const modules = storageService.getAll('modules');

  const handleChange = (field, value) => setValues(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.title || !values.type) { enqueueSnackbar('Title and type are required', { variant: 'error' }); return; }
    storageService.create('study_resources', { ...values, uploadedBy: 'Admin', uploadDate: new Date().toISOString().split('T')[0], downloads: 0 });
    enqueueSnackbar('Study resource created', { variant: 'success' });
    navigate('/academics/resources');
  };

  return (
    <Box>
      <PageHeader title="Study Resource Creation" breadcrumbs={[{ label: 'Academics' }, { label: 'Create Resource' }]} />
      <Paper sx={{ p: 3, maxWidth: 700 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={12}><TextField fullWidth label="Title" value={values.title} onChange={(e) => handleChange('title', e.target.value)} required size="small" /></Grid>
            <Grid size={12}><TextField fullWidth label="Description" value={values.description} onChange={(e) => handleChange('description', e.target.value)} multiline rows={3} size="small" /></Grid>
            <Grid size={6}>
              <TextField select fullWidth label="Module" value={values.module} onChange={(e) => handleChange('module', e.target.value)} size="small">
                <MenuItem value="">-- Select --</MenuItem>
                {modules.map(m => <MenuItem key={m.id} value={m.name}>{m.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={6}>
              <TextField select fullWidth label="Type" value={values.type} onChange={(e) => handleChange('type', e.target.value)} required size="small">
                {RESOURCE_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={6}><TextField fullWidth label="Tags (comma-separated)" value={values.tags} onChange={(e) => handleChange('tags', e.target.value)} size="small" /></Grid>
            <Grid size={6}>
              <TextField select fullWidth label="Status" value={values.status} onChange={(e) => handleChange('status', e.target.value)} size="small">
                <MenuItem value="Draft">Draft</MenuItem><MenuItem value="Published">Published</MenuItem>
              </TextField>
            </Grid>
            <Grid size={12}><FileUpload accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mp3" label="Upload resource file" /></Grid>
            <Grid size={12}><Button type="submit" variant="contained" sx={{ backgroundColor: '#b30537' }}>Create Resource</Button></Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}