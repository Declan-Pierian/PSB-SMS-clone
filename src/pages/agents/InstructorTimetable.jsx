import React, { useState, useMemo } from 'react';
import { Box, Paper, TextField, MenuItem, Typography, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import PageHeader from '../../components/common/PageHeader';
import storageService from '../../services/storageService';

const breadcrumbs = [{ label: 'Agent Management', path: '/agents' }, { label: 'Instructor Time Table' }];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SLOTS = ['09:00 - 12:00', '12:00 - 13:00', '14:00 - 17:00', '18:00 - 21:00'];

export default function InstructorTimetable() {
  const employees = useMemo(() => storageService.getAll('employees').filter(e => e.type === 'Teaching'), []);
  const timetable = useMemo(() => storageService.getAll('timetable'), []);
  const [instructor, setInstructor] = useState('');

  const filtered = timetable.filter(t => t.instructor === instructor);

  return (
    <Box>
      <PageHeader title="Instructor Time Table" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField select fullWidth label="Select Instructor" value={instructor} onChange={e => setInstructor(e.target.value)} size="small" sx={{ maxWidth: 400 }}>
          {employees.map(e => <MenuItem key={e.name} value={e.name}>{e.name}</MenuItem>)}
        </TextField>
      </Paper>
      {instructor && (
        <Paper sx={{ p: 2 }}>
          <Table size="small">
            <TableHead><TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>Time Slot</TableCell>
              {DAYS.map(d => <TableCell key={d} sx={{ fontWeight: 600 }}>{d}</TableCell>)}
            </TableRow></TableHead>
            <TableBody>
              {SLOTS.map(slot => (
                <TableRow key={slot}>
                  <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{slot}</TableCell>
                  {DAYS.map(day => {
                    const entry = filtered.find(t => t.day === day && t.time === slot);
                    return <TableCell key={day} sx={{ backgroundColor: entry ? '#e8f5e9' : 'transparent', fontSize: '0.8rem' }}>
                      {entry ? <>{entry.moduleName}<br/><Typography variant="caption" color="text.secondary">{entry.room}</Typography></> : '-'}
                    </TableCell>;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
