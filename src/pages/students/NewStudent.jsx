import React, { useState, useMemo } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Paper, TextField, MenuItem, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Grid from '@mui/material/Grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import PageHeader from '../../components/common/PageHeader';
import storageService from '../../services/storageService';

const breadcrumbs = [{ label: 'Student', path: '/students' }, { label: 'New Student' }];
const steps = ['Personal Info', 'Academic Details', 'Documents', 'Review & Submit'];

export default function NewStudent() {
  const { enqueueSnackbar } = useSnackbar();
  const [activeStep, setActiveStep] = useState(0);
  const programs = useMemo(() => storageService.getAll('programs'), []);
  const cohorts = useMemo(() => storageService.getAll('cohorts'), []);
  const [form, setForm] = useState({ name: '', email: '', mobile: '', dob: '', nationality: '', passport: '', program: '', cohort: '', pathway: '', agent: '' });

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const handleNext = () => setActiveStep(s => s + 1);
  const handleBack = () => setActiveStep(s => s - 1);

  const handleSubmit = () => {
    const student = {
      id: uuidv4(), studentCode: `PSB${Date.now().toString().slice(-7)}`, ...form, status: 'Active', stage: 'New Enquiry', enquiryDate: new Date().toISOString().split('T')[0],
    };
    const existing = JSON.parse(localStorage.getItem('sms_students') || '[]');
    existing.push(student);
    localStorage.setItem('sms_students', JSON.stringify(existing));
    enqueueSnackbar('Student registered successfully', { variant: 'success' });
    setActiveStep(0);
    setForm({ name: '', email: '', mobile: '', dob: '', nationality: '', passport: '', program: '', cohort: '', pathway: '', agent: '' });
  };

  const requiredDocs = ['Passport', 'Academic Transcripts', 'English Proficiency Certificate', 'Passport Photo', 'Statement of Purpose'];

  return (
    <Box>
      <PageHeader title="New Student Registration" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
        </Stepper>

        {activeStep === 0 && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Full Name" value={form.name} onChange={e => handleChange('name', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Email" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Mobile" value={form.mobile} onChange={e => handleChange('mobile', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Date of Birth" type="date" value={form.dob} onChange={e => handleChange('dob', e.target.value)} InputLabelProps={{ shrink: true }} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Nationality" value={form.nationality} onChange={e => handleChange('nationality', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Passport Number" value={form.passport} onChange={e => handleChange('passport', e.target.value)} size="small" /></Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Program" value={form.program} onChange={e => handleChange('program', e.target.value)} size="small">{programs.map(p => <MenuItem key={p.shortCode} value={p.shortCode}>{p.name}</MenuItem>)}</TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Cohort" value={form.cohort} onChange={e => handleChange('cohort', e.target.value)} size="small">{cohorts.map(c => <MenuItem key={c.code} value={c.code}>{c.name}</MenuItem>)}</TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Pathway" value={form.pathway} onChange={e => handleChange('pathway', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Agent" value={form.agent} onChange={e => handleChange('agent', e.target.value)} size="small" /></Grid>
          </Grid>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>Required Documents (upload functionality simulated):</Typography>
            <List>{requiredDocs.map(doc => (
              <ListItem key={doc}><ListItemIcon><CheckCircleIcon color="disabled" /></ListItemIcon><ListItemText primary={doc} secondary="No file uploaded" /></ListItem>
            ))}</List>
          </Box>
        )}

        {activeStep === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>Review Student Details</Typography>
            <Grid container spacing={2}>
              {Object.entries(form).filter(([,v]) => v).map(([key, value]) => (
                <Grid size={{ xs: 12, sm: 6 }} key={key}>
                  <Typography variant="body2" color="text.secondary">{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{value}</Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
          {activeStep > 0 && <Button onClick={handleBack}>Back</Button>}
          {activeStep < steps.length - 1 && <Button variant="contained" onClick={handleNext} sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Next</Button>}
          {activeStep === steps.length - 1 && <Button variant="contained" onClick={handleSubmit} sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Submit Registration</Button>}
        </Box>
      </Paper>
    </Box>
  );
}