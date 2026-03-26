import React, { useState } from 'react';
import { Box, Paper, TextField, Button, MenuItem, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import PageHeader from '../../components/common/PageHeader';

const breadcrumbs = [{ label: 'Agent Management', path: '/agents' }, { label: 'Add Feedback Form' }];

export default function AddFeedbackForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({});
  const handleChange = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const items = JSON.parse(localStorage.getItem('sms_feedbackForms') || '[]');
    items.push({ id: uuidv4(), ...form, createdDate: new Date().toISOString().split('T')[0] });
    localStorage.setItem('sms_feedbackForms', JSON.stringify(items));
    enqueueSnackbar('Saved successfully', { variant: 'success' });
    setForm({});
  };

  return (
    <Box>
      <PageHeader title="Add Feedback Form" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>

            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Form Title" value={form.title || ''} onChange={e => handleChange('title', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Target" value={form.target || ''} onChange={e => handleChange('target', e.target.value)} size="small"><MenuItem value="Student">Student</MenuItem><MenuItem value="Instructor">Instructor</MenuItem><MenuItem value="Staff">Staff</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Period" value={form.period || ''} onChange={e => handleChange('period', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Description" value={form.description || ''} onChange={e => handleChange('description', e.target.value)} multiline rows={3} size="small" /></Grid>
            <Grid size={{ xs: 12 }}><Button type="submit" variant="contained" sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Save</Button></Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
