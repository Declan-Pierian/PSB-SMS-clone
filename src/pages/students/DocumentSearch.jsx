import { useState, useMemo } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Chip,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  TextField,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import VerifiedIcon from '@mui/icons-material/Verified';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusChip from '../../components/common/StatusChip';
import useSearch from '../../hooks/useSearch';
import storageService from '../../services/storageService';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../contexts/AuthContext';
import {
  COUNTRIES,
  ENQUIRY_STAGES,
  DOCUMENT_STATUSES,
  SORT_BY_OPTIONS,
  ACADEMIC_YEARS,
} from '../../data/constants';

// --- Constants for this view ---

const BU_OPTIONS = ['SET', 'SBM'];

const SEARCH_FOR_OPTIONS = [
  'All',
  'Documents Pending',
  'Documents Complete',
  'Application Fee Pending',
];

const ADMISSION_TYPE_OPTIONS = ['Direct', 'Agent', 'Transfer'];

const SEARCH_DOCUMENTS_OPTIONS = [
  'All Documents',
  'Missing Documents',
  'Uploaded Only',
];

const APPLICATION_FEE_OPTIONS = ['All', 'Paid', 'Unpaid'];

// Document indicator column keys and labels
const DOC_INDICATOR_KEYS = [
  { key: 'level1', label: 'Level1' },
  { key: 'level2', label: 'Level2' },
  { key: 'level3', label: 'Level3' },
  { key: 'level4', label: 'Level4' },
  { key: 'level5', label: 'Level5' },
  { key: 'docId', label: 'ID' },
  { key: 'english', label: 'English' },
  { key: 'nationalId', label: 'National ID' },
  { key: 'ipa', label: 'IPA' },
  { key: 'stp', label: 'STP' },
  { key: 'sop1', label: 'SOP1' },
  { key: 'sop2', label: 'SOP2' },
  { key: 'we1', label: 'WE1' },
  { key: 'we2', label: 'WE2' },
  { key: 'others', label: 'Others' },
  { key: 'paymentProof', label: 'Payment Proof' },
];

// Generate mock document indicators for a student row
function generateDocIndicators(row) {
  const indicators = {};
  const seed = row.id ? row.id.charCodeAt(0) + (row.id.charCodeAt(1) || 0) : 0;
  DOC_INDICATOR_KEYS.forEach((doc, idx) => {
    // Deterministic pseudo-random based on row id and index
    indicators[doc.key] = ((seed + idx * 7) % 3) !== 0; // ~66% true
  });
  return indicators;
}

// Count how many docs are complete for a row
function countDocsComplete(indicators) {
  return DOC_INDICATOR_KEYS.filter((d) => indicators[d.key]).length;
}

function isDocsComplete(indicators) {
  return DOC_INDICATOR_KEYS.every((d) => indicators[d.key]);
}

