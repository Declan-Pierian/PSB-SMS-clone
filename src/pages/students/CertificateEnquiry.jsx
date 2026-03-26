import React, { useState } from 'react';
import { Box, Paper, TextField, Button, MenuItem, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import PageHeader from '../../components/common/PageHeader';

const breadcrumbs = [{ label: 'Student', path: '/students' }, { label: 'Certificate Program Enquiry' }];

export default function CertificateEnquiry() {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({ name: '', email: '', phone: '', program: '', enquiryType: '', message: '' });
  const handleChange = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const enquiries = JSON.parse(localStorage.getItem('sms_enquiries') || '[]');
    enquiries.push({ id: uuidv4(), ...form, type: 'Certificate', status: 'New', date: new Date().toISOString().split('T')[0] });
    localStorage.setItem('sms_enquiries', JSON.stringify(enquiries));
    enqueueSnackbar('Enquiry submitted successfully', { variant: 'success' });
    setForm({ name: '', email: '', phone: '', program: '', enquiryType: '', message: '' });
  };

  return (
    <Box>
      <PageHeader title="Certificate Program Enquiry" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Enquiry Form</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Full Name" value={form.name} onChange={e => handleChange('name', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Email" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Phone" value={form.phone} onChange={e => handleChange('phone', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Program of Interest" value={form.program} onChange={e => handleChange('program', e.target.value)} required size="small">
              <MenuItem value="CERT-DM">Certificate in Digital Marketing</MenuItem><MenuItem value="CERT-PM">Certificate in Project Management</MenuItem><MenuItem value="CERT-DA">Certificate in Data Analytics</MenuItem>
            </TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Enquiry Type" value={form.enquiryType} onChange={e => handleChange('enquiryType', e.target.value)} size="small">
              <MenuItem value="General">General Information</MenuItem><MenuItem value="Fees">Fee Structure</MenuItem><MenuItem value="Admission">Admission Process</MenuItem><MenuItem value="Schedule">Class Schedule</MenuItem>
            </TextField></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Message" value={form.message} onChange={e => handleChange('message', e.target.value)} multiline rows={3} size="small" /></Grid>
            <Grid size={{ xs: 12 }}><Button type="submit" variant="contained" sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Submit Enquiry</Button></Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}