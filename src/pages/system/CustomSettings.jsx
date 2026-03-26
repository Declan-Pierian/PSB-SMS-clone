import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Grid from '@mui/material/Grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';

const breadcrumbs = [{ label: 'System', path: '/system' }, { label: 'Custom Settings' }];

const defaultSettings = {
  general: { institutionName: 'PSB Academy', address: '6 Raffles Boulevard, Marina Square, Singapore 039594', contactEmail: 'info@psb.edu.sg', contactPhone: '+65 6355 1188' },
  academic: { gradingSystem: 'GPA 4.0', passPercentage: '50', maxCredits: '24', academicYear: '2025-2026' },
  finance: { taxRate: '7', currency: 'SGD', paymentGateway: 'Flywire', lateFeePercentage: '5' },
  notifications: { emailEnabled: 'Yes', smsEnabled: 'Yes', reminderDays: '7' },
};

export default function CustomSettings() {
  const { enqueueSnackbar } = useSnackbar();
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('sms_settings') || JSON.stringify(defaultSettings)));

  const handleChange = (group, key, value) => setSettings(prev => ({ ...prev, [group]: { ...prev[group], [key]: value } }));
  const handleSave = () => { localStorage.setItem('sms_settings', JSON.stringify(settings)); enqueueSnackbar('Settings saved', { variant: 'success' }); };

  const groups = [
    { key: 'general', title: 'General Settings', fields: [{ key: 'institutionName', label: 'Institution Name' }, { key: 'address', label: 'Address' }, { key: 'contactEmail', label: 'Contact Email' }, { key: 'contactPhone', label: 'Contact Phone' }] },
    { key: 'academic', title: 'Academic Settings', fields: [{ key: 'gradingSystem', label: 'Grading System' }, { key: 'passPercentage', label: 'Pass Percentage' }, { key: 'maxCredits', label: 'Max Credits Per Term' }, { key: 'academicYear', label: 'Academic Year' }] },
    { key: 'finance', title: 'Finance Settings', fields: [{ key: 'taxRate', label: 'Tax Rate (%)' }, { key: 'currency', label: 'Currency' }, { key: 'paymentGateway', label: 'Payment Gateway' }, { key: 'lateFeePercentage', label: 'Late Fee (%)' }] },
    { key: 'notifications', title: 'Notification Settings', fields: [{ key: 'emailEnabled', label: 'Email Enabled' }, { key: 'smsEnabled', label: 'SMS Enabled' }, { key: 'reminderDays', label: 'Reminder Days Before Due' }] },
  ];

  return (
    <Box>
      <PageHeader title="Custom Settings" breadcrumbs={breadcrumbs} />
      {groups.map(g => (
        <Accordion key={g.key} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 600 }}>{g.title}</Typography></AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {g.fields.map(f => (
                <Grid size={{ xs: 12, sm: 6 }} key={f.key}><TextField fullWidth label={f.label} value={settings[g.key]?.[f.key] || ''} onChange={e => handleChange(g.key, f.key, e.target.value)} size="small" /></Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
      <Box sx={{ mt: 2 }}><Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Save All Settings</Button></Box>
    </Box>
  );
}
