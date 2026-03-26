import React, { useState } from 'react';
import { Box, Paper, TextField, MenuItem, Typography, Card, CardContent, CardActions, Button, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import PageHeader from '../../components/common/PageHeader';
import storageService from '../../services/storageService';
import DescriptionIcon from '@mui/icons-material/Description';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import LinkIcon from '@mui/icons-material/Link';
import ImageIcon from '@mui/icons-material/Image';
import DownloadIcon from '@mui/icons-material/Download';

const typeIcons = { PDF: DescriptionIcon, Video: VideoLibraryIcon, Audio: AudiotrackIcon, Link: LinkIcon, Image: ImageIcon, Document: DescriptionIcon, Presentation: DescriptionIcon };

export default function LearningModule() {
  const [moduleId, setModuleId] = useState('');
  const modules = storageService.getAll('modules');
  const resources = storageService.getAll('study_resources');
  const selected = modules.find(m => m.id === moduleId);
  const moduleResources = resources.filter(r => r.module === selected?.name && r.status === 'Published');

  return (
    <Box>
      <PageHeader title="Learning Module" breadcrumbs={[{ label: 'Academics' }, { label: 'Learning Module' }]} />
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField select label="Select Module" value={moduleId} onChange={(e) => setModuleId(e.target.value)} size="small" sx={{ width: 400 }}>
          <MenuItem value="">-- Select Module --</MenuItem>
          {modules.map(m => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
        </TextField>
      </Paper>
      {selected && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>{selected.name} - Resources</Typography>
          {moduleResources.length > 0 ? (
            <Grid container spacing={2}>
              {moduleResources.map(r => {
                const IconComp = typeIcons[r.type] || DescriptionIcon;
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={r.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <IconComp sx={{ color: '#b30537' }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{r.title}</Typography>
                        </Box>
                        <Chip label={r.type} size="small" sx={{ mb: 1 }} />
                        <Typography variant="body2" color="textSecondary">{r.description || 'No description'}</Typography>
                      </CardContent>
                      <CardActions><Button size="small" startIcon={<DownloadIcon />}>Download</Button></CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : <Typography variant="body2" color="textSecondary">No published resources for this module.</Typography>}
        </Box>
      )}
    </Box>
  );
}