export default function DocumentSearch() {
  const { enqueueSnackbar } = useSnackbar();
  const { permissions } = useAuth();
  const { data, handleSearch, handleReset, refresh } = useSearch('applications');

  // Dialog states
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false);
  const [forwardBriefed, setForwardBriefed] = useState(false);
  const [forwardVerified, setForwardVerified] = useState(false);
  const [forwardRemarks, setForwardRemarks] = useState('');
  const [docVerifyOpen, setDocVerifyOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // Load dynamic options from localStorage
  const programs = useMemo(() => {
    try {
      const stored = localStorage.getItem('programs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const intakes = useMemo(() => {
    try {
      const stored = localStorage.getItem('intakes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  // Enrich rows with document indicators
  const enrichedData = useMemo(() => {
    return data.map((row) => {
      const indicators = generateDocIndicators(row);
      return {
        ...row,
        ...indicators,
        docsComplete: isDocsComplete(indicators),
        docsCompleteCount: countDocsComplete(indicators),
        docsTotalCount: DOC_INDICATOR_KEYS.length,
      };
    });
  }, [data]);

  // --- Summary counts ---
  const summaryStats = useMemo(() => {
    const total = enrichedData.length;
    const docsComplete = enrichedData.filter((r) => r.docsComplete).length;
    const docsPending = total - docsComplete;
    const feePaid = enrichedData.filter(
      (r) => r.applicationFee === 'Paid' || r.applicationFeePaid === true
    ).length;
    return { total, docsComplete, docsPending, feePaid };
  }, [enrichedData]);

  // --- Search Fields ---
  const programOptions = useMemo(() => {
    if (Array.isArray(programs) && programs.length > 0) {
      return programs.map((p) =>
        typeof p === 'string' ? p : p.name || p.label || p.programName || ''
      );
    }
    return [];
  }, [programs]);

  const intakeOptions = useMemo(() => {
    if (Array.isArray(intakes) && intakes.length > 0) {
      return intakes.map((i) =>
        typeof i === 'string' ? i : i.name || i.label || i.intakeName || ''
      );
    }
    return [];
  }, [intakes]);

  const searchFields = [
    { name: 'country', label: 'Country', type: 'select', options: COUNTRIES, gridSize: 2 },
    { name: 'businessUnit', label: 'BU/Business Unit', type: 'select', options: BU_OPTIONS, gridSize: 2 },
    { name: 'course', label: 'Course', type: 'select', options: programOptions, gridSize: 3 },
    { name: 'intake', label: 'Intake', type: 'select', options: intakeOptions, gridSize: 2 },
    { name: 'searchFor', label: 'Search For', type: 'select', options: SEARCH_FOR_OPTIONS, gridSize: 2 },
    { name: 'currentStage', label: 'Current Stage', type: 'select', options: ENQUIRY_STAGES, gridSize: 2 },
    { name: 'targetStartDate', label: 'Target Start Date', type: 'date', gridSize: 2 },
    { name: 'targetEndDate', label: 'Target End Date', type: 'date', gridSize: 2 },
    { name: 'applicationId', label: 'Application ID', gridSize: 2 },
    { name: 'studentName', label: 'Student Name', gridSize: 2 },
    { name: 'mobile', label: 'Mobile', gridSize: 2 },
    { name: 'sortBy', label: 'Sort By', type: 'select', options: SORT_BY_OPTIONS, gridSize: 2 },
    { name: 'pcCm', label: 'PC/CM', gridSize: 2 },
    { name: 'admissionType', label: 'Admission Type', type: 'select', options: ADMISSION_TYPE_OPTIONS, gridSize: 2 },
    { name: 'agent', label: 'Agent', gridSize: 2 },
    { name: 'applicationStartDate', label: 'Application Start Date', type: 'date', gridSize: 2 },
    { name: 'applicationEndDate', label: 'Application End Date', type: 'date', gridSize: 2 },
    { name: 'searchDocuments', label: 'Search for Documents', type: 'select', options: SEARCH_DOCUMENTS_OPTIONS, gridSize: 2 },
    { name: 'applicationFeeFilter', label: 'Application Fee', type: 'select', options: APPLICATION_FEE_OPTIONS, gridSize: 2 },
  ];

  // --- Document indicator icon renderer ---
  const renderDocIcon = (value) => {
    if (value) {
      return <CheckCircleIcon sx={{ color: '#2e7d32', fontSize: 18 }} />;
    }
    return <CancelIcon sx={{ color: '#d32f2f', fontSize: 18 }} />;
  };

  // --- Table Columns ---
  const columns = useMemo(() => {
    const cols = [
      {
        field: 'studentName',
        headerName: 'Name',
        width: 160,
        flex: 1,
        renderCell: (params) => (
          <Link
            component="button"
            variant="body2"
            sx={{ fontWeight: 500, color: '#b30537', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            onClick={(e) => {
              e.stopPropagation();
              handleViewStudent(params.row);
            }}
          >
            {params.value || 'N/A'}
          </Link>
        ),
      },
      { field: 'course', headerName: 'Course', width: 160 },
      { field: 'crmId', headerName: 'CRM ID', width: 110 },
      {
        field: 'applicationFee',
        headerName: 'Application Fee',
        width: 130,
        renderCell: (params) => {
          const paid = params.value === 'Paid' || params.row.applicationFeePaid === true;
          return (
            <Chip
              label={paid ? 'Paid' : 'Unpaid'}
              size="small"
              sx={{
                backgroundColor: paid ? '#e8f5e9' : '#fce4ec',
                color: paid ? '#2e7d32' : '#c62828',
                fontWeight: 600,
                fontSize: '0.72rem',
                borderRadius: '6px',
                height: 24,
              }}
            />
          );
        },
      },
    ];

    // Document indicator columns
    DOC_INDICATOR_KEYS.forEach((doc) => {
      cols.push({
        field: doc.key,
        headerName: doc.label,
        width: 65,
        sortable: false,
        headerAlign: 'center',
        align: 'center',
        renderCell: (params) => renderDocIcon(params.value),
      });
    });

    cols.push(
      {
        field: 'currentStage',
        headerName: 'Stage',
        width: 140,
        renderCell: (params) => (
          <StatusChip status={params.value || 'New Enquiry'} />
        ),
      },
      {
        field: 'docsComplete',
        headerName: 'Docs Status',
        width: 120,
        renderCell: (params) => (
          <Chip
            label={params.value ? 'Complete' : 'Incomplete'}
            size="small"
            sx={{
              backgroundColor: params.value ? '#e8f5e9' : '#fff8e1',
              color: params.value ? '#2e7d32' : '#f9a825',
              fontWeight: 600,
              fontSize: '0.72rem',
              borderRadius: '6px',
              height: 24,
            }}
          />
        ),
      },
      {
        field: 'applicationDate',
        headerName: 'Application Date',
        width: 120,
        valueGetter: (value, row) => row.applicationDate || row.createdAt?.split('T')[0] || '',
      },
      {
        field: 'remarks',
        headerName: 'Remarks',
        width: 150,
        renderCell: (params) => (
          <Tooltip title={params.value || ''}>
            <Typography
              variant="body2"
              noWrap
              sx={{ fontSize: '0.8rem', maxWidth: 140 }}
            >
              {params.value || '-'}
            </Typography>
          </Tooltip>
        ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 160,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', gap: 0.25 }}>
            {(permissions.isSales || permissions.isRoot) && (
              <Tooltip title="Forward to Admissions">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProceedClick(params.row);
                  }}
                  sx={{ color: '#b30537' }}
                >
                  <SendIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="View">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewStudent(params.row);
                }}
                color="info"
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditStudent(params.row);
                }}
                color="primary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      }
    );

    return cols;
  }, [permissions]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Handlers ---

  const handleViewStudent = (row) => {
    setSelected(row);
    setViewOpen(true);
  };

  const handleEditStudent = (row) => {
    setSelected(row);
    setEditOpen(true);
  };

  const handleProceedClick = (row) => {
    setSelected(row);
    setForwardBriefed(false);
    setForwardVerified(false);
    setForwardRemarks('');
    setForwardDialogOpen(true);
  };

  const handleForwardSubmit = () => {
    if (!forwardBriefed || !forwardVerified) {
      enqueueSnackbar('Please confirm both checkboxes before forwarding', { variant: 'warning' });
      return;
    }
    storageService.update('applications', selected.id, {
      currentStage: 'Under Review',
      forwardedToAdmissions: true,
      forwardRemarks: forwardRemarks,
      forwardedDate: new Date().toISOString().split('T')[0],
    });
    enqueueSnackbar(
      `Application for ${selected.studentName || 'student'} forwarded to Admissions`,
      { variant: 'success' }
    );
    setForwardDialogOpen(false);
    setSelected(null);
    refresh();
  };

  const handleRowClick = (params) => {
    setSelected(params.row);
    setDocVerifyOpen(true);
  };

  const handleDocVerifyAction = (docKey, action) => {
    if (!selected) return;
    const updatedRow = { ...selected, [docKey]: action === 'verify' };
    storageService.update('applications', selected.id, { [docKey]: action === 'verify' });
    setSelected(updatedRow);
    enqueueSnackbar(
      `Document "${DOC_INDICATOR_KEYS.find((d) => d.key === docKey)?.label}" ${action === 'verify' ? 'verified' : 'rejected'}`,
      { variant: action === 'verify' ? 'success' : 'warning' }
    );
    refresh();
  };

  const handleEditSubmit = (values) => {
    storageService.update('applications', selected.id, values);
    enqueueSnackbar('Application updated successfully', { variant: 'success' });
    setEditOpen(false);
    setSelected(null);
    refresh();
  };

  // Edit form fields
  const editFields = [
    { name: 'studentName', label: 'Student Name', required: true },
    { name: 'course', label: 'Course' },
    { name: 'crmId', label: 'CRM ID' },
    { name: 'currentStage', label: 'Current Stage', type: 'select', options: ENQUIRY_STAGES },
    { name: 'applicationFee', label: 'Application Fee', type: 'select', options: ['Paid', 'Unpaid'] },
    { name: 'country', label: 'Country', type: 'select', options: COUNTRIES },
    { name: 'mobile', label: 'Mobile' },
    { name: 'remarks', label: 'Remarks', type: 'textarea', fullWidth: true },
  ];

  // View form fields
  const viewFields = [
    { name: 'studentName', label: 'Student Name', disabled: true },
    { name: 'course', label: 'Course', disabled: true },
    { name: 'crmId', label: 'CRM ID', disabled: true },
    { name: 'currentStage', label: 'Current Stage', disabled: true },
    { name: 'applicationFee', label: 'Application Fee', disabled: true },
    { name: 'country', label: 'Country', disabled: true },
    { name: 'mobile', label: 'Mobile', disabled: true },
    { name: 'applicationDate', label: 'Application Date', disabled: true },
    { name: 'remarks', label: 'Remarks', disabled: true, fullWidth: true },
  ];

  // Document indicators for the selected row (for verification modal)
  const selectedDocIndicators = useMemo(() => {
    if (!selected) return [];
    const indicators = generateDocIndicators(selected);
    return DOC_INDICATOR_KEYS.map((doc) => ({
      ...doc,
      status: selected[doc.key] !== undefined ? selected[doc.key] : indicators[doc.key],
    }));
  }, [selected]);

  // --- Summary Bar ---
  const SummaryBar = () => (
    <Paper sx={{ p: 2, mb: 2.5 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1565c0' }}>
              {summaryStats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Total Applications
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32' }}>
              {summaryStats.docsComplete}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Documents Complete
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#f9a825' }}>
              {summaryStats.docsPending}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Documents Pending
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32' }}>
              {summaryStats.feePaid}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Application Fee Paid
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );

  return (
    <Box>
      <PageHeader
        title="Document Search"
        breadcrumbs={[
          { label: 'Students', path: '/students/search' },
          { label: 'Document Search' },
        ]}
      />

      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />

      {enrichedData.length > 0 && <SummaryBar />}

      <DataTable
        rows={enrichedData}
        columns={columns}
        exportFilename="document-search"
        onRowClick={handleRowClick}
        density="compact"
      />

      {/* Forward to Admissions Dialog */}
      <Dialog
        open={forwardDialogOpen}
        onClose={() => { setForwardDialogOpen(false); setSelected(null); }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Forward to Admissions
          <IconButton
            onClick={() => { setForwardDialogOpen(false); setSelected(null); }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Student:</strong> {selected?.studentName || 'N/A'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Course:</strong> {selected?.course || 'N/A'}
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={forwardBriefed}
                onChange={(e) => setForwardBriefed(e.target.checked)}
                sx={{ '&.Mui-checked': { color: '#b30537' } }}
              />
            }
            label="I confirm student has been briefed on program requirements"
            sx={{ mb: 1, display: 'block' }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={forwardVerified}
                onChange={(e) => setForwardVerified(e.target.checked)}
                sx={{ '&.Mui-checked': { color: '#b30537' } }}
              />
            }
            label="All required documents have been verified"
            sx={{ mb: 2, display: 'block' }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Remarks"
            value={forwardRemarks}
            onChange={(e) => setForwardRemarks(e.target.value)}
            size="small"
            placeholder="Add any remarks for the admissions team..."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => { setForwardDialogOpen(false); setSelected(null); }}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleForwardSubmit}
            disabled={!forwardBriefed || !forwardVerified}
            sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}
          >
            Forward
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document Verification Modal */}
      <Dialog
        open={docVerifyOpen}
        onClose={() => { setDocVerifyOpen(false); setSelected(null); }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DescriptionIcon sx={{ color: '#b30537' }} />
            Document Verification - {selected?.studentName || 'Student'}
          </Box>
          <IconButton
            onClick={() => { setDocVerifyOpen(false); setSelected(null); }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="body2">
                  <strong>Course:</strong> {selected?.course || 'N/A'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="body2">
                  <strong>CRM ID:</strong> {selected?.crmId || 'N/A'}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="body2">
                  <strong>Stage:</strong> {selected?.currentStage || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                  <TableCell sx={{ fontWeight: 600 }}>Document</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedDocIndicators.map((doc) => (
                  <TableRow key={doc.key} hover>
                    <TableCell>{doc.label}</TableCell>
                    <TableCell align="center">
                      {doc.status ? (
                        <Chip
                          icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                          label="Verified"
                          size="small"
                          sx={{
                            backgroundColor: '#e8f5e9',
                            color: '#2e7d32',
                            fontWeight: 600,
                            fontSize: '0.72rem',
                            '& .MuiChip-icon': { color: '#2e7d32' },
                          }}
                        />
                      ) : (
                        <Chip
                          icon={<CancelIcon sx={{ fontSize: 16 }} />}
                          label="Missing"
                          size="small"
                          sx={{
                            backgroundColor: '#fce4ec',
                            color: '#c62828',
                            fontWeight: 600,
                            fontSize: '0.72rem',
                            '& .MuiChip-icon': { color: '#c62828' },
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Verify">
                        <IconButton
                          size="small"
                          onClick={() => handleDocVerifyAction(doc.key, 'verify')}
                          color="success"
                          disabled={doc.status === true}
                        >
                          <VerifiedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton
                          size="small"
                          onClick={() => handleDocVerifyAction(doc.key, 'reject')}
                          color="error"
                          disabled={doc.status === false}
                        >
                          <CancelIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Typography variant="body2" sx={{ mr: 'auto', pt: 0.5 }}>
              <strong>
                {selectedDocIndicators.filter((d) => d.status).length} / {selectedDocIndicators.length}
              </strong>{' '}
              documents verified
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => { setDocVerifyOpen(false); setSelected(null); }}
            color="inherit"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Application Dialog */}
      <FormDialog
        open={editOpen}
        onClose={() => { setEditOpen(false); setSelected(null); }}
        onSubmit={handleEditSubmit}
        title="Edit Application"
        fields={editFields}
        initialValues={selected || {}}
        maxWidth="sm"
      />

      {/* View Application Dialog */}
      <FormDialog
        open={viewOpen}
        onClose={() => { setViewOpen(false); setSelected(null); }}
        onSubmit={() => setViewOpen(false)}
        title="Application Details"
        fields={viewFields}
        initialValues={selected || {}}
        maxWidth="sm"
        submitLabel="Close"
      />
    </Box>
  );
}