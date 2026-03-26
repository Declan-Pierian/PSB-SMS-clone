import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Paper, Typography, Button, Alert, Divider, Chip, Card, CardContent,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PageHeader from '../../components/common/PageHeader';
import FileUpload from '../../components/common/FileUpload';
import DataTable from '../../components/common/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import storageService from '../../services/storageService';
import { useSnackbar } from 'notistack';

const generateStudentId = () => {
  const year = new Date().getFullYear().toString().slice(-2);
  const seq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
  return `ENQ${year}${seq}`;
};

const parseCSV = (text) => {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index] || '';
    });
    return obj;
  }).filter((row) => Object.values(row).some((v) => v));
};

const mapToStudent = (row) => {
  const name = row.name || row.Name || row.fullName || row.full_name ||
    `${row.firstName || row.first_name || ''} ${row.lastName || row.last_name || ''}`.trim();
  return {
    studentId: generateStudentId(),
    name: name || 'Unknown',
    email: row.email || row.Email || row.emailAddress || '',
    phone: row.phone || row.Phone || row.phoneNumber || row.mobile || '',
    program: row.program || row.Program || row.course || row.Course || '',
    intake: row.intake || row.Intake || '',
    nationality: row.nationality || row.Nationality || row.country || '',
    status: 'New Enquiry',
    enquiryDate: new Date().toISOString().split('T')[0],
    enrollmentDate: '',
    source: row.source || row.Source || 'File Import',
    remarks: row.remarks || row.Remarks || row.notes || '',
  };
};

export default function EnquiryImport() {
  const { enqueueSnackbar } = useSnackbar();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [importConfirmOpen, setImportConfirmOpen] = useState(false);
  const [recentImports, setRecentImports] = useState([]);
  const [importResult, setImportResult] = useState(null);

  const loadRecentImports = useCallback(() => {
    setRecentImports(storageService.getAll('enquiryImports'));
  }, []);

  useEffect(() => {
    loadRecentImports();
  }, [loadRecentImports]);

  const handleFilesChange = (files) => {
    setUploadedFiles(files);
    setPreviewData([]);
    setImportResult(null);

    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          let parsedData;

          if (file.name.endsWith('.json')) {
            const json = JSON.parse(text);
            parsedData = Array.isArray(json) ? json : [json];
          } else {
            parsedData = parseCSV(text);
          }

          const mapped = parsedData.map(mapToStudent);
          setPreviewData(mapped);
          enqueueSnackbar(`${mapped.length} records parsed from file`, { variant: 'info' });
        } catch {
          enqueueSnackbar('Error parsing file. Please check the format.', { variant: 'error' });
          setPreviewData([]);
        }
      };
      reader.readAsText(file);
    }
  };

  const previewColumns = [
    { field: 'studentId', headerName: 'Generated ID', width: 130 },
    { field: 'name', headerName: 'Name', width: 180, flex: 1 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 130 },
    { field: 'program', headerName: 'Program', width: 150 },
    { field: 'nationality', headerName: 'Nationality', width: 120 },
    { field: 'source', headerName: 'Source', width: 120 },
  ];

  const importHistoryColumns = [
    { field: 'importDate', headerName: 'Import Date', width: 150 },
    { field: 'fileName', headerName: 'File Name', width: 200, flex: 1 },
    { field: 'totalRecords', headerName: 'Records', width: 100 },
    { field: 'successCount', headerName: 'Success', width: 100 },
    { field: 'failCount', headerName: 'Failed', width: 100 },
    { field: 'importedBy', headerName: 'Imported By', width: 150 },
  ];

  const handleImportClick = () => {
    if (previewData.length === 0) {
      enqueueSnackbar('No data to import. Please upload a file first.', { variant: 'warning' });
      return;
    }
    setImportConfirmOpen(true);
  };

  const handleImport = () => {
    let successCount = 0;
    let failCount = 0;

    previewData.forEach((student) => {
      try {
        storageService.create('students', student);
        successCount++;
      } catch {
        failCount++;
      }
    });

    // Record the import history
    const importRecord = {
      importDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
      fileName: uploadedFiles[0]?.name || 'Unknown',
      totalRecords: previewData.length,
      successCount,
      failCount,
      importedBy: 'Current User',
    };
    storageService.create('enquiryImports', importRecord);

    setImportResult({
      type: failCount === 0 ? 'success' : 'warning',
      message: `Import completed: ${successCount} enquiries created, ${failCount} failed out of ${previewData.length} total records.`,
    });

    enqueueSnackbar(`${successCount} enquiries imported successfully`, { variant: 'success' });
    setImportConfirmOpen(false);
    setPreviewData([]);
    setUploadedFiles([]);
    loadRecentImports();
  };

  return (
    <Box>
      <PageHeader
        title="Enquiry Import"
        breadcrumbs={[
          { label: 'Students', path: '/students/search' },
          { label: 'Enquiry Import' },
        ]}
      />

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 2.5, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <UploadFileIcon sx={{ color: '#b30537' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
                Upload Enquiry File
              </Typography>
            </Box>

            <FileUpload
              accept=".csv,.json,.xlsx"
              multiple={false}
              label="Upload CSV or JSON file with enquiry data"
              onFilesChange={handleFilesChange}
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
                Accepted formats: CSV, JSON
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                Required columns: name (or firstName + lastName), email, phone
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                Optional columns: program, intake, nationality, source, remarks
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Card variant="outlined" sx={{ backgroundColor: '#f8f9fa' }}>
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Sample CSV Format</Typography>
                <Typography variant="caption" sx={{ fontFamily: 'monospace', whiteSpace: 'pre-line', color: '#555' }}>
                  {`name,email,phone,program,nationality\nJohn Doe,john@email.com,+6591234567,BSc IT,Singapore\nJane Smith,jane@email.com,+6598765432,MBA,Malaysia`}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
                Preview ({previewData.length} records)
              </Typography>
              {previewData.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label={`${previewData.length} ready to import`}
                    color="success"
                    variant="outlined"
                    size="small"
                  />
                  <Button
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    onClick={handleImportClick}
                    sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}
                  >
                    Import All
                  </Button>
                </Box>
              )}
            </Box>

            {importResult && (
              <Alert severity={importResult.type} onClose={() => setImportResult(null)} sx={{ mb: 2 }}>
                {importResult.message}
              </Alert>
            )}

            {previewData.length > 0 ? (
              <DataTable
                rows={previewData}
                columns={previewColumns}
                getRowId={(row) => row.studentId}
                exportFilename="enquiry_preview"
                pageSize={5}
              />
            ) : (
              <Box sx={{ textAlign: 'center', py: 6, color: '#999' }}>
                <UploadFileIcon sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="body2">Upload a file to preview enquiry data</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2.5, mt: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <HistoryIcon sx={{ color: '#b30537' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
            Recent Imports
          </Typography>
        </Box>

        {recentImports.length > 0 ? (
          <DataTable
            rows={recentImports}
            columns={importHistoryColumns}
            exportFilename="import_history"
            pageSize={5}
          />
        ) : (
          <Box sx={{ textAlign: 'center', py: 4, color: '#999' }}>
            <Typography variant="body2">No import history available</Typography>
          </Box>
        )}
      </Paper>

      <ConfirmDialog
        open={importConfirmOpen}
        title="Confirm Enquiry Import"
        message={`You are about to import ${previewData.length} enquiry records as new students with status "New Enquiry". Proceed?`}
        onConfirm={handleImport}
        onCancel={() => setImportConfirmOpen(false)}
        confirmLabel="Import"
        severity="info"
      />
    </Box>
  );
}
