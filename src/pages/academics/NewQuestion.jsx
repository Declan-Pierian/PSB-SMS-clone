import React, { useState } from 'react';
import { Box, Paper, TextField, Button, MenuItem, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import PageHeader from '../../components/common/PageHeader';

const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'New Question' }];

export default function NewQuestion() {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({});
  const handleChange = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const items = JSON.parse(localStorage.getItem('sms_questions') || '[]');
    items.push({ id: uuidv4(), ...form, createdDate: new Date().toISOString().split('T')[0] });
    localStorage.setItem('sms_questions', JSON.stringify(items));
    enqueueSnackbar('Saved successfully', { variant: 'success' });
    setForm({});
  };

  return (
    <Box>
      <PageHeader title="New Question" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>

            <Grid size={{ xs: 12 }}><TextField fullWidth label="Question Text" value={form.question || ''} onChange={e => handleChange('question', e.target.value)} required multiline rows={3} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Module" value={form.module || ''} onChange={e => handleChange('module', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Type" value={form.type || ''} onChange={e => handleChange('type', e.target.value)} required size="small"><MenuItem value="MCQ">MCQ</MenuItem><MenuItem value="Essay">Essay</MenuItem><MenuItem value="Short Answer">Short Answer</MenuItem><MenuItem value="True-False">True-False</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Difficulty" value={form.difficulty || ''} onChange={e => handleChange('difficulty', e.target.value)} size="small"><MenuItem value="Easy">Easy</MenuItem><MenuItem value="Medium">Medium</MenuItem><MenuItem value="Hard">Hard</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Marks" value={form.marks || ''} onChange={e => handleChange('marks', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Option A" value={form.optionA || ''} onChange={e => handleChange('optionA', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Option B" value={form.optionB || ''} onChange={e => handleChange('optionB', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Option C" value={form.optionC || ''} onChange={e => handleChange('optionC', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Option D" value={form.optionD || ''} onChange={e => handleChange('optionD', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Correct Answer" value={form.correctAnswer || ''} onChange={e => handleChange('correctAnswer', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12 }}><Button type="submit" variant="contained" sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Save</Button></Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
