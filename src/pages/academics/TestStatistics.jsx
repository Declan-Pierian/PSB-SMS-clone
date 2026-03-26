import React, { useState, useMemo, useCallback } from 'react';
import {
  Box, Paper, Typography, TextField, MenuItem, Card, CardContent, Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';

export default function TestStatistics() {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedTestId, setSelectedTestId] = useState('');
  const [stats, setStats] = useState(null);
  const [studentScores, setStudentScores] = useState([]);

  const tests = useMemo(() => storageService.getAll('tests'), []);

  const handleTestSelect = useCallback((testId) => {
    setSelectedTestId(testId);
    if (!testId) {
      setStats(null);
      setStudentScores([]);
      return;
    }
    const test = storageService.getById('tests', testId);
    if (!test) {
      enqueueSnackbar('Test not found', { variant: 'error' });
      return;
    }
    let scores = storageService.getAll('test_scores').filter((s) => s.testId === testId);
    if (scores.length === 0) {
      const maxMarks = parseFloat(test.maxMarks) || 100;
      const passMarks = parseFloat(test.passMarks) || 50;
      scores = Array.from({ length: 25 }, (_, i) => ({
        id: `score-${i}`,
        testId,
        studentId: `STU-${2024000 + i + 1}`,
        studentName: [
          'Alice Tan', 'Bob Lee', 'Charlie Wong', 'Diana Chen', 'Edward Lim',
          'Fiona Ng', 'George Ho', 'Hannah Ong', 'Ian Koh', 'Jane Teo',
          'Kevin Lim', 'Lisa Ng', 'Michael Tan', 'Nancy Ong', 'Oliver Ho',
          'Patricia Lee', 'Quincy Wong', 'Rachel Chen', 'Samuel Toh', 'Tiffany Goh',
          'Uma Krishnan', 'Victor Lim', 'Wendy Tan', 'Xavier Ong', 'Yvonne Chan',
        ][i],
        marks: Math.floor(Math.random() * (maxMarks * 0.6) + maxMarks * 0.3),
        maxMarks,
        passMarks,
        status: 'Graded',
      }));
    }

    const marks = scores.map((s) => parseFloat(s.marks) || 0);
    const maxMarks = parseFloat(test.maxMarks) || 100;
    const passMarks = parseFloat(test.passMarks) || 50;
    const sorted = [...marks].sort((a, b) => a - b);
    const total = marks.reduce((sum, m) => sum + m, 0);
    const avg = marks.length > 0 ? total / marks.length : 0;
    const highest = marks.length > 0 ? Math.max(...marks) : 0;
    const lowest = marks.length > 0 ? Math.min(...marks) : 0;
    const median = marks.length > 0
      ? marks.length % 2 === 0
        ? (sorted[marks.length / 2 - 1] + sorted[marks.length / 2]) / 2
        : sorted[Math.floor(marks.length / 2)]
      : 0;
    const passed = marks.filter((m) => m >= passMarks).length;
    const passRate = marks.length > 0 ? (passed / marks.length) * 100 : 0;

    const rangeBuckets = [
      { label: '0-20%', min: 0, max: maxMarks * 0.2, count: 0 },
      { label: '21-40%', min: maxMarks * 0.2 + 1, max: maxMarks * 0.4, count: 0 },
      { label: '41-60%', min: maxMarks * 0.4 + 1, max: maxMarks * 0.6, count: 0 },
      { label: '61-80%', min: maxMarks * 0.6 + 1, max: maxMarks * 0.8, count: 0 },
      { label: '81-100%', min: maxMarks * 0.8 + 1, max: maxMarks, count: 0 },
    ];
    marks.forEach((m) => {
      for (const bucket of rangeBuckets) {
        if (m >= bucket.min && m <= bucket.max) {
          bucket.count++;
          break;
        }
      }
    });

    setStats({
      testName: test.name,
      module: test.module,
      category: test.category,
      maxMarks,
      passMarks,
      totalStudents: marks.length,
      avgScore: avg.toFixed(1),
      highest: highest.toFixed(1),
      lowest: lowest.toFixed(1),
      median: median.toFixed(1),
      passRate: passRate.toFixed(1),
      passed,
      failed: marks.length - passed,
      rangeBuckets,
    });

    setStudentScores(scores.map((s) => ({
      ...s,
      percentage: ((parseFloat(s.marks) / maxMarks) * 100).toFixed(1),
      result: parseFloat(s.marks) >= passMarks ? 'Pass' : 'Fail',
    })));

    enqueueSnackbar(`Statistics loaded for "${test.name}"`, { variant: 'success' });
  }, [enqueueSnackbar]);

  const scoreColumns = useMemo(() => [
    { field: 'studentId', headerName: 'Student ID', width: 130 },
    { field: 'studentName', headerName: 'Student Name', width: 180 },
    {
      field: 'marks',
      headerName: 'Marks',
      width: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '0.83rem',
            color: parseFloat(params.value) >= (stats?.passMarks || 50) ? '#2e7d32' : '#c62828',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    { field: 'maxMarks', headerName: 'Max Marks', width: 100 },
    { field: 'percentage', headerName: 'Percentage', width: 110, renderCell: (params) => `${params.value}%` },
    {
      field: 'result',
      headerName: 'Result',
      width: 100,
      renderCell: (params) => (
        <StatusChip status={params.value === 'Pass' ? 'Approved' : 'Rejected'} />
      ),
    },
  ], [stats]);

  const maxBucketCount = useMemo(
    () => (stats ? Math.max(...stats.rangeBuckets.map((b) => b.count), 1) : 1),
    [stats]
  );

  return (
    <Box>
      <PageHeader
        title="Test Statistics"
        breadcrumbs={[
          { label: 'Academics', path: '/academics' },
          { label: 'Test Statistics' },
        ]}
      />

      <Paper sx={{ p: 2.5, mb: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
          Select Test
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              select
              fullWidth
              size="small"
              label="Test"
              value={selectedTestId}
              onChange={(e) => handleTestSelect(e.target.value)}
            >
              <MenuItem value="">-- Select Test --</MenuItem>
              {tests.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name} ({t.module} - {t.category})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {stats && (
        <>
          <Grid container spacing={2} sx={{ mb: 2.5 }}>
            {[
              { label: 'Average Score', value: stats.avgScore, icon: <BarChartIcon />, color: '#1565c0' },
              { label: 'Highest Score', value: stats.highest, icon: <TrendingUpIcon />, color: '#2e7d32' },
              { label: 'Lowest Score', value: stats.lowest, icon: <TrendingUpIcon sx={{ transform: 'scaleY(-1)' }} />, color: '#c62828' },
              { label: 'Pass Rate', value: `${stats.passRate}%`, icon: <PeopleIcon />, color: '#7b1fa2' },
              { label: 'Median', value: stats.median, icon: <BarChartIcon />, color: '#e65100' },
              { label: 'Total Students', value: stats.totalStudents, icon: <PeopleIcon />, color: '#00695c' },
            ].map((stat) => (
              <Grid size={{ xs: 6, sm: 4, md: 2 }} key={stat.label}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Box sx={{ color: stat.color, mb: 0.5 }}>{stat.icon}</Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">{stat.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Paper sx={{ p: 2.5, mb: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Score Distribution
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 200, px: 2 }}>
              {stats.rangeBuckets.map((bucket) => (
                <Box key={bucket.label} sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {bucket.count}
                  </Typography>
                  <Box
                    sx={{
                      height: `${(bucket.count / maxBucketCount) * 160}px`,
                      minHeight: 4,
                      backgroundColor: '#b30537',
                      borderRadius: '4px 4px 0 0',
                      mx: 'auto',
                      width: '60%',
                      transition: 'height 0.3s ease',
                    }}
                  />
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                    {bucket.label}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="textSecondary">Passed</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                  {stats.passed} students
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="textSecondary">Failed</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#c62828' }}>
                  {stats.failed} students
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="textSecondary">Max Marks</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{stats.maxMarks}</Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography variant="caption" color="textSecondary">Pass Marks</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{stats.passMarks}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            Student Scores
          </Typography>
          <DataTable
            rows={studentScores}
            columns={scoreColumns}
            pageSize={10}
            exportFilename="test_statistics"
          />
        </>
      )}
    </Box>
  );
}
