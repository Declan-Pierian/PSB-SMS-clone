import React, { useState } from 'react';
import { Box, Paper, TextField, Button, MenuItem, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import PageHeader from '../../components/common/PageHeader';

const breadcrumbs = [{ label: 'Agent Management', path: '/agents' }, { label: 'Peer Feedback' }];

export default function PeerToPeerFeedback() {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({});
  const handleChange = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const items = JSON.parse(localStorage.getItem('sms_peerFeedback') || '[]');
    items.push({ id: uuidv4(), ...form, createdDate: new Date().toISOString().split('T')[0] });
    localStorage.setItem('sms_peerFeedback', JSON.stringify(items));
    enqueueSnackbar('Saved successfully', { variant: 'success' });
    setForm({});
  };

  return (
    <Box>
      <PageHeader title="Peer To Peer Feedback" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>

            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Feedback For" value={form.feedbackFor || ''} onChange={e => handleChange('feedbackFor', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="From" value={form.from || ''} onChange={e => handleChange('from', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Communication" value={form.communication || ''} onChange={e => handleChange('communication', e.target.value)} size="small"><MenuItem value="1">1 - Poor</MenuItem><MenuItem value="2">2 - Fair</MenuItem><MenuItem value="3">3 - Good</MenuItem><MenuItem value="4">4 - Very Good</MenuItem><MenuItem value="5">5 - Excellent</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Teamwork" value={form.teamwork || ''} onChange={e => handleChange('teamwork', e.target.value)} size="small"><MenuItem value="1">1 - Poor</MenuItem><MenuItem value="2">2 - Fair</MenuItem><MenuItem value="3">3 - Good</MenuItem><MenuItem value="4">4 - Very Good</MenuItem><MenuItem value="5">5 - Excellent</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Comments" value={form.comments || ''} onChange={e => handleChange('comments', e.target.value)} multiline rows={3} size="small" /></Grid>
            <Grid size={{ xs: 12 }}><Button type="submit" variant="contained" sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Save</Button></Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
