import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Divider,
  InputAdornment,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import { COUNTRIES } from '../../data/constants';

const breadcrumbs = [
  { label: 'Agent Management', path: '/agents' },
  { label: 'New Contract' },
];

const steps = ['Select Agent', 'Contract Details', 'Review & Submit'];

export default function AgentContract() {
  const { enqueueSnackbar } = useSnackbar();
  const [activeStep, setActiveStep] = useState(0);

  // Step 1 - Agent Selection
  const [agentSearch, setAgentSearch] = useState('');
  const [selectedAgent, setSelectedAgent] = useState(null);

  // Step 2 - Contract Details
  const [contractDetails, setContractDetails] = useState({
    startDate: '',
    endDate: '',
    commissionRate: '',
    territory: '',
    terms: '',
  });

  // Computed agent search results
  const agentResults = useMemo(() => {
    const agents = storageService.getAll('agents');
    if (!agentSearch.trim()) return agents;
    const q = agentSearch.toLowerCase();
    return agents.filter(
      (a) =>
        (a.name || '').toLowerCase().includes(q) ||
        (a.company || '').toLowerCase().includes(q) ||
        (a.agentId || '').toLowerCase().includes(q)
    );
  }, [agentSearch]);

  const agentColumns = [
    { field: 'agentId', headerName: 'Agent ID', flex: 0.8, minWidth: 100 },
    { field: 'name', headerName: 'Name', flex: 1.2, minWidth: 150 },
    { field: 'company', headerName: 'Company', flex: 1.2, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1.2, minWidth: 180 },
    { field: 'region', headerName: 'Region', flex: 0.8, minWidth: 110 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
  ];

  const handleDetailChange = useCallback((field, value) => {
    setContractDetails((prev) => ({ ...prev, [field]: value }));
  }, []);

  const canProceedStep1 = selectedAgent !== null;
  const canProceedStep2 =
    contractDetails.startDate &&
    contractDetails.endDate &&
    contractDetails.commissionRate &&
    contractDetails.territory;

  const handleNext = useCallback(() => {
    if (activeStep === 0 && !canProceedStep1) {
      enqueueSnackbar('Please select an agent to proceed', { variant: 'warning' });
      return;
    }
    if (activeStep === 1 && !canProceedStep2) {
      enqueueSnackbar('Please fill all required contract details', { variant: 'warning' });
      return;
    }
    setActiveStep((prev) => prev + 1);
  }, [activeStep, canProceedStep1, canProceedStep2, enqueueSnackbar]);

  const handleBack = useCallback(() => {
    setActiveStep((prev) => prev - 1);
  }, []);

  const handleSubmit = useCallback(() => {
    try {
      const contractId = `CON-${Date.now().toString(36).toUpperCase()}`;
      const contract = {
        contractId,
        agentId: selectedAgent.agentId,
        agentName: selectedAgent.name,
        agentCompany: selectedAgent.company,
        startDate: contractDetails.startDate,
        endDate: contractDetails.endDate,
        commissionRate: contractDetails.commissionRate,
        territory: contractDetails.territory,
        terms: contractDetails.terms,
        status: 'Active',
      };
      storageService.create('contracts', contract);

      // Update agent contract count
      const agents = storageService.getAll('agents');
      const agentRecord = agents.find((a) => a.id === selectedAgent.id);
      if (agentRecord) {
        storageService.update('agents', agentRecord.id, {
          contractCount: (agentRecord.contractCount || 0) + 1,
        });
      }

      enqueueSnackbar('Contract created successfully!', { variant: 'success' });

      // Reset form
      setActiveStep(0);
      setSelectedAgent(null);
      setAgentSearch('');
      setContractDetails({
        startDate: '',
        endDate: '',
        commissionRate: '',
        territory: '',
        terms: '',
      });
    } catch (error) {
      enqueueSnackbar('Failed to create contract. Please try again.', { variant: 'error' });
    }
  }, [selectedAgent, contractDetails, enqueueSnackbar]);

  const renderStep1 = () => (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Search and Select an Agent
      </Typography>
      <TextField
        fullWidth
        size="small"
        placeholder="Search by agent name, company, or ID..."
        value={agentSearch}
        onChange={(e) => setAgentSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      {selectedAgent && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Selected Agent: <strong>{selectedAgent.name}</strong> ({selectedAgent.company}) - {selectedAgent.agentId}
        </Alert>
      )}

      <DataTable
        rows={agentResults}
        columns={agentColumns}
        pageSize={5}
        onRowClick={(params) => setSelectedAgent(params.row)}
        exportFilename="agent-selection"
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
          },
          '& .MuiDataGrid-row.Mui-selected': {
            backgroundColor: 'rgba(179, 5, 55, 0.08) !important',
          },
        }}
      />
    </Box>
  );

  const renderStep2 = () => (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Contract Details for {selectedAgent?.name}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="date"
            label="Start Date"
            value={contractDetails.startDate}
            onChange={(e) => handleDetailChange('startDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="date"
            label="End Date"
            value={contractDetails.endDate}
            onChange={(e) => handleDetailChange('endDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            type="number"
            label="Commission Rate (%)"
            value={contractDetails.commissionRate}
            onChange={(e) => handleDetailChange('commissionRate', e.target.value)}
            required
            size="small"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            select
            fullWidth
            label="Territory"
            value={contractDetails.territory}
            onChange={(e) => handleDetailChange('territory', e.target.value)}
            required
            size="small"
          >
            {COUNTRIES.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Terms & Conditions"
            value={contractDetails.terms}
            onChange={(e) => handleDetailChange('terms', e.target.value)}
            multiline
            rows={4}
            size="small"
            placeholder="Enter contract terms and conditions..."
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderStep3 = () => (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
        Review Contract Details
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, width: 200, color: '#666' }}>Agent Name</TableCell>
              <TableCell>{selectedAgent?.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#666' }}>Company</TableCell>
              <TableCell>{selectedAgent?.company}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#666' }}>Agent ID</TableCell>
              <TableCell>{selectedAgent?.agentId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#666' }}>Region</TableCell>
              <TableCell>{selectedAgent?.region}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 2 }} />

      <TableContainer>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, width: 200, color: '#666' }}>Start Date</TableCell>
              <TableCell>{contractDetails.startDate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#666' }}>End Date</TableCell>
              <TableCell>{contractDetails.endDate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#666' }}>Commission Rate</TableCell>
              <TableCell>{contractDetails.commissionRate}%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#666' }}>Territory</TableCell>
              <TableCell>{contractDetails.territory}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#666' }}>Terms</TableCell>
              <TableCell sx={{ whiteSpace: 'pre-wrap' }}>{contractDetails.terms || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: '#666' }}>Status</TableCell>
              <TableCell>
                <StatusChip status="Active" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box>
      <PageHeader title="New Agent Contract" breadcrumbs={breadcrumbs} />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    '&.Mui-active': { color: '#b30537' },
                    '&.Mui-completed': { color: '#b30537' },
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && renderStep1()}
        {activeStep === 1 && renderStep2()}
        {activeStep === 2 && renderStep3()}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            disabled={activeStep === 0}
            color="inherit"
          >
            Back
          </Button>

          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={handleNext}
              sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon />}
              onClick={handleSubmit}
              sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}
            >
              Create Contract
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
