import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

function ensureDir(filePath) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function searchPage(title, breadcrumbs, storageKey, searchFieldsCode, columnsCode, formFieldsCode = null) {
  const hasCrud = !!formFieldsCode;
  const imports = [
    `import React, { useState, useCallback } from 'react';`,
    `import { Box${hasCrud ? ', IconButton, Tooltip' : ''} } from '@mui/material';`,
    hasCrud ? `import EditIcon from '@mui/icons-material/Edit';` : '',
    hasCrud ? `import DeleteIcon from '@mui/icons-material/Delete';` : '',
    hasCrud ? `import AddIcon from '@mui/icons-material/Add';` : '',
    `import { useSnackbar } from 'notistack';`,
    `import PageHeader from '${breadcrumbs.includes('Academics') || breadcrumbs.includes('Masters') ? '../../../' : '../../'}components/common/PageHeader';`,
    `import SearchForm from '${breadcrumbs.includes('Academics') || breadcrumbs.includes('Masters') ? '../../../' : '../../'}components/common/SearchForm';`,
    `import DataTable from '${breadcrumbs.includes('Academics') || breadcrumbs.includes('Masters') ? '../../../' : '../../'}components/common/DataTable';`,
    hasCrud ? `import FormDialog from '${breadcrumbs.includes('Academics') || breadcrumbs.includes('Masters') ? '../../../' : '../../'}components/common/FormDialog';` : '',
    hasCrud ? `import ConfirmDialog from '${breadcrumbs.includes('Academics') || breadcrumbs.includes('Masters') ? '../../../' : '../../'}components/common/ConfirmDialog';` : '',
    `import StatusChip from '${breadcrumbs.includes('Academics') || breadcrumbs.includes('Masters') ? '../../../' : '../../'}components/common/StatusChip';`,
    `import storageService from '${breadcrumbs.includes('Academics') || breadcrumbs.includes('Masters') ? '../../../' : '../../'}services/storageService';`,
    `import useSearch from '${breadcrumbs.includes('Academics') || breadcrumbs.includes('Masters') ? '../../../' : '../../'}hooks/useSearch';`,
  ].filter(Boolean).join('\n');

  const funcName = title.replace(/[^a-zA-Z0-9]/g, '');

  return `${imports}

const STORAGE_KEY = '${storageKey}';
const breadcrumbs = [${breadcrumbs}];

export default function ${funcName}() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch(STORAGE_KEY);
${hasCrud ? `  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);` : ''}

  const searchFields = [${searchFieldsCode}];
  const columns = [${columnsCode}];
${hasCrud ? `  const formFields = [${formFieldsCode}];

  const handleAdd = useCallback(() => { setEditItem(null); setFormOpen(true); }, []);
  const handleEdit = useCallback((row) => { setEditItem(row); setFormOpen(true); }, []);
  const handleDeleteClick = useCallback((row) => { setDeleteItem(row); setDeleteOpen(true); }, []);

  const handleFormSubmit = useCallback((values) => {
    try {
      if (editItem) { storageService.update(STORAGE_KEY, editItem.id, values); enqueueSnackbar('Updated successfully', { variant: 'success' }); }
      else { storageService.create(STORAGE_KEY, values); enqueueSnackbar('Created successfully', { variant: 'success' }); }
      setFormOpen(false); setEditItem(null); refresh();
    } catch { enqueueSnackbar('Operation failed', { variant: 'error' }); }
  }, [editItem, enqueueSnackbar, refresh]);

  const handleDeleteConfirm = useCallback(() => {
    try { storageService.remove(STORAGE_KEY, deleteItem.id); enqueueSnackbar('Deleted', { variant: 'success' }); setDeleteOpen(false); setDeleteItem(null); refresh(); }
    catch { enqueueSnackbar('Delete failed', { variant: 'error' }); }
  }, [deleteItem, enqueueSnackbar, refresh]);` : ''}

  return (
    <Box>
      <PageHeader title="${title}" breadcrumbs={breadcrumbs}${hasCrud ? ' actionLabel="Add" actionIcon={<AddIcon />} onAction={handleAdd}' : ''} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="${storageKey}" />
${hasCrud ? `      <FormDialog open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleFormSubmit} title={editItem ? 'Edit' : 'Add'} fields={formFields} initialValues={editItem || {}} maxWidth="md" />
      <ConfirmDialog open={deleteOpen} title="Confirm Delete" message="Are you sure?" onConfirm={handleDeleteConfirm} onCancel={() => setDeleteOpen(false)} />` : ''}
    </Box>
  );
}
`;
}

function dashboardPage(title, bcStr, cards, tableTitle, storageKey, columnsCode) {
  const prefix = bcStr.includes('Academics') ? '../../../' : '../../';
  return `import React, { useMemo } from 'react';
import { Box, Card, CardContent, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import PageHeader from '${prefix}components/common/PageHeader';
import DataTable from '${prefix}components/common/DataTable';
import StatusChip from '${prefix}components/common/StatusChip';
import storageService from '${prefix}services/storageService';

const breadcrumbs = [${bcStr}];

const SummaryCard = ({ title, value, color }) => (
  <Card sx={{ height: '100%' }}><CardContent sx={{ textAlign: 'center' }}>
    <Typography variant="body2" color="text.secondary">{title}</Typography>
    <Typography variant="h5" sx={{ fontWeight: 700, color: color || '#b30537', mt: 1 }}>{value}</Typography>
  </CardContent></Card>
);

export default function ${title.replace(/[^a-zA-Z0-9]/g, '')}() {
  const data = useMemo(() => storageService.getAll('${storageKey}'), []);
  const columns = [${columnsCode}];

  return (
    <Box>
      <PageHeader title="${title}" breadcrumbs={breadcrumbs} />
      <Grid container spacing={2} sx={{ mb: 3 }}>
${cards.map(c => `        <Grid size={{ xs: 6, sm: 3 }}><SummaryCard title="${c.title}" value={${c.value}} color="${c.color}" /></Grid>`).join('\n')}
      </Grid>
      <Paper sx={{ p: 0 }}>
        <DataTable rows={data} columns={columns} exportFilename="${storageKey}" />
      </Paper>
    </Box>
  );
}
`;
}

function ingestorPage(title, bcStr, storageKey) {
  const prefix = bcStr.includes('Academics') ? '../../../' : '../../';
  return `import React, { useState } from 'react';
import { Box, Button, Paper, Typography, LinearProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import { useSnackbar } from 'notistack';
import PageHeader from '${prefix}components/common/PageHeader';
import DataTable from '${prefix}components/common/DataTable';
import { v4 as uuidv4 } from 'uuid';

const breadcrumbs = [${bcStr}];

export default function ${title.replace(/[^a-zA-Z0-9]/g, '')}() {
  const { enqueueSnackbar } = useSnackbar();
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      setTimeout(() => {
        setResults([
          { id: uuidv4(), row: 1, item: 'Record 1', status: 'Success', message: 'Imported successfully' },
          { id: uuidv4(), row: 2, item: 'Record 2', status: 'Success', message: 'Imported successfully' },
          { id: uuidv4(), row: 3, item: 'Record 3', status: 'Error', message: 'Validation failed' },
        ]);
        setUploading(false);
        enqueueSnackbar('File processed', { variant: 'info' });
      }, 2000);
    }
  };

  const columns = [
    { field: 'row', headerName: 'Row', flex: 0.3, minWidth: 50 },
    { field: 'item', headerName: 'Item', flex: 1.2, minWidth: 150 },
    { field: 'status', headerName: 'Status', flex: 0.5, minWidth: 80, renderCell: (p) => <Typography variant="body2" sx={{ color: p.value === 'Success' ? 'green' : 'red', fontWeight: 600 }}>{p.value}</Typography> },
    { field: 'message', headerName: 'Message', flex: 1.5, minWidth: 200 },
  ];

  return (
    <Box>
      <PageHeader title="${title}" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Upload Data</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button variant="outlined" startIcon={<DownloadIcon />}>Download Template</Button>
          <Button variant="contained" component="label" startIcon={<CloudUploadIcon />} sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Upload File<input type="file" hidden accept=".csv,.xlsx" onChange={handleFileChange} /></Button>
        </Box>
        {uploading && <LinearProgress sx={{ mb: 2 }} />}
        {results.length > 0 && <Alert severity="info">Processed {results.length} rows</Alert>}
      </Paper>
      {results.length > 0 && <DataTable rows={results} columns={columns} exportFilename="${storageKey}-import" />}
    </Box>
  );
}
`;
}

function formPage(title, bcStr, storageKey, fieldsCode) {
  const prefix = bcStr.includes('Academics') ? '../../../' : '../../';
  return `import React, { useState } from 'react';
import { Box, Paper, TextField, Button, MenuItem, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useSnackbar } from 'notistack';
import { v4 as uuidv4 } from 'uuid';
import PageHeader from '${prefix}components/common/PageHeader';

const breadcrumbs = [${bcStr}];

export default function ${title.replace(/[^a-zA-Z0-9]/g, '')}() {
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({});
  const handleChange = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const items = JSON.parse(localStorage.getItem('sms_${storageKey}') || '[]');
    items.push({ id: uuidv4(), ...form, createdDate: new Date().toISOString().split('T')[0] });
    localStorage.setItem('sms_${storageKey}', JSON.stringify(items));
    enqueueSnackbar('Saved successfully', { variant: 'success' });
    setForm({});
  };

  return (
    <Box>
      <PageHeader title="${title}" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
${fieldsCode}
            <Grid size={{ xs: 12 }}><Button type="submit" variant="contained" sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Save</Button></Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
`;
}

