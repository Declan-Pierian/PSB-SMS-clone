import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Avatar, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import FileUpload from '../../components/common/FileUpload';
import storageService from '../../services/storageService';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';

export default function StudentPhotoUpload() {
  const [searchId, setSearchId] = useState('');
  const [student, setStudent] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleSearch = () => {
    const students = storageService.getAll('students');
    const found = students.find(s => s.studentId === searchId || s.name?.toLowerCase().includes(searchId.toLowerCase()));
    if (found) { setStudent(found); setPhotoUrl(found.photoUrl || ''); }
    else { setStudent(null); enqueueSnackbar('Student not found', { variant: 'error' }); }
  };

  const handleFiles = (files) => {
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setPhotoUrl(url);
    }
  };

  const handleSave = () => {
    if (student) {
      storageService.update('students', student.id, { photoUrl: photoUrl || 'uploaded' });
      enqueueSnackbar('Photo updated successfully', { variant: 'success' });
    }
  };

  return (
    <Box>
      <PageHeader title="Student Photo Upload" breadcrumbs={[{ label: 'Student' }, { label: 'Photo Upload' }]} />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          <TextField label="Student ID or Name" value={searchId} onChange={(e) => setSearchId(e.target.value)} size="small" sx={{ width: 300 }} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
          <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch} sx={{ backgroundColor: '#b30537' }}>Search</Button>
        </Box>
      </Paper>
      {student && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: '#b30537', fontSize: 48 }}>
                  {photoUrl ? <img src={photoUrl} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <PersonIcon sx={{ fontSize: 60 }} />}
                </Avatar>
                <Typography variant="h6">{student.name}</Typography>
                <Typography variant="body2" color="textSecondary">{student.studentId}</Typography>
                <Typography variant="body2" color="textSecondary">{student.program}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Upload Photo</Typography>
              <FileUpload onFilesChange={handleFiles} accept="image/*" maxSize={2} label="Upload student photo (max 2MB)" />
              <Button variant="contained" onClick={handleSave} sx={{ mt: 2, backgroundColor: '#b30537' }}>Save Photo</Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}