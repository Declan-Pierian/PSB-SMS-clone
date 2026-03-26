import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, MenuItem, Button, Stepper, Step, StepLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import FileUpload from '../../components/common/FileUpload';
import storageService from '../../services/storageService';

export default function MarksImport() {
  const [step, setStep] = useState(0);
  const [testId, setTestId] = useState('');
  const [preview, setPreview] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const tests = storageService.getAll('tests');

  const handleFiles = () => {
    setPreview([
      { studentName: 'John Smith', studentId: 'STU001', marks: 85, maxMarks: 100 },
      { studentName: 'Sarah Lee', studentId: 'STU002', marks: 72, maxMarks: 100 },
      { studentName: 'Mike Chen', studentId: 'STU003', marks: 91, maxMarks: 100 },
      { studentName: 'Anna Wong', studentId: 'STU004', marks: 68, maxMarks: 100 },
      { studentName: 'David Tan', studentId: 'STU005', marks: 55, maxMarks: 100 },
    ]);
    setStep(1);
  };

  const handleImport = () => {
    enqueueSnackbar(`${preview.length} marks imported successfully`, { variant: 'success' });
    setStep(2);
  };

  return (
    <Box>
      <PageHeader title="Excel 2 Stage Marks Import" breadcrumbs={[{ label: 'Academics' }, { label: 'Marks Import' }]} />
      <Stepper activeStep={step} sx={{ mb: 3 }}>
        <Step><StepLabel>Select Test & Upload</StepLabel></Step>
        <Step><StepLabel>Preview & Validate</StepLabel></Step>
        <Step><StepLabel>Complete</StepLabel></Step>
      </Stepper>
      {step === 0 && (
        <Paper sx={{ p: 3 }}>
          <TextField select label="Select Test" value={testId} onChange={(e) => setTestId(e.target.value)} size="small" sx={{ width: 400, mb: 3 }} fullWidth>
            <MenuItem value="">-- Select Test --</MenuItem>
            {tests.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
          </TextField>
          <FileUpload onFilesChange={handleFiles} accept=".csv,.xlsx,.xls" label="Upload marks file (CSV/Excel)" />
        </Paper>
      )}
      {step === 1 && (
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Preview ({preview.length} records)</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}><Button onClick={() => setStep(0)}>Back</Button><Button variant="contained" onClick={handleImport} sx={{ backgroundColor: '#b30537' }}>Confirm Import</Button></Box>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead><TableRow sx={{ backgroundColor: '#f8f9fa' }}><TableCell sx={{ fontWeight: 700 }}>Student ID</TableCell><TableCell sx={{ fontWeight: 700 }}>Name</TableCell><TableCell align="right" sx={{ fontWeight: 700 }}>Marks</TableCell><TableCell align="right" sx={{ fontWeight: 700 }}>Max</TableCell><TableCell align="right" sx={{ fontWeight: 700 }}>%</TableCell></TableRow></TableHead>
              <TableBody>{preview.map((r, i) => <TableRow key={i}><TableCell>{r.studentId}</TableCell><TableCell>{r.studentName}</TableCell><TableCell align="right">{r.marks}</TableCell><TableCell align="right">{r.maxMarks}</TableCell><TableCell align="right">{((r.marks / r.maxMarks) * 100).toFixed(1)}%</TableCell></TableRow>)}</TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      {step === 2 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#2e7d32', mb: 1 }}>Import Complete!</Typography>
          <Typography variant="body2" color="textSecondary">{preview.length} marks imported successfully.</Typography>
          <Button sx={{ mt: 2 }} onClick={() => { setStep(0); setPreview([]); setTestId(''); }}>Import More</Button>
        </Paper>
      )}
    </Box>
  );
}