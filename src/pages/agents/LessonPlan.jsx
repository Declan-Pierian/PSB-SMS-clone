import React, { useState } from 'react';
import { Box, Paper, TextField, Button, MenuItem, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import PageHeader from '../../components/common/PageHeader';

const breadcrumbs = [{ label: 'Agent Management', path: '/agents' }, { label: 'LessonPlan' }];

export default function LessonPlan() {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({});
  const handleChange = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const items = JSON.parse(localStorage.getItem('sms_lessonPlans') || '[]');
    items.push({ id: uuidv4(), ...form, createdDate: new Date().toISOString().split('T')[0] });
    localStorage.setItem('sms_lessonPlans', JSON.stringify(items));
    enqueueSnackbar('Saved successfully', { variant: 'success' });
    setForm({});
  };

  return (
    <Box>
      <PageHeader title="LessonPlan" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>

            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Module" value={form.module || ''} onChange={e => handleChange('module', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Instructor" value={form.instructor || ''} onChange={e => handleChange('instructor', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Term" value={form.term || ''} onChange={e => handleChange('term', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Week" value={form.week || ''} onChange={e => handleChange('week', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Topic" value={form.topic || ''} onChange={e => handleChange('topic', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Learning Objectives" value={form.objectives || ''} onChange={e => handleChange('objectives', e.target.value)} multiline rows={2} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Hours" value={form.hours || ''} onChange={e => handleChange('hours', e.target.value)} type="number" size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Status" value={form.status || ''} onChange={e => handleChange('status', e.target.value)} size="small"><MenuItem value="Draft">Draft</MenuItem><MenuItem value="Submitted">Submitted</MenuItem><MenuItem value="Approved">Approved</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12 }}><Button type="submit" variant="contained" sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Save</Button></Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
