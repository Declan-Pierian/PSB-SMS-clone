import React, { useState } from 'react';
import { Box, Paper, TextField, MenuItem, Typography, Card, CardContent, Chip, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import PageHeader from '../../../components/common/PageHeader';
import StatusChip from '../../../components/common/StatusChip';
import storageService from '../../../services/storageService';

export default function ProgramView() {
  const [selected, setSelected] = useState('');
  const programs = storageService.getAll('programs');
  const modules = storageService.getAll('modules');
  const cohorts = storageService.getAll('cohorts');

  const program = programs.find(p => p.id === selected);
  const programModules = modules.filter(m => m.course === program?.name || m.programId === selected);
  const programCohorts = cohorts.filter(c => c.program === program?.name || c.programId === selected);

  return (
    <Box>
      <PageHeader title="Program View" breadcrumbs={[{ label: 'Masters' }, { label: 'Program View' }]} />
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField select label="Select Program" value={selected} onChange={(e) => setSelected(e.target.value)} size="small" sx={{ width: 400 }}>
          <MenuItem value="">-- Select --</MenuItem>
          {programs.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
        </TextField>
      </Paper>
      {program && (
        <Grid container spacing={3}>
          <Grid size={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{program.name}</Typography>
                <Grid container spacing={2}>
                  {[
                    ['Code', program.code], ['Type', program.type], ['Duration', program.duration],
                    ['Fees', program.fees ? `$${program.fees}` : 'N/A'], ['School', program.school], ['Status', program.status],
                  ].map(([label, val]) => (
                    <Grid size={{ xs: 6, md: 4 }} key={label}>
                      <Typography variant="caption" color="textSecondary">{label}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{val || 'N/A'}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Modules ({programModules.length})</Typography>
              {programModules.length > 0 ? programModules.map(m => (
                <Box key={m.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
                  <Box><Typography variant="body2" sx={{ fontWeight: 500 }}>{m.name}</Typography><Typography variant="caption" color="textSecondary">{m.code} · {m.credits} credits</Typography></Box>
                  <StatusChip status={m.status || 'Active'} />
                </Box>
              )) : <Typography variant="body2" color="textSecondary">No modules found</Typography>}
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Cohorts ({programCohorts.length})</Typography>
              {programCohorts.length > 0 ? programCohorts.map(c => (
                <Box key={c.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #eee' }}>
                  <Box><Typography variant="body2" sx={{ fontWeight: 500 }}>{c.code}</Typography><Typography variant="caption" color="textSecondary">{c.intake} · {c.startDate} to {c.endDate}</Typography></Box>
                  <StatusChip status={c.status || 'Active'} />
                </Box>
              )) : <Typography variant="body2" color="textSecondary">No cohorts found</Typography>}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}