function simpleReportPage(title, bcStr, storageKey, searchFieldsCode, columnsCode) {
  const prefix = '../../';
  return `import React from 'react';
import { Box } from '@mui/material';
import PageHeader from '${prefix}components/common/PageHeader';
import SearchForm from '${prefix}components/common/SearchForm';
import DataTable from '${prefix}components/common/DataTable';
import StatusChip from '${prefix}components/common/StatusChip';
import useSearch from '${prefix}hooks/useSearch';

const breadcrumbs = [${bcStr}];

export default function ${title.replace(/[^a-zA-Z0-9]/g, '')}() {
  const { data, handleSearch, handleReset } = useSearch('${storageKey}');

  const searchFields = [${searchFieldsCode}];
  const columns = [${columnsCode}];

  return (
    <Box>
      <PageHeader title="${title}" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="${storageKey}" />
    </Box>
  );
}
`;
}

// ====== ACADEMICS - TEST PAGES ======
const acBC = `{ label: 'Academics', path: '/academics' }`;

const pages = {};

// TestCreation
pages['src/pages/academics/TestCreation.jsx'] = formPage('Test Creation', `${acBC}, { label: 'Test Creation' }`, 'tests', `
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Test Name" value={form.name || ''} onChange={e => handleChange('name', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Category" value={form.category || ''} onChange={e => handleChange('category', e.target.value)} required size="small"><MenuItem value="Mid-Term">Mid-Term</MenuItem><MenuItem value="Final">Final</MenuItem><MenuItem value="Quiz">Quiz</MenuItem><MenuItem value="Assignment">Assignment</MenuItem><MenuItem value="Practical">Practical</MenuItem><MenuItem value="Supplementary">Supplementary</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Type" value={form.type || ''} onChange={e => handleChange('type', e.target.value)} size="small"><MenuItem value="MCQ">MCQ</MenuItem><MenuItem value="Essay">Essay</MenuItem><MenuItem value="Mixed">Mixed</MenuItem><MenuItem value="Practical">Practical</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="date" label="Date" value={form.date || ''} onChange={e => handleChange('date', e.target.value)} InputLabelProps={{ shrink: true }} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Duration (mins)" value={form.duration || ''} onChange={e => handleChange('duration', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Max Marks" value={form.maxMarks || ''} onChange={e => handleChange('maxMarks', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Pass Marks" value={form.passMarks || ''} onChange={e => handleChange('passMarks', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Weightage %" value={form.weightage || ''} onChange={e => handleChange('weightage', e.target.value)} size="small" /></Grid>`);

// TestStructure
pages['src/pages/academics/TestStructure.jsx'] = searchPage('Test Structure', `${acBC}, { label: 'Test Structure' }`, 'testStructures',
  `{ name: 'testName', label: 'Test', type: 'text', gridSize: 3 }, { name: 'module', label: 'Module', type: 'text', gridSize: 3 }`,
  `{ field: 'testName', headerName: 'Test', flex: 1, minWidth: 150 },
    { field: 'sectionName', headerName: 'Section', flex: 1, minWidth: 130 },
    { field: 'questionType', headerName: 'Question Type', flex: 0.8, minWidth: 100 },
    { field: 'numQuestions', headerName: 'Questions', flex: 0.5, minWidth: 80 },
    { field: 'marksPerQuestion', headerName: 'Marks/Q', flex: 0.5, minWidth: 80 },
    { field: 'totalMarks', headerName: 'Total Marks', flex: 0.6, minWidth: 90 }`,
  `{ name: 'testName', label: 'Test', type: 'text', required: true },
    { name: 'sectionName', label: 'Section Name', type: 'text', required: true },
    { name: 'questionType', label: 'Question Type', type: 'select', options: ['MCQ', 'Essay', 'Short Answer', 'True/False', 'Practical'] },
    { name: 'numQuestions', label: 'No. of Questions', type: 'number' },
    { name: 'marksPerQuestion', label: 'Marks Per Question', type: 'number' },
    { name: 'totalMarks', label: 'Total Marks', type: 'number' }`);

// MarksIngestor
pages['src/pages/academics/MarksIngestor.jsx'] = ingestorPage('Marks Ingestor', `${acBC}, { label: 'Marks Ingestor' }`, 'testMarks');

// AssignSecondEvaluator
pages['src/pages/academics/AssignSecondEvaluator.jsx'] = searchPage('Assign Second Evaluator', `${acBC}, { label: 'Assign Second Evaluator' }`, 'testEvaluators',
  `{ name: 'testName', label: 'Test', type: 'text', gridSize: 3 }, { name: 'module', label: 'Module', type: 'text', gridSize: 3 }`,
  `{ field: 'testName', headerName: 'Test', flex: 1, minWidth: 140 },
    { field: 'module', headerName: 'Module', flex: 1, minWidth: 130 },
    { field: 'primaryEvaluator', headerName: 'Primary Evaluator', flex: 1, minWidth: 140 },
    { field: 'secondEvaluator', headerName: 'Second Evaluator', flex: 1, minWidth: 140 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`,
  `{ name: 'testName', label: 'Test', type: 'text', required: true },
    { name: 'module', label: 'Module', type: 'text', required: true },
    { name: 'primaryEvaluator', label: 'Primary Evaluator', type: 'text' },
    { name: 'secondEvaluator', label: 'Second Evaluator', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Assigned', 'Completed'] }`);

