import React, { useState } from 'react';
import { Box, Paper, Typography, Avatar, TextField, Button, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import { useAuth } from '../../contexts/AuthContext';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

export default function MyProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.username + '@psbacademy.edu.sg',
    phone: '+65 9123 4567',
    department: 'Administration',
    role: user?.role || 'Admin',
    lastLogin: new Date().toLocaleString(),
  });
  const { enqueueSnackbar } = useSnackbar();

  const handleSave = () => {
    setEditing(false);
    enqueueSnackbar('Profile updated successfully', { variant: 'success' });
  };

  return (
    <Box>
      <PageHeader title="My Profile" breadcrumbs={[{ label: 'Profile' }]} />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Avatar sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: '#b30537', fontSize: 40 }}>
              <PersonIcon sx={{ fontSize: 50 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{profile.name}</Typography>
            <Typography variant="body2" color="textSecondary">{profile.role}</Typography>
            <Typography variant="body2" color="textSecondary">{profile.department}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="textSecondary">Last Login: {profile.lastLogin}</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Personal Information</Typography>
              <Button startIcon={editing ? <SaveIcon /> : <EditIcon />} onClick={editing ? handleSave : () => setEditing(true)} variant={editing ? 'contained' : 'outlined'} sx={editing ? { backgroundColor: '#b30537' } : {}}>
                {editing ? 'Save' : 'Edit'}
              </Button>
            </Box>
            <Grid container spacing={2}>
              {[
                { label: 'Full Name', key: 'name' },
                { label: 'Email', key: 'email' },
                { label: 'Phone', key: 'phone' },
                { label: 'Department', key: 'department' },
                { label: 'Role', key: 'role', disabled: true },
              ].map((f) => (
                <Grid size={{ xs: 12, sm: 6 }} key={f.key}>
                  <TextField
                    fullWidth label={f.label}
                    value={profile[f.key]}
                    onChange={(e) => setProfile({ ...profile, [f.key]: e.target.value })}
                    disabled={!editing || f.disabled}
                    size="small"
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}