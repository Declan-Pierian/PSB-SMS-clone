import React from 'react';
import { Box, Paper, Typography, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EventIcon from '@mui/icons-material/Event';
import { useAuth } from '../../contexts/AuthContext';
import StickyNotes from '../../components/dashboard/StickyNotes';
import storageService from '../../services/storageService';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          width: 48, height: 48, borderRadius: '12px',
          backgroundColor: `${color}15`, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon sx={{ color, fontSize: 28 }} />
      </Box>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color }}>{value}</Typography>
        <Typography variant="body2" color="textSecondary">{label}</Typography>
      </Box>
    </CardContent>
  </Card>
);

export default function Home() {
  const { user } = useAuth();
  const students = storageService.getAll('students');
  const programs = storageService.getAll('programs');
  const invoices = storageService.getAll('invoices');
  const employees = storageService.getAll('employees');

  const stats = [
    { icon: PeopleIcon, label: 'Total Students', value: students.length, color: '#b30537' },
    { icon: SchoolIcon, label: 'Active Programs', value: programs.length, color: '#2B4D83' },
    { icon: ReceiptIcon, label: 'Total Invoices', value: invoices.length, color: '#ed6c02' },
    { icon: EventIcon, label: 'Employees', value: employees.length, color: '#2e7d32' },
  ];

  return (
    <Box>
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #b30537 0%, #800025 100%)',
          color: '#fff',
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Welcome back, {user?.name || 'User'}!
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
          PSB Academy Student Management System — Dashboard
        </Typography>
      </Paper>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {stats.map((stat, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <StickyNotes />
    </Box>
  );
}