// EvaluatedTestSearch
pages['src/pages/academics/EvaluatedTestSearch.jsx'] = searchPage('Evaluated Student Test Search', `${acBC}, { label: 'Evaluated Tests' }`, 'evaluatedTests',
  `{ name: 'studentName', label: 'Student', type: 'text', gridSize: 3 }, { name: 'testName', label: 'Test', type: 'text', gridSize: 3 }, { name: 'module', label: 'Module', type: 'text', gridSize: 3 }`,
  `{ field: 'studentName', headerName: 'Student', flex: 1, minWidth: 140 },
    { field: 'testName', headerName: 'Test', flex: 1, minWidth: 130 },
    { field: 'module', headerName: 'Module', flex: 0.8, minWidth: 110 },
    { field: 'marks', headerName: 'Marks', flex: 0.5, minWidth: 70 },
    { field: 'evaluator', headerName: 'Evaluator', flex: 0.8, minWidth: 110 },
    { field: 'secondMarks', headerName: '2nd Eval Marks', flex: 0.6, minWidth: 100 },
    { field: 'finalMarks', headerName: 'Final Marks', flex: 0.6, minWidth: 90 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

// FreezeTest
pages['src/pages/academics/FreezeTest.jsx'] = `import React, { useState, useCallback } from 'react';
import { Box, Button, Tooltip, IconButton } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import SearchForm from '../../components/common/SearchForm';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';
import useSearch from '../../hooks/useSearch';

const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Freeze Test' }];

export default function FreezeTest() {
  const { enqueueSnackbar } = useSnackbar();
  const { data, handleSearch, handleReset, refresh } = useSearch('tests');

  const handleFreeze = useCallback((row) => {
    storageService.update('tests', row.id, { ...row, status: 'Frozen' });
    enqueueSnackbar('Test frozen successfully', { variant: 'success' });
    refresh();
  }, [enqueueSnackbar, refresh]);

  const searchFields = [
    { name: 'name', label: 'Test Name', type: 'text', gridSize: 3 },
    { name: 'module', label: 'Module', type: 'text', gridSize: 3 },
    { name: 'status', label: 'Status', type: 'select', options: ['Draft', 'Published', 'Frozen'], gridSize: 2 },
  ];

  const columns = [
    { field: 'name', headerName: 'Test', flex: 1.2, minWidth: 160 },
    { field: 'moduleName', headerName: 'Module', flex: 1, minWidth: 130 },
    { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 100 },
    { field: 'maxMarks', headerName: 'Max Marks', flex: 0.5, minWidth: 80 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'actions', headerName: 'Actions', flex: 0.5, minWidth: 80, sortable: false, renderCell: (p) => p.row.status !== 'Frozen' ? (
      <Tooltip title="Freeze"><IconButton size="small" onClick={() => handleFreeze(p.row)} color="primary"><LockIcon fontSize="small" /></IconButton></Tooltip>
    ) : null },
  ];

  return (
    <Box>
      <PageHeader title="Freeze Test" breadcrumbs={breadcrumbs} />
      <SearchForm fields={searchFields} onSearch={handleSearch} onReset={handleReset} />
      <DataTable rows={data} columns={columns} exportFilename="freeze-test" />
    </Box>
  );
}
`;

// TestPapersDownload
pages['src/pages/academics/TestPapersDownload.jsx'] = searchPage('Test Papers Download', `${acBC}, { label: 'Test Papers Download' }`, 'tests',
  `{ name: 'name', label: 'Test', type: 'text', gridSize: 3 }, { name: 'moduleName', label: 'Module', type: 'text', gridSize: 3 }`,
  `{ field: 'name', headerName: 'Test', flex: 1.2, minWidth: 160 },
    { field: 'moduleName', headerName: 'Module', flex: 1, minWidth: 130 },
    { field: 'category', headerName: 'Category', flex: 0.7, minWidth: 100 },
    { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

// SupplementaryTestEntry
pages['src/pages/academics/SupplementaryTestEntry.jsx'] = formPage('Supplementary Test Data Entry', `${acBC}, { label: 'Supplementary Test Data Entry' }`, 'supplementaryMarks', `
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Test" value={form.test || ''} onChange={e => handleChange('test', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Student Code" value={form.studentCode || ''} onChange={e => handleChange('studentCode', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Student Name" value={form.studentName || ''} onChange={e => handleChange('studentName', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Marks" value={form.marks || ''} onChange={e => handleChange('marks', e.target.value)} required size="small" /></Grid>`);

// ExamDashboard
pages['src/pages/academics/ExamDashboard.jsx'] = dashboardPage('Exam Dashboard', `${acBC}, { label: 'Exam Dashboard' }`,
  [{ title: 'Upcoming Exams', value: 'data.filter(t => t.status === "Draft").length', color: '#2B4D83' },
   { title: 'In Progress', value: 'data.filter(t => t.status === "Published").length', color: 'orange' },
   { title: 'Completed', value: 'data.filter(t => t.status === "Frozen" || t.status === "Completed").length', color: 'green' },
   { title: 'Total Tests', value: 'data.length', color: '#b30537' }],
  'Tests', 'tests',
  `{ field: 'name', headerName: 'Test', flex: 1.2, minWidth: 160 },
    { field: 'moduleName', headerName: 'Module', flex: 1, minWidth: 130 },
    { field: 'category', headerName: 'Category', flex: 0.7, minWidth: 100 },
    { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 100 },
    { field: 'maxMarks', headerName: 'Max Marks', flex: 0.5, minWidth: 80 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

// FailedPercentageReport
pages['src/pages/academics/FailedPercentageReport.jsx'] = simpleReportPage('Failed Percentage Report', `${acBC}, { label: 'Failed Percentage Report' }`, 'tests',
  `{ name: 'moduleName', label: 'Module', type: 'text', gridSize: 3 }, { name: 'program', label: 'Program', type: 'text', gridSize: 3 }`,
  `{ field: 'moduleName', headerName: 'Module', flex: 1.2, minWidth: 150 },
    { field: 'maxMarks', headerName: 'Max Marks', flex: 0.5, minWidth: 80 },
    { field: 'passMarks', headerName: 'Pass Marks', flex: 0.5, minWidth: 80 },
    { field: 'category', headerName: 'Category', flex: 0.7, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

// PoorPerformanceReport
pages['src/pages/academics/PoorPerformanceReport.jsx'] = simpleReportPage('Poor Performance Report', `${acBC}, { label: 'Poor Performance Report' }`, 'students',
  `{ name: 'program', label: 'Program', type: 'text', gridSize: 3 }, { name: 'cohort', label: 'Cohort', type: 'text', gridSize: 3 }`,
  `{ field: 'studentCode', headerName: 'Student Code', flex: 0.8, minWidth: 110 },
    { field: 'name', headerName: 'Student', flex: 1.2, minWidth: 150 },
    { field: 'program', headerName: 'Program', flex: 0.8, minWidth: 100 },
    { field: 'cohort', headerName: 'Cohort', flex: 0.8, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

// TestCategorySearch
pages['src/pages/academics/TestCategorySearch.jsx'] = searchPage('Test Category Search', `${acBC}, { label: 'Test Categories' }`, 'testCategories',
  `{ name: 'name', label: 'Category', type: 'text', gridSize: 3 }`,
  `{ field: 'name', headerName: 'Category', flex: 1.2, minWidth: 150 },
    { field: 'description', headerName: 'Description', flex: 1.5, minWidth: 200 },
    { field: 'weightage', headerName: 'Weightage %', flex: 0.6, minWidth: 90 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`,
  `{ name: 'name', label: 'Category Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', fullWidth: true },
    { name: 'weightage', label: 'Weightage %', type: 'number' },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }`);

// BacklogStudents
pages['src/pages/academics/BacklogStudents.jsx'] = simpleReportPage('Backlog Students Report', `${acBC}, { label: 'Backlog Students' }`, 'students',
  `{ name: 'program', label: 'Program', type: 'text', gridSize: 3 }, { name: 'cohort', label: 'Cohort', type: 'text', gridSize: 3 }`,
  `{ field: 'studentCode', headerName: 'Student Code', flex: 0.8, minWidth: 110 },
    { field: 'name', headerName: 'Student', flex: 1.2, minWidth: 150 },
    { field: 'program', headerName: 'Program', flex: 0.8, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

// InlineTestEntry
pages['src/pages/academics/InlineTestEntry.jsx'] = formPage('Inline Test Data Entry', `${acBC}, { label: 'Inline Test Data Entry' }`, 'testMarks', `
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Test" value={form.test || ''} onChange={e => handleChange('test', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Module" value={form.module || ''} onChange={e => handleChange('module', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Student Code" value={form.studentCode || ''} onChange={e => handleChange('studentCode', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Marks" value={form.marks || ''} onChange={e => handleChange('marks', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Remarks" value={form.remarks || ''} onChange={e => handleChange('remarks', e.target.value)} multiline rows={2} size="small" /></Grid>`);

// TestUsageReport
pages['src/pages/academics/TestUsageReport.jsx'] = simpleReportPage('Test Usage Report', `${acBC}, { label: 'Test Usage Report' }`, 'tests',
  `{ name: 'name', label: 'Test', type: 'text', gridSize: 3 }, { name: 'moduleName', label: 'Module', type: 'text', gridSize: 3 }`,
  `{ field: 'name', headerName: 'Test', flex: 1.2, minWidth: 150 },
    { field: 'moduleName', headerName: 'Module', flex: 1, minWidth: 130 },
    { field: 'category', headerName: 'Category', flex: 0.7, minWidth: 100 },
    { field: 'date', headerName: 'Last Used', flex: 0.7, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

// ExternalTestEntry
pages['src/pages/academics/ExternalTestEntry.jsx'] = formPage('External Test Data Entry', `${acBC}, { label: 'External Test Data Entry' }`, 'externalTests', `
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Student Code" value={form.studentCode || ''} onChange={e => handleChange('studentCode', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="External Test Name" value={form.testName || ''} onChange={e => handleChange('testName', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Institution" value={form.institution || ''} onChange={e => handleChange('institution', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="date" label="Date" value={form.date || ''} onChange={e => handleChange('date', e.target.value)} InputLabelProps={{ shrink: true }} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Score" value={form.score || ''} onChange={e => handleChange('score', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Grade" value={form.grade || ''} onChange={e => handleChange('grade', e.target.value)} size="small" /></Grid>`);

// ExternalSupplementaryEntry
pages['src/pages/academics/ExternalSupplementaryEntry.jsx'] = formPage('External Supplementary Test Data Entry', `${acBC}, { label: 'External Supplementary' }`, 'externalSupplementary', `
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Student Code" value={form.studentCode || ''} onChange={e => handleChange('studentCode', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Test Name" value={form.testName || ''} onChange={e => handleChange('testName', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Institution" value={form.institution || ''} onChange={e => handleChange('institution', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="date" label="Date" value={form.date || ''} onChange={e => handleChange('date', e.target.value)} InputLabelProps={{ shrink: true }} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Score" value={form.score || ''} onChange={e => handleChange('score', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Grade" value={form.grade || ''} onChange={e => handleChange('grade', e.target.value)} size="small" /></Grid>`);

// TestImport
pages['src/pages/academics/TestImport.jsx'] = ingestorPage('Test Import', `${acBC}, { label: 'Test Import' }`, 'tests');

// ====== ACADEMICS - ATTENDANCE PAGES ======
pages['src/pages/academics/AttendanceDashboard.jsx'] = dashboardPage('Attendance Dashboard', `${acBC}, { label: 'Attendance Dashboard' }`,
  [{ title: "Today's Classes", value: 'data.length', color: '#2B4D83' },
   { title: 'Avg Attendance', value: '"92%"', color: 'green' },
   { title: 'Absent Today', value: '3', color: 'red' },
   { title: 'Late Arrivals', value: '5', color: 'orange' }],
  'Timetable', 'timetable',
  `{ field: 'moduleName', headerName: 'Module', flex: 1.2, minWidth: 150 },
    { field: 'cohort', headerName: 'Cohort', flex: 0.8, minWidth: 100 },
    { field: 'day', headerName: 'Day', flex: 0.6, minWidth: 80 },
    { field: 'time', headerName: 'Time', flex: 0.7, minWidth: 100 },
    { field: 'room', headerName: 'Room', flex: 0.5, minWidth: 70 },
    { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 }`);

pages['src/pages/academics/TimetableIngestion.jsx'] = ingestorPage('Timetable Ingestion', `${acBC}, { label: 'Timetable Ingestion' }`, 'timetable');
pages['src/pages/academics/AttendanceIngestor.jsx'] = ingestorPage('Attendance Ingestor', `${acBC}, { label: 'Attendance Ingestor' }`, 'attendance');

pages['src/pages/academics/StudentAttendance.jsx'] = simpleReportPage('Student Attendance', `${acBC}, { label: 'Student Attendance' }`, 'attendance',
  `{ name: 'studentName', label: 'Student', type: 'text', gridSize: 3 }, { name: 'module', label: 'Module', type: 'text', gridSize: 3 }, { name: 'status', label: 'Status', type: 'select', options: ['Present', 'Absent', 'Late', 'Excused'], gridSize: 2 }`,
  `{ field: 'date', headerName: 'Date', flex: 0.7, minWidth: 100 },
    { field: 'studentName', headerName: 'Student', flex: 1.2, minWidth: 150 },
    { field: 'module', headerName: 'Module', flex: 1, minWidth: 130 },
    { field: 'time', headerName: 'Time', flex: 0.6, minWidth: 90 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

pages['src/pages/academics/SyncAttendance.jsx'] = `import React, { useState } from 'react';
import { Box, Paper, Typography, Button, TextField, MenuItem, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import SyncIcon from '@mui/icons-material/Sync';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';

const breadcrumbs = [{ label: 'Academics', path: '/academics' }, { label: 'Sync Attendance' }];

export default function SyncAttendance() {
  const { enqueueSnackbar } = useSnackbar();
  const [source, setSource] = useState('');
  const [synced, setSynced] = useState(false);

  const handleSync = () => {
    setSynced(true);
    enqueueSnackbar('Attendance synced successfully', { variant: 'success' });
  };

  return (
    <Box>
      <PageHeader title="Sync Attendance" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Sync from External System</Typography>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth select label="Source" value={source} onChange={e => setSource(e.target.value)} size="small"><MenuItem value="Biometric">Biometric</MenuItem><MenuItem value="LMS">LMS</MenuItem><MenuItem value="Manual">Manual Upload</MenuItem></TextField></Grid>
          <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth type="date" label="Date" defaultValue={new Date().toISOString().split('T')[0]} InputLabelProps={{ shrink: true }} size="small" /></Grid>
          <Grid size={{ xs: 12, sm: 2 }}><Button variant="contained" startIcon={<SyncIcon />} onClick={handleSync} disabled={!source} sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Sync</Button></Grid>
        </Grid>
        {synced && <Alert severity="success" sx={{ mt: 2 }}>Successfully synced 150 attendance records from {source}.</Alert>}
      </Paper>
    </Box>
  );
}
`;

pages['src/pages/academics/ActivitySlots.jsx'] = searchPage('Activity Slots', `${acBC}, { label: 'Activity Slots' }`, 'activitySlots',
  `{ name: 'module', label: 'Module', type: 'text', gridSize: 3 }, { name: 'day', label: 'Day', type: 'select', options: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], gridSize: 2 }`,
  `{ field: 'name', headerName: 'Slot', flex: 1, minWidth: 130 },
    { field: 'day', headerName: 'Day', flex: 0.6, minWidth: 80 },
    { field: 'startTime', headerName: 'Start', flex: 0.5, minWidth: 70 },
    { field: 'endTime', headerName: 'End', flex: 0.5, minWidth: 70 },
    { field: 'room', headerName: 'Room', flex: 0.5, minWidth: 70 },
    { field: 'module', headerName: 'Module', flex: 1, minWidth: 120 },
    { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`,
  `{ name: 'name', label: 'Slot Name', type: 'text', required: true },
    { name: 'day', label: 'Day', type: 'select', options: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], required: true },
    { name: 'startTime', label: 'Start Time', type: 'text' },
    { name: 'endTime', label: 'End Time', type: 'text' },
    { name: 'room', label: 'Room', type: 'text' },
    { name: 'module', label: 'Module', type: 'text' },
    { name: 'instructor', label: 'Instructor', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }`);

pages['src/pages/academics/ExamAttendance.jsx'] = simpleReportPage('Exam Schedule Attendance', `${acBC}, { label: 'Exam Attendance' }`, 'tests',
  `{ name: 'name', label: 'Exam', type: 'text', gridSize: 3 }, { name: 'date', label: 'Date', type: 'date', gridSize: 2 }`,
  `{ field: 'name', headerName: 'Exam', flex: 1.2, minWidth: 150 },
    { field: 'moduleName', headerName: 'Module', flex: 1, minWidth: 130 },
    { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 100 },
    { field: 'maxMarks', headerName: 'Max Marks', flex: 0.5, minWidth: 80 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

pages['src/pages/academics/StudentLeaveManagement.jsx'] = searchPage('Student Leave Management', `${acBC}, { label: 'Student Leave' }`, 'studentLeaves',
  `{ name: 'studentName', label: 'Student', type: 'text', gridSize: 3 }, { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Rejected'], gridSize: 2 }`,
  `{ field: 'studentName', headerName: 'Student', flex: 1.2, minWidth: 150 },
    { field: 'leaveType', headerName: 'Type', flex: 0.7, minWidth: 100 },
    { field: 'fromDate', headerName: 'From', flex: 0.7, minWidth: 100 },
    { field: 'toDate', headerName: 'To', flex: 0.7, minWidth: 100 },
    { field: 'days', headerName: 'Days', flex: 0.4, minWidth: 60 },
    { field: 'reason', headerName: 'Reason', flex: 1, minWidth: 130 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`,
  `{ name: 'studentName', label: 'Student', type: 'text', required: true },
    { name: 'leaveType', label: 'Leave Type', type: 'select', options: ['Medical', 'Personal', 'Emergency', 'Other'], required: true },
    { name: 'fromDate', label: 'From Date', type: 'date', required: true },
    { name: 'toDate', label: 'To Date', type: 'date', required: true },
    { name: 'days', label: 'Days', type: 'number' },
    { name: 'reason', label: 'Reason', type: 'textarea', fullWidth: true },
    { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Rejected'] }`);

pages['src/pages/academics/AbsenteesReport.jsx'] = simpleReportPage('Absentees Report', `${acBC}, { label: 'Absentees Report' }`, 'students',
  `{ name: 'program', label: 'Program', type: 'text', gridSize: 3 }, { name: 'cohort', label: 'Cohort', type: 'text', gridSize: 3 }`,
  `{ field: 'studentCode', headerName: 'Student Code', flex: 0.8, minWidth: 110 },
    { field: 'name', headerName: 'Student', flex: 1.2, minWidth: 150 },
    { field: 'program', headerName: 'Program', flex: 0.8, minWidth: 100 },
    { field: 'cohort', headerName: 'Cohort', flex: 0.8, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

pages['src/pages/academics/AttendanceComparison.jsx'] = simpleReportPage('Attendance Comparison Report', `${acBC}, { label: 'Attendance Comparison' }`, 'timetable',
  `{ name: 'cohort', label: 'Cohort', type: 'text', gridSize: 3 }, { name: 'moduleName', label: 'Module', type: 'text', gridSize: 3 }`,
  `{ field: 'moduleName', headerName: 'Module', flex: 1.2, minWidth: 150 },
    { field: 'cohort', headerName: 'Cohort', flex: 0.8, minWidth: 100 },
    { field: 'day', headerName: 'Day', flex: 0.6, minWidth: 80 },
    { field: 'time', headerName: 'Time', flex: 0.7, minWidth: 100 },
    { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 }`);

// ====== ACADEMICS - QUESTION BANK ======
pages['src/pages/academics/QuestionIngestor.jsx'] = ingestorPage('Question Ingestor', `${acBC}, { label: 'Question Ingestor' }`, 'questions');

pages['src/pages/academics/QuestionSearch.jsx'] = searchPage('Question Search', `${acBC}, { label: 'Question Search' }`, 'questions',
  `{ name: 'module', label: 'Module', type: 'text', gridSize: 3 }, { name: 'type', label: 'Type', type: 'select', options: ['MCQ', 'Essay', 'Short Answer', 'True-False'], gridSize: 2 }, { name: 'difficulty', label: 'Difficulty', type: 'select', options: ['Easy', 'Medium', 'Hard'], gridSize: 2 }`,
  `{ field: 'question', headerName: 'Question', flex: 2, minWidth: 250 },
    { field: 'module', headerName: 'Module', flex: 0.8, minWidth: 100 },
    { field: 'type', headerName: 'Type', flex: 0.6, minWidth: 80 },
    { field: 'difficulty', headerName: 'Difficulty', flex: 0.6, minWidth: 80 },
    { field: 'marks', headerName: 'Marks', flex: 0.4, minWidth: 60 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`,
  `{ name: 'question', label: 'Question Text', type: 'textarea', fullWidth: true, required: true },
    { name: 'module', label: 'Module', type: 'text', required: true },
    { name: 'type', label: 'Type', type: 'select', options: ['MCQ', 'Essay', 'Short Answer', 'True-False'] },
    { name: 'difficulty', label: 'Difficulty', type: 'select', options: ['Easy', 'Medium', 'Hard'] },
    { name: 'marks', label: 'Marks', type: 'number' },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }`);

pages['src/pages/academics/PaperMaker.jsx'] = formPage('Paper Maker', `${acBC}, { label: 'Paper Maker' }`, 'testDrafts', `
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Paper Name" value={form.name || ''} onChange={e => handleChange('name', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Module" value={form.module || ''} onChange={e => handleChange('module', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Test" value={form.test || ''} onChange={e => handleChange('test', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Total Marks" value={form.totalMarks || ''} onChange={e => handleChange('totalMarks', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Questions Count" value={form.questionsCount || ''} onChange={e => handleChange('questionsCount', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Status" value={form.status || ''} onChange={e => handleChange('status', e.target.value)} size="small"><MenuItem value="Draft">Draft</MenuItem><MenuItem value="Published">Published</MenuItem></TextField></Grid>`);

pages['src/pages/academics/NewQuestion.jsx'] = formPage('New Question', `${acBC}, { label: 'New Question' }`, 'questions', `
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Question Text" value={form.question || ''} onChange={e => handleChange('question', e.target.value)} required multiline rows={3} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Module" value={form.module || ''} onChange={e => handleChange('module', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Type" value={form.type || ''} onChange={e => handleChange('type', e.target.value)} required size="small"><MenuItem value="MCQ">MCQ</MenuItem><MenuItem value="Essay">Essay</MenuItem><MenuItem value="Short Answer">Short Answer</MenuItem><MenuItem value="True-False">True-False</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Difficulty" value={form.difficulty || ''} onChange={e => handleChange('difficulty', e.target.value)} size="small"><MenuItem value="Easy">Easy</MenuItem><MenuItem value="Medium">Medium</MenuItem><MenuItem value="Hard">Hard</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth type="number" label="Marks" value={form.marks || ''} onChange={e => handleChange('marks', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Option A" value={form.optionA || ''} onChange={e => handleChange('optionA', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Option B" value={form.optionB || ''} onChange={e => handleChange('optionB', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Option C" value={form.optionC || ''} onChange={e => handleChange('optionC', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Option D" value={form.optionD || ''} onChange={e => handleChange('optionD', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Correct Answer" value={form.correctAnswer || ''} onChange={e => handleChange('correctAnswer', e.target.value)} size="small" /></Grid>`);

pages['src/pages/academics/QuestionImport.jsx'] = ingestorPage('Class Test Question Import', `${acBC}, { label: 'Question Import' }`, 'questions');

pages['src/pages/academics/TestDraftSearch.jsx'] = searchPage('Test Draft Search', `${acBC}, { label: 'Test Drafts' }`, 'testDrafts',
  `{ name: 'name', label: 'Draft Name', type: 'text', gridSize: 3 }, { name: 'module', label: 'Module', type: 'text', gridSize: 3 }`,
  `{ field: 'name', headerName: 'Draft Name', flex: 1.2, minWidth: 150 },
    { field: 'module', headerName: 'Module', flex: 0.8, minWidth: 100 },
    { field: 'test', headerName: 'Test', flex: 0.8, minWidth: 100 },
    { field: 'questionsCount', headerName: 'Questions', flex: 0.5, minWidth: 70 },
    { field: 'totalMarks', headerName: 'Marks', flex: 0.5, minWidth: 70 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

// Placement
pages['src/pages/academics/CompanyManagement.jsx'] = searchPage('Company Management', `${acBC}, { label: 'Company Management' }`, 'companies',
  `{ name: 'name', label: 'Company', type: 'text', gridSize: 3 }, { name: 'industry', label: 'Industry', type: 'text', gridSize: 3 }`,
  `{ field: 'name', headerName: 'Company', flex: 1.2, minWidth: 150 },
    { field: 'industry', headerName: 'Industry', flex: 0.8, minWidth: 100 },
    { field: 'contactPerson', headerName: 'Contact', flex: 1, minWidth: 130 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 130 },
    { field: 'location', headerName: 'Location', flex: 0.8, minWidth: 100 },
    { field: 'openings', headerName: 'Openings', flex: 0.5, minWidth: 70 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`,
  `{ name: 'name', label: 'Company Name', type: 'text', required: true, fullWidth: true },
    { name: 'industry', label: 'Industry', type: 'text' },
    { name: 'contactPerson', label: 'Contact Person', type: 'text' },
    { name: 'email', label: 'Email', type: 'text' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'location', label: 'Location', type: 'text' },
    { name: 'openings', label: 'Openings', type: 'number' },
    { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }`);

pages['src/pages/academics/PlacementReport.jsx'] = simpleReportPage('Placement Report', `${acBC}, { label: 'Placement Report' }`, 'students',
  `{ name: 'program', label: 'Program', type: 'text', gridSize: 3 }`,
  `{ field: 'studentCode', headerName: 'Student', flex: 0.8, minWidth: 110 },
    { field: 'name', headerName: 'Name', flex: 1.2, minWidth: 150 },
    { field: 'program', headerName: 'Program', flex: 0.8, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

// ====== REPORTS PAGES ======
const rpBC = `{ label: 'Reports', path: '/reports' }`;

pages['src/pages/reports/SectionReports.jsx'] = simpleReportPage('Section Reports', `${rpBC}, { label: 'Section Reports' }`, 'sections',
  `{ name: 'name', label: 'Section', type: 'text', gridSize: 3 }, { name: 'module', label: 'Module', type: 'text', gridSize: 3 }`,
  `{ field: 'name', headerName: 'Section', flex: 1, minWidth: 130 },
    { field: 'module', headerName: 'Module', flex: 1, minWidth: 130 },
    { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 },
    { field: 'capacity', headerName: 'Capacity', flex: 0.5, minWidth: 70 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

pages['src/pages/reports/SectionTransfers.jsx'] = simpleReportPage('Section Transfers', `${rpBC}, { label: 'Section Transfers' }`, 'sectionTransfers',
  `{ name: 'studentName', label: 'Student', type: 'text', gridSize: 3 }`,
  `{ field: 'studentName', headerName: 'Student', flex: 1.2, minWidth: 150 },
    { field: 'fromSection', headerName: 'From Section', flex: 1, minWidth: 130 },
    { field: 'toSection', headerName: 'To Section', flex: 1, minWidth: 130 },
    { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 100 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

pages['src/pages/reports/TestReport.jsx'] = simpleReportPage('Test Report', `${rpBC}, { label: 'Test Report' }`, 'tests',
  `{ name: 'name', label: 'Test', type: 'text', gridSize: 3 }, { name: 'moduleName', label: 'Module', type: 'text', gridSize: 3 }`,
  `{ field: 'name', headerName: 'Test', flex: 1.2, minWidth: 160 },
    { field: 'moduleName', headerName: 'Module', flex: 1, minWidth: 130 },
    { field: 'category', headerName: 'Category', flex: 0.7, minWidth: 100 },
    { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 100 },
    { field: 'maxMarks', headerName: 'Max', flex: 0.4, minWidth: 60 },
    { field: 'passMarks', headerName: 'Pass', flex: 0.4, minWidth: 60 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

pages['src/pages/reports/DatewiseAttendanceReport.jsx'] = simpleReportPage('Date Wise Attendance Report', `${rpBC}, { label: 'Date Wise Attendance' }`, 'timetable',
  `{ name: 'day', label: 'Day', type: 'select', options: ['Monday','Tuesday','Wednesday','Thursday','Friday'], gridSize: 2 }, { name: 'moduleName', label: 'Module', type: 'text', gridSize: 3 }`,
  `{ field: 'day', headerName: 'Day', flex: 0.6, minWidth: 80 }, { field: 'moduleName', headerName: 'Module', flex: 1.2, minWidth: 150 }, { field: 'cohort', headerName: 'Cohort', flex: 0.8, minWidth: 100 }, { field: 'time', headerName: 'Time', flex: 0.7, minWidth: 100 }, { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 }`);

pages['src/pages/reports/InstructorAttendanceReport.jsx'] = simpleReportPage('Instructor Attendance Report', `${rpBC}, { label: 'Instructor Attendance' }`, 'timetable',
  `{ name: 'instructor', label: 'Instructor', type: 'text', gridSize: 3 }`,
  `{ field: 'instructor', headerName: 'Instructor', flex: 1.2, minWidth: 150 }, { field: 'moduleName', headerName: 'Module', flex: 1, minWidth: 130 }, { field: 'day', headerName: 'Day', flex: 0.6, minWidth: 80 }, { field: 'time', headerName: 'Time', flex: 0.7, minWidth: 100 }, { field: 'room', headerName: 'Room', flex: 0.5, minWidth: 70 }`);

pages['src/pages/reports/AttendanceSlotReport.jsx'] = simpleReportPage('Attendance Slot Report', `${rpBC}, { label: 'Attendance Slot' }`, 'timetable',
  `{ name: 'cohort', label: 'Cohort', type: 'text', gridSize: 3 }`,
  `{ field: 'time', headerName: 'Slot', flex: 0.8, minWidth: 100 }, { field: 'moduleName', headerName: 'Module', flex: 1.2, minWidth: 150 }, { field: 'day', headerName: 'Day', flex: 0.6, minWidth: 80 }, { field: 'cohort', headerName: 'Cohort', flex: 0.8, minWidth: 100 }, { field: 'room', headerName: 'Room', flex: 0.5, minWidth: 70 }`);

pages['src/pages/reports/NonConductedClasses.jsx'] = simpleReportPage('Non Conducted Classes Report', `${rpBC}, { label: 'Non Conducted Classes' }`, 'timetable',
  `{ name: 'instructor', label: 'Instructor', type: 'text', gridSize: 3 }, { name: 'moduleName', label: 'Module', type: 'text', gridSize: 3 }`,
  `{ field: 'moduleName', headerName: 'Module', flex: 1.2, minWidth: 150 }, { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 }, { field: 'day', headerName: 'Day', flex: 0.6, minWidth: 80 }, { field: 'time', headerName: 'Time', flex: 0.7, minWidth: 100 }, { field: 'room', headerName: 'Room', flex: 0.5, minWidth: 70 }`);

pages['src/pages/reports/CumulativeAttendanceReport.jsx'] = simpleReportPage('Cumulative Attendance Report', `${rpBC}, { label: 'Cumulative Attendance' }`, 'students',
  `{ name: 'program', label: 'Program', type: 'text', gridSize: 3 }, { name: 'cohort', label: 'Cohort', type: 'text', gridSize: 3 }`,
  `{ field: 'studentCode', headerName: 'Student Code', flex: 0.8, minWidth: 110 }, { field: 'name', headerName: 'Student', flex: 1.2, minWidth: 150 }, { field: 'program', headerName: 'Program', flex: 0.8, minWidth: 100 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

pages['src/pages/reports/DailyConsolidatedAttendance.jsx'] = simpleReportPage('Daily Consolidated Attendance', `${rpBC}, { label: 'Daily Consolidated' }`, 'timetable',
  `{ name: 'day', label: 'Day', type: 'select', options: ['Monday','Tuesday','Wednesday','Thursday','Friday'], gridSize: 2 }`,
  `{ field: 'moduleName', headerName: 'Module', flex: 1.2, minWidth: 150 }, { field: 'cohort', headerName: 'Cohort', flex: 0.8, minWidth: 100 }, { field: 'day', headerName: 'Day', flex: 0.6, minWidth: 80 }, { field: 'time', headerName: 'Time', flex: 0.7, minWidth: 100 }, { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 }`);

pages['src/pages/reports/EODSummaryReport.jsx'] = dashboardPage('EOD Summary Report', `${rpBC}, { label: 'EOD Summary' }`,
  [{ title: 'Total Classes', value: 'data.length', color: '#2B4D83' }, { title: 'Attendance Rate', value: '"92%"', color: 'green' }, { title: 'Payments Today', value: '"$12,500"', color: '#b30537' }, { title: 'New Enquiries', value: '3', color: 'orange' }],
  'Summary', 'timetable',
  `{ field: 'moduleName', headerName: 'Module', flex: 1.2, minWidth: 150 }, { field: 'cohort', headerName: 'Cohort', flex: 0.8, minWidth: 100 }, { field: 'day', headerName: 'Day', flex: 0.6, minWidth: 80 }, { field: 'time', headerName: 'Time', flex: 0.7, minWidth: 100 }, { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 }`);

pages['src/pages/reports/VideoStreamLogs.jsx'] = simpleReportPage('Video Stream Logs', `${rpBC}, { label: 'Video Stream Logs' }`, 'auditTrail',
  `{ name: 'user', label: 'User', type: 'text', gridSize: 3 }, { name: 'action', label: 'Action', type: 'text', gridSize: 3 }`,
  `{ field: 'timestamp', headerName: 'Date/Time', flex: 1, minWidth: 150 }, { field: 'user', headerName: 'User', flex: 0.8, minWidth: 110 }, { field: 'action', headerName: 'Action', flex: 0.8, minWidth: 100 }, { field: 'target', headerName: 'Target', flex: 1, minWidth: 130 }, { field: 'details', headerName: 'Details', flex: 1.5, minWidth: 200 }`);

pages['src/pages/reports/InstructorFeedbackReport.jsx'] = simpleReportPage('Instructor Feedback Report', `${rpBC}, { label: 'Instructor Feedback' }`, 'employees',
  `{ name: 'name', label: 'Instructor', type: 'text', gridSize: 3 }, { name: 'department', label: 'Department', type: 'text', gridSize: 3 }`,
  `{ field: 'name', headerName: 'Instructor', flex: 1.2, minWidth: 150 }, { field: 'department', headerName: 'Department', flex: 0.8, minWidth: 110 }, { field: 'designation', headerName: 'Designation', flex: 0.8, minWidth: 110 }, { field: 'type2', headerName: 'Type', flex: 0.6, minWidth: 90 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

pages['src/pages/reports/TrainingsDashboard.jsx'] = dashboardPage('Trainings Dashboard', `${rpBC}, { label: 'Trainings Dashboard' }`,
  [{ title: 'Active Trainings', value: '5', color: '#2B4D83' }, { title: 'Enrolled', value: '120', color: 'green' }, { title: 'Completed', value: '45', color: '#b30537' }, { title: 'Upcoming', value: '3', color: 'orange' }],
  'Trainings', 'programs',
  `{ field: 'name', headerName: 'Training', flex: 1.5, minWidth: 200 }, { field: 'type', headerName: 'Category', flex: 0.8, minWidth: 100 }, { field: 'duration', headerName: 'Duration', flex: 0.6, minWidth: 90 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

// ====== AGENT MANAGEMENT PAGES ======
const agBC = `{ label: 'Agent Management', path: '/agents' }`;

pages['src/pages/agents/RenewalRecommendation.jsx'] = searchPage('Renewal Recommendation', `${agBC}, { label: 'Renewal Recommendation' }`, 'agentRenewals',
  `{ name: 'agentName', label: 'Agent', type: 'text', gridSize: 3 }, { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Submitted'], gridSize: 2 }`,
  `{ field: 'agentName', headerName: 'Agent', flex: 1, minWidth: 130 }, { field: 'company', headerName: 'Company', flex: 1, minWidth: 130 }, { field: 'contractEndDate', headerName: 'Contract End', flex: 0.8, minWidth: 100 }, { field: 'performanceScore', headerName: 'Score', flex: 0.5, minWidth: 70 }, { field: 'recommendation', headerName: 'Recommendation', flex: 0.8, minWidth: 110 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`,
  `{ name: 'agentName', label: 'Agent', type: 'text', required: true }, { name: 'company', label: 'Company', type: 'text' }, { name: 'contractEndDate', label: 'Contract End', type: 'date' }, { name: 'performanceScore', label: 'Score', type: 'number' }, { name: 'recommendation', label: 'Recommendation', type: 'select', options: ['Renew', 'Modify', 'Terminate'] }, { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Submitted'] }`);

pages['src/pages/agents/RenewalApproval.jsx'] = searchPage('Renewal Approval', `${agBC}, { label: 'Renewal Approval' }`, 'agentRenewals',
  `{ name: 'agentName', label: 'Agent', type: 'text', gridSize: 3 }, { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Rejected'], gridSize: 2 }`,
  `{ field: 'agentName', headerName: 'Agent', flex: 1, minWidth: 130 }, { field: 'company', headerName: 'Company', flex: 1, minWidth: 130 }, { field: 'recommendation', headerName: 'Recommendation', flex: 0.8, minWidth: 110 }, { field: 'performanceScore', headerName: 'Score', flex: 0.5, minWidth: 70 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

pages['src/pages/agents/FeedbackQuestions.jsx'] = searchPage('Feedback Questions', `${agBC}, { label: 'Feedback Questions' }`, 'feedbackQuestions',
  `{ name: 'question', label: 'Question', type: 'text', gridSize: 4 }, { name: 'category', label: 'Category', type: 'select', options: ['Teaching', 'Infrastructure', 'Support', 'General'], gridSize: 2 }`,
  `{ field: 'question', headerName: 'Question', flex: 2, minWidth: 250 }, { field: 'category', headerName: 'Category', flex: 0.7, minWidth: 100 }, { field: 'type', headerName: 'Type', flex: 0.6, minWidth: 80 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`,
  `{ name: 'question', label: 'Question', type: 'textarea', fullWidth: true, required: true }, { name: 'category', label: 'Category', type: 'select', options: ['Teaching', 'Infrastructure', 'Support', 'General'] }, { name: 'type', label: 'Type', type: 'select', options: ['Rating', 'Text', 'MCQ'] }, { name: 'required', label: 'Required', type: 'select', options: ['Yes', 'No'] }, { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }`);

pages['src/pages/agents/AddFeedbackForm.jsx'] = formPage('Add Feedback Form', `${agBC}, { label: 'Add Feedback Form' }`, 'feedbackForms', `
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Form Title" value={form.title || ''} onChange={e => handleChange('title', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Target" value={form.target || ''} onChange={e => handleChange('target', e.target.value)} size="small"><MenuItem value="Student">Student</MenuItem><MenuItem value="Instructor">Instructor</MenuItem><MenuItem value="Staff">Staff</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Period" value={form.period || ''} onChange={e => handleChange('period', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Description" value={form.description || ''} onChange={e => handleChange('description', e.target.value)} multiline rows={3} size="small" /></Grid>`);

pages['src/pages/agents/FeedbackFormReport.jsx'] = simpleReportPage('Feedback Form Report', `${agBC}, { label: 'Feedback Report' }`, 'feedbackForms',
  `{ name: 'title', label: 'Form Title', type: 'text', gridSize: 3 }`,
  `{ field: 'title', headerName: 'Form', flex: 1.2, minWidth: 150 }, { field: 'target', headerName: 'Target', flex: 0.7, minWidth: 90 }, { field: 'period', headerName: 'Period', flex: 0.7, minWidth: 90 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

pages['src/pages/agents/AppraisalSection.jsx'] = searchPage('Appraisal Section', `${agBC}, { label: 'Appraisal' }`, 'appraisals',
  `{ name: 'employeeName', label: 'Employee', type: 'text', gridSize: 3 }, { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'In Progress', 'Completed'], gridSize: 2 }`,
  `{ field: 'employeeName', headerName: 'Employee', flex: 1.2, minWidth: 150 }, { field: 'department', headerName: 'Department', flex: 0.8, minWidth: 110 }, { field: 'period', headerName: 'Period', flex: 0.7, minWidth: 90 }, { field: 'selfRating', headerName: 'Self', flex: 0.4, minWidth: 60 }, { field: 'managerRating', headerName: 'Manager', flex: 0.5, minWidth: 70 }, { field: 'finalRating', headerName: 'Final', flex: 0.4, minWidth: 60 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

pages['src/pages/agents/PeerFeedback.jsx'] = formPage('Peer To Peer Feedback', `${agBC}, { label: 'Peer Feedback' }`, 'peerFeedback', `
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Feedback For" value={form.feedbackFor || ''} onChange={e => handleChange('feedbackFor', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="From" value={form.from || ''} onChange={e => handleChange('from', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Communication" value={form.communication || ''} onChange={e => handleChange('communication', e.target.value)} size="small"><MenuItem value="1">1 - Poor</MenuItem><MenuItem value="2">2 - Fair</MenuItem><MenuItem value="3">3 - Good</MenuItem><MenuItem value="4">4 - Very Good</MenuItem><MenuItem value="5">5 - Excellent</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Teamwork" value={form.teamwork || ''} onChange={e => handleChange('teamwork', e.target.value)} size="small"><MenuItem value="1">1 - Poor</MenuItem><MenuItem value="2">2 - Fair</MenuItem><MenuItem value="3">3 - Good</MenuItem><MenuItem value="4">4 - Very Good</MenuItem><MenuItem value="5">5 - Excellent</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Comments" value={form.comments || ''} onChange={e => handleChange('comments', e.target.value)} multiline rows={3} size="small" /></Grid>`);

pages['src/pages/agents/FeedbackDashboard.jsx'] = dashboardPage('Feedback Dashboard', `${agBC}, { label: 'Dashboard' }`,
  [{ title: 'Active Forms', value: '5', color: '#2B4D83' }, { title: 'Total Responses', value: '342', color: 'green' }, { title: 'Avg Rating', value: '"4.2/5"', color: '#b30537' }, { title: 'Pending Reviews', value: '12', color: 'orange' }],
  'Recent Feedback', 'feedbackForms',
  `{ field: 'title', headerName: 'Form', flex: 1.2, minWidth: 150 }, { field: 'target', headerName: 'Target', flex: 0.7, minWidth: 90 }, { field: 'period', headerName: 'Period', flex: 0.7, minWidth: 90 }`);

pages['src/pages/agents/FeedbackEntry.jsx'] = formPage('Feedback Form Entry', `${agBC}, { label: 'Feedback Entry' }`, 'feedbackResponses', `
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Form" value={form.formTitle || ''} onChange={e => handleChange('formTitle', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Respondent" value={form.respondent || ''} onChange={e => handleChange('respondent', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Overall Rating" value={form.overallRating || ''} onChange={e => handleChange('overallRating', e.target.value)} size="small"><MenuItem value="1">1</MenuItem><MenuItem value="2">2</MenuItem><MenuItem value="3">3</MenuItem><MenuItem value="4">4</MenuItem><MenuItem value="5">5</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Comments" value={form.comments || ''} onChange={e => handleChange('comments', e.target.value)} multiline rows={3} size="small" /></Grid>`);

pages['src/pages/agents/AlumniManagement.jsx'] = searchPage('Alumni Management', `${agBC}, { label: 'Alumni' }`, 'alumni',
  `{ name: 'name', label: 'Name', type: 'text', gridSize: 3 }, { name: 'program', label: 'Program', type: 'text', gridSize: 3 }, { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], gridSize: 2 }`,
  `{ field: 'name', headerName: 'Name', flex: 1.2, minWidth: 150 }, { field: 'studentCode', headerName: 'Code', flex: 0.7, minWidth: 90 }, { field: 'program', headerName: 'Program', flex: 0.8, minWidth: 100 }, { field: 'graduationYear', headerName: 'Grad Year', flex: 0.6, minWidth: 80 }, { field: 'email', headerName: 'Email', flex: 1, minWidth: 130 }, { field: 'employer', headerName: 'Employer', flex: 1, minWidth: 130 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`,
  `{ name: 'name', label: 'Name', type: 'text', required: true }, { name: 'studentCode', label: 'Student Code', type: 'text' }, { name: 'program', label: 'Program', type: 'text' }, { name: 'graduationYear', label: 'Graduation Year', type: 'text' }, { name: 'email', label: 'Email', type: 'text' }, { name: 'phone', label: 'Phone', type: 'text' }, { name: 'employer', label: 'Current Employer', type: 'text' }, { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] }`);

pages['src/pages/agents/AlumniApprovals.jsx'] = searchPage('Alumni Approvals', `${agBC}, { label: 'Alumni Approvals' }`, 'alumni',
  `{ name: 'name', label: 'Name', type: 'text', gridSize: 3 }, { name: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Rejected'], gridSize: 2 }`,
  `{ field: 'name', headerName: 'Name', flex: 1.2, minWidth: 150 }, { field: 'program', headerName: 'Program', flex: 0.8, minWidth: 100 }, { field: 'graduationYear', headerName: 'Grad Year', flex: 0.6, minWidth: 80 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

pages['src/pages/agents/LessonPlanDashboard.jsx'] = dashboardPage('LessonPlan Dashboard', `${agBC}, { label: 'LessonPlan Dashboard' }`,
  [{ title: 'Total Plans', value: 'data.length || 0', color: '#2B4D83' }, { title: 'Active', value: '8', color: 'green' }, { title: 'Pending Review', value: '3', color: 'orange' }, { title: 'Coverage', value: '"85%"', color: '#b30537' }],
  'Lesson Plans', 'lessonPlans',
  `{ field: 'module', headerName: 'Module', flex: 1.2, minWidth: 150 }, { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

pages['src/pages/agents/LessonPlan.jsx'] = formPage('LessonPlan', `${agBC}, { label: 'LessonPlan' }`, 'lessonPlans', `
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Module" value={form.module || ''} onChange={e => handleChange('module', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Instructor" value={form.instructor || ''} onChange={e => handleChange('instructor', e.target.value)} required size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Term" value={form.term || ''} onChange={e => handleChange('term', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Week" value={form.week || ''} onChange={e => handleChange('week', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Topic" value={form.topic || ''} onChange={e => handleChange('topic', e.target.value)} size="small" /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Learning Objectives" value={form.objectives || ''} onChange={e => handleChange('objectives', e.target.value)} multiline rows={2} size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Hours" value={form.hours || ''} onChange={e => handleChange('hours', e.target.value)} type="number" size="small" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth select label="Status" value={form.status || ''} onChange={e => handleChange('status', e.target.value)} size="small"><MenuItem value="Draft">Draft</MenuItem><MenuItem value="Submitted">Submitted</MenuItem><MenuItem value="Approved">Approved</MenuItem></TextField></Grid>`);

pages['src/pages/agents/LessonPlanStatus.jsx'] = simpleReportPage('LessonPlan Status', `${agBC}, { label: 'LessonPlan Status' }`, 'lessonPlans',
  `{ name: 'module', label: 'Module', type: 'text', gridSize: 3 }, { name: 'instructor', label: 'Instructor', type: 'text', gridSize: 3 }`,
  `{ field: 'module', headerName: 'Module', flex: 1.2, minWidth: 150 }, { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

pages['src/pages/agents/LessonPlanCoverage.jsx'] = simpleReportPage('LessonPlan Coverage Report', `${agBC}, { label: 'Coverage Report' }`, 'lessonPlans',
  `{ name: 'module', label: 'Module', type: 'text', gridSize: 3 }`,
  `{ field: 'module', headerName: 'Module', flex: 1.2, minWidth: 150 }, { field: 'instructor', headerName: 'Instructor', flex: 1, minWidth: 130 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

pages['src/pages/agents/LessonPlanTeachers.jsx'] = simpleReportPage('LessonPlan Teachers Report', `${agBC}, { label: 'Teachers Report' }`, 'employees',
  `{ name: 'name', label: 'Instructor', type: 'text', gridSize: 3 }`,
  `{ field: 'name', headerName: 'Instructor', flex: 1.2, minWidth: 150 }, { field: 'department', headerName: 'Department', flex: 0.8, minWidth: 110 }, { field: 'designation', headerName: 'Designation', flex: 0.8, minWidth: 110 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

pages['src/pages/agents/InstructorTimetable.jsx'] = `import React, { useState, useMemo } from 'react';
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
`;

// ====== SYSTEM PAGES ======
const sysBC = `{ label: 'System', path: '/system' }`;

pages['src/pages/system/UploadedDocsLog.jsx'] = simpleReportPage('Uploaded Docs Log', `${sysBC}, { label: 'Uploaded Docs Log' }`, 'documents',
  `{ name: 'documentType', label: 'Type', type: 'text', gridSize: 3 }, { name: 'status', label: 'Status', type: 'select', options: ['Verified', 'Pending', 'Received'], gridSize: 2 }`,
  `{ field: 'studentName', headerName: 'Uploaded For', flex: 1.2, minWidth: 150 }, { field: 'documentType', headerName: 'Type', flex: 0.8, minWidth: 100 }, { field: 'uploadDate', headerName: 'Upload Date', flex: 0.8, minWidth: 110 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

pages['src/pages/system/SystemUsageLogs.jsx'] = simpleReportPage('System Usage Logs', `${sysBC}, { label: 'Usage Logs' }`, 'auditTrail',
  `{ name: 'user', label: 'User', type: 'text', gridSize: 3 }, { name: 'action', label: 'Action', type: 'select', options: ['Login', 'Create', 'Update', 'Delete', 'View', 'Export'], gridSize: 2 }`,
  `{ field: 'timestamp', headerName: 'Timestamp', flex: 1, minWidth: 150 }, { field: 'user', headerName: 'User', flex: 0.8, minWidth: 110 }, { field: 'action', headerName: 'Action', flex: 0.6, minWidth: 90 }, { field: 'target', headerName: 'Target', flex: 1, minWidth: 130 }, { field: 'details', headerName: 'Details', flex: 1.5, minWidth: 200 }, { field: 'ipAddress', headerName: 'IP', flex: 0.7, minWidth: 100 }`);

pages['src/pages/system/BlacklistedEmails.jsx'] = searchPage('Blacklisted Emails', `${sysBC}, { label: 'Blacklisted Emails' }`, 'blacklistedEmails',
  `{ name: 'email', label: 'Email', type: 'text', gridSize: 4 }`,
  `{ field: 'email', headerName: 'Email', flex: 1.5, minWidth: 200 }, { field: 'reason', headerName: 'Reason', flex: 1.2, minWidth: 150 }, { field: 'addedBy', headerName: 'Added By', flex: 0.8, minWidth: 110 }, { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 100 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`,
  `{ name: 'email', label: 'Email', type: 'text', required: true, fullWidth: true }, { name: 'reason', label: 'Reason', type: 'textarea', fullWidth: true }, { name: 'status', label: 'Status', type: 'select', options: ['Active', 'Removed'] }`);

pages['src/pages/system/BuildTree.jsx'] = simpleReportPage('Build Tree', `${sysBC}, { label: 'Build Tree' }`, 'modules',
  `{ name: 'name', label: 'Module', type: 'text', gridSize: 3 }`,
  `{ field: 'name', headerName: 'Module', flex: 1.5, minWidth: 200 }, { field: 'code', headerName: 'Code', flex: 0.7, minWidth: 90 }, { field: 'program', headerName: 'Program', flex: 0.8, minWidth: 100 }, { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90, renderCell: (p) => <StatusChip status={p.value} /> }`);

pages['src/pages/system/InvalidateCache.jsx'] = `import React, { useState } from 'react';
import { Box, Paper, Typography, Button, TextField, MenuItem, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import CachedIcon from '@mui/icons-material/Cached';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import { v4 as uuidv4 } from 'uuid';

const breadcrumbs = [{ label: 'System', path: '/system' }, { label: 'Invalidate Cache' }];

export default function InvalidateCache() {
  const { enqueueSnackbar } = useSnackbar();
  const [type, setType] = useState('All');
  const [history, setHistory] = useState([]);

  const handleInvalidate = () => {
    setHistory(prev => [...prev, { id: uuidv4(), date: new Date().toISOString(), type, scope: 'All', triggeredBy: 'Admin', status: 'Completed' }]);
    enqueueSnackbar('Cache invalidated successfully', { variant: 'success' });
  };

  const columns = [
    { field: 'date', headerName: 'Date', flex: 1.2, minWidth: 160 },
    { field: 'type', headerName: 'Type', flex: 0.8, minWidth: 100 },
    { field: 'scope', headerName: 'Scope', flex: 0.6, minWidth: 80 },
    { field: 'triggeredBy', headerName: 'By', flex: 0.7, minWidth: 90 },
    { field: 'status', headerName: 'Status', flex: 0.6, minWidth: 90 },
  ];

  return (
    <Box>
      <PageHeader title="Invalidate Resource Cache" breadcrumbs={breadcrumbs} />
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth select label="Resource Type" value={type} onChange={e => setType(e.target.value)} size="small"><MenuItem value="All">All</MenuItem><MenuItem value="Templates">Templates</MenuItem><MenuItem value="Reports">Reports</MenuItem><MenuItem value="Data">Data</MenuItem></TextField></Grid>
          <Grid size={{ xs: 12, sm: 3 }}><Button variant="contained" startIcon={<CachedIcon />} onClick={handleInvalidate} sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Invalidate Cache</Button></Grid>
        </Grid>
      </Paper>
      {history.length > 0 && <DataTable rows={history} columns={columns} exportFilename="cache-history" />}
    </Box>
  );
}
`;

pages['src/pages/system/CWUsageReport.jsx'] = simpleReportPage('Usage Report', `${sysBC}, { label: 'Usage Report' }`, 'auditTrail',
  `{ name: 'user', label: 'User', type: 'text', gridSize: 3 }, { name: 'action', label: 'Action', type: 'text', gridSize: 3 }`,
  `{ field: 'action', headerName: 'Feature', flex: 0.8, minWidth: 100 }, { field: 'target', headerName: 'Module', flex: 1, minWidth: 130 }, { field: 'user', headerName: 'User', flex: 0.8, minWidth: 110 }, { field: 'timestamp', headerName: 'Last Used', flex: 1, minWidth: 150 }`);

pages['src/pages/system/CustomSettings.jsx'] = `import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import Grid from '@mui/material/Grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';

const breadcrumbs = [{ label: 'System', path: '/system' }, { label: 'Custom Settings' }];

const defaultSettings = {
  general: { institutionName: 'PSB Academy', address: '6 Raffles Boulevard, Marina Square, Singapore 039594', contactEmail: 'info@psb.edu.sg', contactPhone: '+65 6355 1188' },
  academic: { gradingSystem: 'GPA 4.0', passPercentage: '50', maxCredits: '24', academicYear: '2025-2026' },
  finance: { taxRate: '7', currency: 'SGD', paymentGateway: 'Flywire', lateFeePercentage: '5' },
  notifications: { emailEnabled: 'Yes', smsEnabled: 'Yes', reminderDays: '7' },
};

export default function CustomSettings() {
  const { enqueueSnackbar } = useSnackbar();
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('sms_settings') || JSON.stringify(defaultSettings)));

  const handleChange = (group, key, value) => setSettings(prev => ({ ...prev, [group]: { ...prev[group], [key]: value } }));
  const handleSave = () => { localStorage.setItem('sms_settings', JSON.stringify(settings)); enqueueSnackbar('Settings saved', { variant: 'success' }); };

  const groups = [
    { key: 'general', title: 'General Settings', fields: [{ key: 'institutionName', label: 'Institution Name' }, { key: 'address', label: 'Address' }, { key: 'contactEmail', label: 'Contact Email' }, { key: 'contactPhone', label: 'Contact Phone' }] },
    { key: 'academic', title: 'Academic Settings', fields: [{ key: 'gradingSystem', label: 'Grading System' }, { key: 'passPercentage', label: 'Pass Percentage' }, { key: 'maxCredits', label: 'Max Credits Per Term' }, { key: 'academicYear', label: 'Academic Year' }] },
    { key: 'finance', title: 'Finance Settings', fields: [{ key: 'taxRate', label: 'Tax Rate (%)' }, { key: 'currency', label: 'Currency' }, { key: 'paymentGateway', label: 'Payment Gateway' }, { key: 'lateFeePercentage', label: 'Late Fee (%)' }] },
    { key: 'notifications', title: 'Notification Settings', fields: [{ key: 'emailEnabled', label: 'Email Enabled' }, { key: 'smsEnabled', label: 'SMS Enabled' }, { key: 'reminderDays', label: 'Reminder Days Before Due' }] },
  ];

  return (
    <Box>
      <PageHeader title="Custom Settings" breadcrumbs={breadcrumbs} />
      {groups.map(g => (
        <Accordion key={g.key} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 600 }}>{g.title}</Typography></AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {g.fields.map(f => (
                <Grid size={{ xs: 12, sm: 6 }} key={f.key}><TextField fullWidth label={f.label} value={settings[g.key]?.[f.key] || ''} onChange={e => handleChange(g.key, f.key, e.target.value)} size="small" /></Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
      <Box sx={{ mt: 2 }}><Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}>Save All Settings</Button></Box>
    </Box>
  );
}
`;

// Write all files
let count = 0;
for (const [path, content] of Object.entries(pages)) {
  const fullPath = `src/${path.startsWith('src/') ? path.slice(4) : path}`;
  const absPath = fullPath;
  ensureDir(absPath);
  writeFileSync(absPath, content);
  count++;
}

console.log(`Created ${count} page files successfully.`);