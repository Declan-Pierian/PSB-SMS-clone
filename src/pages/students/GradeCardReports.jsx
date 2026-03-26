import React, { useState, useMemo } from 'react';
import { Box, Paper, Typography, TextField, MenuItem, Button, Table, TableHead, TableBody, TableRow, TableCell, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid';
import PrintIcon from '@mui/icons-material/Print';
import PageHeader from '../../components/common/PageHeader';
import storageService from '../../services/storageService';

const breadcrumbs = [{ label: 'Student', path: '/students' }, { label: 'Grade Card Reports' }];
const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'D', 'F'];

export default function GradeCardReports() {
  const students = useMemo(() => storageService.getAll('students'), []);
  const modules = useMemo(() => storageService.getAll('modules'), []);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [showCard, setShowCard] = useState(false);

  const student = students.find(s => s.studentCode === selectedStudent);
  const studentModules = student ? modules.filter(m => m.program === student.program) : [];

  const gradeData = studentModules.map((m, i) => ({
    module: m.name, code: m.code, credits: m.credits, grade: grades[i % grades.length],
    gradePoint: Math.max(0, 4.0 - (i % grades.length) * 0.3).toFixed(1),
  }));

  const totalCredits = gradeData.reduce((s, g) => s + (g.credits || 0), 0);
  const gpa = gradeData.length > 0 ? (gradeData.reduce((s, g) => s + parseFloat(g.gradePoint) * g.credits, 0) / totalCredits).toFixed(2) : '0.00';

  return (
    <Box>
      <PageHeader title="Grade Card Reports" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth select label="Select Student" value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} size="small">
              {students.map(s => <MenuItem key={s.studentCode} value={s.studentCode}>{s.studentCode} - {s.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Button variant="contained" onClick={() => setShowCard(true)} disabled={!selectedStudent} sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Generate</Button>
          </Grid>
        </Grid>
      </Paper>

      {showCard && student && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#b30537' }}>PSB Academy</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>Academic Grade Card</Typography>
            </Box>
            <Button startIcon={<PrintIcon />} onClick={() => window.print()}>Print</Button>
          </Box>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 6 }}><Typography variant="body2" color="text.secondary">Student Name</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{student.name}</Typography></Grid>
            <Grid size={{ xs: 6 }}><Typography variant="body2" color="text.secondary">Student Code</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{student.studentCode}</Typography></Grid>
            <Grid size={{ xs: 6 }}><Typography variant="body2" color="text.secondary">Program</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{student.program}</Typography></Grid>
            <Grid size={{ xs: 6 }}><Typography variant="body2" color="text.secondary">Cohort</Typography><Typography variant="body1" sx={{ fontWeight: 600 }}>{student.cohort}</Typography></Grid>
          </Grid>
          <Table size="small" sx={{ mb: 3 }}>
            <TableHead><TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>Module Code</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Module Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Credits</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Grade</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Grade Point</TableCell>
            </TableRow></TableHead>
            <TableBody>
              {gradeData.map((g, i) => (
                <TableRow key={i}><TableCell>{g.code}</TableCell><TableCell>{g.module}</TableCell><TableCell>{g.credits}</TableCell><TableCell>{g.grade}</TableCell><TableCell>{g.gradePoint}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
          <Grid container spacing={2}>
            <Grid size={{ xs: 4 }}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="body2" color="text.secondary">Total Credits</Typography><Typography variant="h5" sx={{ fontWeight: 700 }}>{totalCredits}</Typography></CardContent></Card></Grid>
            <Grid size={{ xs: 4 }}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="body2" color="text.secondary">GPA</Typography><Typography variant="h5" sx={{ fontWeight: 700, color: '#b30537' }}>{gpa}</Typography></CardContent></Card></Grid>
            <Grid size={{ xs: 4 }}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="body2" color="text.secondary">Status</Typography><Typography variant="h5" sx={{ fontWeight: 700, color: parseFloat(gpa) >= 2.0 ? 'green' : 'red' }}>{parseFloat(gpa) >= 2.0 ? 'Pass' : 'Fail'}</Typography></CardContent></Card></Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}