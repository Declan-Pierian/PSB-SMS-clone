import React, { useState } from 'react';
import { Box, Paper, TextField, Button, MenuItem, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import PageHeader from '../../components/common/PageHeader';

const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Paper Maker' }];

export default function PaperMaker() {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({});
  const handleChange = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const items = JSON.parse(localStorage.getItem('sms_testDrafts') || '[]');
    items.push({ id: uuidv4(), ...form, createdDate: new Date().toISOString().split('T')[0] });
    localStorage.setItem('sms_testDrafts', JSON.stringify(items));
    enqueueSnackbar('Saved successfully', { variant: 'success' });
    setForm({});
  };

  return (
    <Box>
      <PageHeader title="Paper Maker" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>

            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Paper Name" value={form.name || ''} onChange={e => handleChange('name', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Module" value={form.module || ''} onChange={e => handleChange('module', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Test" value={form.test || ''} onChange={e => handleChange('test', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Total Marks" value={form.totalMarks || ''} onChange={e => handleChange('totalMarks', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Questions Count" value={form.questionsCount || ''} onChange={e => handleChange('questionsCount', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Status" value={form.status || ''} onChange={e => handleChange('status', e.target.value)} size="small"><MenuItem value="Draft">Draft</MenuItem><MenuItem value="Published">Published</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12 }}><Button type="submit" variant="contained" sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Save</Button></Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
