import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Card, CardContent, Button, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';

const LIFECYCLE_COLUMNS = ['Pending', 'Received', 'Verified', 'Rejected'];
const COLUMN_COLORS = { Pending: '#fff8e1', Received: '#e3f2fd', Verified: '#e8f5e9', Rejected: '#fce4ec' };

export default function DocumentLifecycle() {
  const [docs, setDocs] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setDocs(storageService.getAll('documents')); }, []);
  const refresh = () => setDocs(storageService.getAll('documents'));

  const moveDoc = (doc, newStatus) => {
    storageService.update('documents', doc.id, { status: newStatus });
    refresh();
    enqueueSnackbar(`Document moved to ${newStatus}`, { variant: 'success' });
  };

  const getNextStatuses = (current) => {
    const map = { Pending: ['Received'], Received: ['Verified', 'Rejected'], Verified: [], Rejected: ['Pending'] };
    return map[current] || [];
  };

  return (
    <Box>
      <PageHeader title="Document Lifecycle Management" breadcrumbs={[{ label: 'Student' }, { label: 'Document Lifecycle' }]} />
      <Grid container spacing={2}>
        {LIFECYCLE_COLUMNS.map((status) => {
          const columnDocs = docs.filter((d) => d.status === status);
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={status}>
              <Paper sx={{ p: 2, minHeight: 400, backgroundColor: COLUMN_COLORS[status] + '80', borderTop: `3px solid ${COLUMN_COLORS[status] === '#e8f5e9' ? '#2e7d32' : COLUMN_COLORS[status] === '#fce4ec' ? '#c62828' : COLUMN_COLORS[status] === '#e3f2fd' ? '#1565c0' : '#f9a825'}` }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{status}</Typography>
                  <Chip label={columnDocs.length} size="small" />
                </Box>
                {columnDocs.map((doc) => (
                  <Card key={doc.id} sx={{ mb: 1.5, cursor: 'pointer' }}>
                    <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{doc.documentType}</Typography>
                      <Typography variant="caption" color="textSecondary">{doc.studentName}</Typography>
                      {doc.fileName && <Typography variant="caption" display="block" color="textSecondary">{doc.fileName}</Typography>}
                      <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {getNextStatuses(status).map((next) => (
                          <Button key={next} size="small" variant="outlined" sx={{ fontSize: '0.7rem', py: 0, minHeight: 24 }} onClick={() => moveDoc(doc, next)}>
                            → {next}
                          </Button>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
                {columnDocs.length === 0 && <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 4 }}>No documents</Typography>}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}