import React, { useState } from 'react';
import { Box, Paper, TextField, Button, MenuItem, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import PageHeader from '../../components/common/PageHeader';

const breadcrumbs = [{ label: 'Student', path: '/students' }, { label: 'Application for SET' }];

export default function ApplicationSET() {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({ name: '', email: '', mobile: '', program: '', intake: '', nationality: '' });
  const handleChange = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const apps = JSON.parse(localStorage.getItem('sms_applications') || '[]');
    apps.push({ id: uuidv4(), ...form, type: 'SET', status: 'Submitted', date: new Date().toISOString().split('T')[0] });
    localStorage.setItem('sms_applications', JSON.stringify(apps));
    enqueueSnackbar('SET Application submitted successfully', { variant: 'success' });
    setForm({ name: '', email: '', mobile: '', program: '', intake: '', nationality: '' });
  };

  return (
    <Box>
      <PageHeader title="Application for SET" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>School of Engineering & Technology Application</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Full Name" value={form.name} onChange={e => handleChange('name', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Email" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Mobile" value={form.mobile} onChange={e => handleChange('mobile', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Nationality" value={form.nationality} onChange={e => handleChange('nationality', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Program" value={form.program} onChange={e => handleChange('program', e.target.value)} required size="small">
              <MenuItem value="BENG">Bachelor of Engineering</MenuItem><MenuItem value="DIP-IT">Diploma in IT</MenuItem><MenuItem value="BSC-CS">BSc Computer Science</MenuItem>
            </TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Intake" value={form.intake} onChange={e => handleChange('intake', e.target.value)} size="small">
              <MenuItem value="Jan 2026">Jan 2026</MenuItem><MenuItem value="May 2026">May 2026</MenuItem><MenuItem value="Sep 2026">Sep 2026</MenuItem>
            </TextField></Grid>
            <Grid size={{ xs: 12 }}><Button type="submit" variant="contained" sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Submit Application</Button></Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}