import React, { useState, useMemo } from 'react';
import { Box, Paper, TextField, Button, MenuItem, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';

const breadcrumbs = [{ label: 'Student', path: '/students' }, { label: 'Simple Leads Form' }];

export default function SimpleLeadsForm() {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({ name: '', email: '', phone: '', program: '', source: '', notes: '' });
  const [leads, setLeads] = useState(() => JSON.parse(localStorage.getItem('sms_leads') || '[]'));
  const handleChange = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLead = { id: uuidv4(), ...form, date: new Date().toISOString().split('T')[0], status: 'New' };
    const updated = [...leads, newLead];
    localStorage.setItem('sms_leads', JSON.stringify(updated));
    setLeads(updated);
    enqueueSnackbar('Lead captured successfully', { variant: 'success' });
    setForm({ name: '', email: '', phone: '', program: '', source: '', notes: '' });
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 130 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 150 },
    { field: 'phone', headerName: 'Phone', flex: 0.8, minWidth: 110 },
    { field: 'program', headerName: 'Program Interest', flex: 0.8, minWidth: 110 },
    { field: 'source', headerName: 'Source', flex: 0.6, minWidth: 90 },
    { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 0.5, minWidth: 80 },
  ];

  return (
    <Box>
      <PageHeader title="Simple Leads Form" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Capture New Lead</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Name" value={form.name} onChange={e => handleChange('name', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Email" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Phone" value={form.phone} onChange={e => handleChange('phone', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Program Interest" value={form.program} onChange={e => handleChange('program', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Source" value={form.source} onChange={e => handleChange('source', e.target.value)} size="small">
              <MenuItem value="Web">Web</MenuItem><MenuItem value="Walk-in">Walk-in</MenuItem><MenuItem value="Referral">Referral</MenuItem><MenuItem value="Event">Event</MenuItem><MenuItem value="Agent">Agent</MenuItem>
            </TextField></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Notes" value={form.notes} onChange={e => handleChange('notes', e.target.value)} multiline rows={2} size="small" /></Grid>
            <Grid size={{ xs: 12 }}><Button type="submit" variant="contained" sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Save Lead</Button></Grid>
          </Grid>
        </form>
      </Paper>
      <DataTable rows={leads} columns={columns} exportFilename="leads" />
    </Box>
  );
}