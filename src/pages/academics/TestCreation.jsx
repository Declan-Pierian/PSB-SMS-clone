import React, { useState } from 'react';
import { Box, Paper, TextField, Button, MenuItem, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import PageHeader from '../../components/common/PageHeader';

const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Test Creation' }];

export default function TestCreation() {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({});
  const handleChange = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const items = JSON.parse(localStorage.getItem('sms_tests') || '[]');
    items.push({ id: uuidv4(), ...form, createdDate: new Date().toISOString().split('T')[0] });
    localStorage.setItem('sms_tests', JSON.stringify(items));
    enqueueSnackbar('Saved successfully', { variant: 'success' });
    setForm({});
  };

  return (
    <Box>
      <PageHeader title="Test Creation" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>

            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Test Name" value={form.name || ''} onChange={e => handleChange('name', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Category" value={form.category || ''} onChange={e => handleChange('category', e.target.value)} required size="small"><MenuItem value="Mid-Term">Mid-Term</MenuItem><MenuItem value="Final">Final</MenuItem><MenuItem value="Quiz">Quiz</MenuItem><MenuItem value="Assignment">Assignment</MenuItem><MenuItem value="Practical">Practical</MenuItem><MenuItem value="Supplementary">Supplementary</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Type" value={form.type || ''} onChange={e => handleChange('type', e.target.value)} size="small"><MenuItem value="MCQ">MCQ</MenuItem><MenuItem value="Essay">Essay</MenuItem><MenuItem value="Mixed">Mixed</MenuItem><MenuItem value="Practical">Practical</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="date" label="Date" value={form.date || ''} onChange={e => handleChange('date', e.target.value)} InputLabelProps={{ shrink: true }} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Duration (mins)" value={form.duration || ''} onChange={e => handleChange('duration', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Max Marks" value={form.maxMarks || ''} onChange={e => handleChange('maxMarks', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Pass Marks" value={form.passMarks || ''} onChange={e => handleChange('passMarks', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Weightage %" value={form.weightage || ''} onChange={e => handleChange('weightage', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12 }}><Button type="submit" variant="contained" sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Save</Button></Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
