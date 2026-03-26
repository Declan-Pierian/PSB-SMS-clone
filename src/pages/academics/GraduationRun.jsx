import React, { useState, useMemo, useCallback } from 'react';
import {
  Box, Paper, Typography, TextField, Button, MenuItem, Card, CardContent,
  IconButton, Tooltip, Divider, Alert, Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SchoolIcon from '@mui/icons-material/School';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';

const SAMPLE_PROGRAMS = [
  'BSc Computer Science', 'BSc Business Administration', 'Diploma in IT',
  'MBA', 'BSc Electrical Engineering', 'Diploma in Business',
];

const SAMPLE_COHORTS = ['Jan 2024', 'Apr 2024', 'Jul 2024', 'Oct 2024', 'Jan 2025'];

export default function GraduationRun() {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedCohort, setSelectedCohort] = useState('');
  const [eligibleStudents, setEligibleStudents] = useState([]);
  const [graduationHistory, setGraduationHistory] = useState(() => storageService.getAll('graduation_runs'));
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyDetail, setHistoryDetail] = useState(null);

  const handleFetchEligible = useCallback(() => {
    if (!selectedProgram || !selectedCohort) {
      enqueueSnackbar('Please select both program and cohort', { variant: 'warning' });
      return;
    }
    const students = storageService.getAll('students');
    let eligible = students.filter(
      (s) => s.program === selectedProgram && s.cohort === selectedCohort && s.status === 'Active'
    );
    if (eligible.length === 0) {
      eligible = Array.from({ length: 8 }, (_, i) => ({
        id: uuidv4(),
        studentId: `STU-${2024000 + i + 1}`,
        name: ['Alice Tan', 'Bob Lee', 'Charlie Wong', 'Diana Chen', 'Edward Lim', 'Fiona Ng', 'George Ho', 'Hannah Ong'][i],
        program: selectedProgram,
        cohort: selectedCohort,
        gpa: (2.5 + Math.random() * 1.8).toFixed(2),
        creditsCompleted: [120, 118, 120, 115, 120, 120, 110, 120][i],
        creditsRequired: 120,
        status: 'Active',
      }));
    }
    eligible = eligible.map((s) => ({
      ...s,
      gpa: s.gpa || (2.5 + Math.random() * 1.8).toFixed(2),
      creditsCompleted: s.creditsCompleted || Math.floor(100 + Math.random() * 25),
      creditsRequired: s.creditsRequired || 120,
      graduationEligible: (s.creditsCompleted || 120) >= (s.creditsRequired || 120) && parseFloat(s.gpa || '3.0') >= 2.0,
    }));
    setEligibleStudents(eligible);
    enqueueSnackbar(`Found ${eligible.length} students for ${selectedProgram} - ${selectedCohort}`, { variant: 'success' });
  }, [selectedProgram, selectedCohort, enqueueSnackbar]);

  const handleRunGraduation = useCallback(() => {
    const toGraduate = eligibleStudents.filter((s) => s.graduationEligible && selectedStudents.includes(s.id));
    if (toGraduate.length === 0) {
      enqueueSnackbar('No eligible students selected for graduation', { variant: 'warning' });
      return;
    }
    setConfirmOpen(true);
  }, [eligibleStudents, selectedStudents, enqueueSnackbar]);

  const handleConfirmGraduation = useCallback(() => {
    const toGraduate = eligibleStudents.filter((s) => s.graduationEligible && selectedStudents.includes(s.id));
    const graduationDate = new Date().toISOString().split('T')[0];

    toGraduate.forEach((student) => {
      storageService.update('students', student.id, {
        status: 'Graduated',
        graduationDate,
      });
    });

    const run = {
      id: uuidv4(),
      program: selectedProgram,
      cohort: selectedCohort,
      runDate: new Date().toISOString(),
      graduatedCount: toGraduate.length,
      totalEligible: eligibleStudents.filter((s) => s.graduationEligible).length,
      totalStudents: eligibleStudents.length,
      status: 'Completed',
      students: toGraduate.map((s) => ({
        studentId: s.studentId,
        name: s.name,
        gpa: s.gpa,
        graduationDate,
      })),
    };
    storageService.create('graduation_runs', run);

    setEligibleStudents((prev) =>
      prev.map((s) =>
        selectedStudents.includes(s.id) && s.graduationEligible
          ? { ...s, status: 'Graduated', graduationDate }
          : s
      )
    );
    setGraduationHistory(storageService.getAll('graduation_runs'));
    setConfirmOpen(false);
    setSelectedStudents([]);
    enqueueSnackbar(`Successfully graduated ${toGraduate.length} students`, { variant: 'success' });
  }, [eligibleStudents, selectedStudents, selectedProgram, selectedCohort, enqueueSnackbar]);

  const studentColumns = useMemo(() => [
    { field: 'studentId', headerName: 'Student ID', width: 130 },
    { field: 'name', headerName: 'Student Name', width: 180 },
    { field: 'program', headerName: 'Program', width: 200 },
    {
      field: 'gpa',
      headerName: 'GPA',
      width: 100,
      renderCell: (params) => (
        <Typography sx={{ fontWeight: 600, color: parseFloat(params.value) >= 2.0 ? '#2e7d32' : '#c62828', fontSize: '0.83rem' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'creditsCompleted',
      headerName: 'Credits',
      width: 120,
      renderCell: (params) => `${params.value}/${params.row.creditsRequired}`,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'graduationEligible',
      headerName: 'Eligible',
      width: 100,
      renderCell: (params) =>
        params.value ? (
          <CheckCircleIcon sx={{ color: '#2e7d32' }} />
        ) : (
          <CancelIcon sx={{ color: '#c62828' }} />
        ),
    },
    { field: 'graduationDate', headerName: 'Graduation Date', width: 140 },
  ], []);

  const historyColumns = useMemo(() => [
    { field: 'program', headerName: 'Program', width: 200 },
    { field: 'cohort', headerName: 'Cohort', width: 120 },
    {
      field: 'runDate',
      headerName: 'Run Date',
      width: 160,
      renderCell: (params) => new Date(params.value).toLocaleString(),
    },
    { field: 'graduatedCount', headerName: 'Graduated', width: 110 },
    { field: 'totalStudents', headerName: 'Total Students', width: 130 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title="View Details">
          <IconButton size="small" onClick={() => setHistoryDetail(params.row)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ], []);

  const summaryStats = useMemo(() => {
    const eligible = eligibleStudents.filter((s) => s.graduationEligible).length;
    const notEligible = eligibleStudents.length - eligible;
    const avgGpa = eligibleStudents.length
      ? (eligibleStudents.reduce((sum, s) => sum + parseFloat(s.gpa || 0), 0) / eligibleStudents.length).toFixed(2)
      : '0.00';
    return { total: eligibleStudents.length, eligible, notEligible, avgGpa };
  }, [eligibleStudents]);

  return (
    <Box>
      <PageHeader
        title="Graduation Run"
        breadcrumbs={[
          { label: 'Academics', path: '/academics' },
          { label: 'Graduation Run' },
        ]}
        actionLabel={showHistory ? 'Back to Graduation' : 'View History'}
        actionIcon={showHistory ? <SchoolIcon /> : <HistoryIcon />}
        onAction={() => setShowHistory(!showHistory)}
      />

      {!showHistory ? (
        <>
          <Paper sx={{ p: 2.5, mb: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Select Program & Cohort
            </Typography>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Program"
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                >
                  {SAMPLE_PROGRAMS.map((p) => (
                    <MenuItem key={p} value={p}>{p}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Cohort"
                  value={selectedCohort}
                  onChange={(e) => setSelectedCohort(e.target.value)}
                >
                  {SAMPLE_COHORTS.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 'auto' }}>
                <Button
                  variant="contained"
                  startIcon={<SchoolIcon />}
                  onClick={handleFetchEligible}
                  sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}
                >
                  Fetch Students
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {eligibleStudents.length > 0 && (
            <>
              <Grid container spacing={2} sx={{ mb: 2.5 }}>
                {[
                  { label: 'Total Students', value: summaryStats.total, color: '#1565c0' },
                  { label: 'Eligible', value: summaryStats.eligible, color: '#2e7d32' },
                  { label: 'Not Eligible', value: summaryStats.notEligible, color: '#c62828' },
                  { label: 'Avg GPA', value: summaryStats.avgGpa, color: '#7b1fa2' },
                ].map((stat) => (
                  <Grid size={{ xs: 6, sm: 3 }} key={stat.label}>
                    <Card>
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">{stat.label}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Student List
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  onClick={handleRunGraduation}
                  disabled={selectedStudents.length === 0}
                  sx={{ backgroundColor: '#2e7d32', '&:hover': { backgroundColor: '#1b5e20' } }}
                >
                  Run Graduation ({selectedStudents.length} selected)
                </Button>
              </Box>

              <DataTable
                rows={eligibleStudents}
                columns={studentColumns}
                pageSize={10}
                exportFilename="graduation_eligible"
                checkboxSelection
                onSelectionChange={(ids) => setSelectedStudents(ids)}
              />
            </>
          )}
        </>
      ) : (
        <>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            Graduation History
          </Typography>
          <DataTable
            rows={graduationHistory}
            columns={historyColumns}
            pageSize={10}
            exportFilename="graduation_history"
          />

          {historyDetail && (
            <Paper sx={{ p: 2.5, mt: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Run Details - {historyDetail.program} ({historyDetail.cohort})
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="caption" color="textSecondary">Run Date</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {new Date(historyDetail.runDate).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="caption" color="textSecondary">Graduated</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{historyDetail.graduatedCount}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="caption" color="textSecondary">Total Students</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{historyDetail.totalStudents}</Typography>
                </Grid>
              </Grid>
              {historyDetail.students && historyDetail.students.length > 0 && (
                <DataTable
                  rows={historyDetail.students.map((s, i) => ({ ...s, id: i }))}
                  columns={[
                    { field: 'studentId', headerName: 'Student ID', width: 140 },
                    { field: 'name', headerName: 'Name', width: 200 },
                    { field: 'gpa', headerName: 'GPA', width: 100 },
                    { field: 'graduationDate', headerName: 'Graduation Date', width: 140 },
                  ]}
                  pageSize={10}
                />
              )}
              <Button sx={{ mt: 2 }} onClick={() => setHistoryDetail(null)} color="inherit">
                Close Details
              </Button>
            </Paper>
          )}
        </>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm Graduation Run"
        message={`Are you sure you want to graduate ${selectedStudents.filter((id) => eligibleStudents.find((s) => s.id === id)?.graduationEligible).length} eligible students from ${selectedProgram} (${selectedCohort})?`}
        onConfirm={handleConfirmGraduation}
        onCancel={() => setConfirmOpen(false)}
        confirmLabel="Run Graduation"
        severity="success"
      />
    </Box>
  );
}
