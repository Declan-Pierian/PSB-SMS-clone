import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import { MESSAGE_CHANNELS, MESSAGE_STATUSES } from '../../data/constants';

export default function MessageOutbox() {
  const [data, setData] = useState([]);
  const [viewMsg, setViewMsg] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => { setData(storageService.getAll('messages')); }, []);
  const refresh = () => setData(storageService.getAll('messages'));

  const searchFields = [
    { name: 'recipient', label: 'Recipient' },
    { name: 'channel', label: 'Channel', type: 'select', options: MESSAGE_CHANNELS },
    { name: 'status', label: 'Status', type: 'select', options: MESSAGE_STATUSES },
  ];

  const columns = [
    { field: 'id', headerName: 'Message ID', width: 120 },
    { field: 'recipient', headerName: 'Recipient', flex: 1 },
    { field: 'channel', headerName: 'Channel', width: 120 },
    { field: 'subject', headerName: 'Subject', flex: 1 },
    { field: 'status', headerName: 'Status', width: 110, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'sentDate', headerName: 'Sent Date', width: 140 },
    {
      field: 'actions', headerName: 'Actions', width: 160, sortable: false,
      renderCell: (p) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button size="small" onClick={() => setViewMsg(p.row)}>View</Button>
          {p.row.status === 'Failed' && <Button size="small" color="warning" onClick={() => { storageService.update('messages', p.row.id, { status: 'Sent', sentDate: new Date().toISOString() }); refresh(); enqueueSnackbar('Message resent', { variant: 'success' }); }}>Resend</Button>}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader title="Message Outbox" breadcrumbs={[{ label: 'System' }, { label: 'Message Outbox' }]} />
      <SearchForm fields={searchFields} onSearch={(f) => setData(storageService.search('messages', f))} onReset={refresh} />
      <DataTable rows={data} columns={columns} exportFilename="message-outbox" />
      <Dialog open={!!viewMsg} onClose={() => setViewMsg(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Message Details</DialogTitle>
        <DialogContent>
          {viewMsg && (<Box>
            <Typography variant="body2"><b>To:</b> {viewMsg.recipient}</Typography>
            <Typography variant="body2"><b>Channel:</b> {viewMsg.channel}</Typography>
            <Typography variant="body2"><b>Subject:</b> {viewMsg.subject}</Typography>
            <Typography variant="body2"><b>Status:</b> {viewMsg.status}</Typography>
            <Typography variant="body2"><b>Sent:</b> {viewMsg.sentDate}</Typography>
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, whiteSpace: 'pre-wrap' }}>{viewMsg.body || 'No body content'}</Box>
          </Box>)}
        </DialogContent>
      </Dialog>
    </Box>
  );
}