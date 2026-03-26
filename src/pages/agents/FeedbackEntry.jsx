import React, { useState } from 'react';
import { Box, Paper, TextField, Button, MenuItem, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import PageHeader from '../../components/common/PageHeader';

const breadcrumbs = [{ label: 'Agent Management', path: '/agents' }, { label: 'Feedback Entry' }];

export default function FeedbackFormEntry() {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({});
  const handleChange = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const items = JSON.parse(localStorage.getItem('sms_feedbackResponses') || '[]');
    items.push({ id: uuidv4(), ...form, createdDate: new Date().toISOString().split('T')[0] });
    localStorage.setItem('sms_feedbackResponses', JSON.stringify(items));
    enqueueSnackbar('Saved successfully', { variant: 'success' });
    setForm({});
  };

  return (
    <Box>
      <PageHeader title="Feedback Form Entry" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>

            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Form" value={form.formTitle || ''} onChange={e => handleChange('formTitle', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Respondent" value={form.respondent || ''} onChange={e => handleChange('respondent', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Overall Rating" value={form.overallRating || ''} onChange={e => handleChange('overallRating', e.target.value)} size="small"><MenuItem value="1">1</MenuItem><MenuItem value="2">2</MenuItem><MenuItem value="3">3</MenuItem><MenuItem value="4">4</MenuItem><MenuItem value="5">5</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Comments" value={form.comments || ''} onChange={e => handleChange('comments', e.target.value)} multiline rows={3} size="small" /></Grid>
            <Grid size={{ xs: 12 }}><Button type="submit" variant="contained" sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Save</Button></Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
