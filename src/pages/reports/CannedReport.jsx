import React, { useState } from 'react';
import {
  Box, Card, CardContent, CardActionArea, Typography, Chip, IconButton, Tooltip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchoolIcon from '@mui/icons-material/School';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import BadgeIcon from '@mui/icons-material/Badge';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSnackbar } from 'notistack';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/common/DataTable';
import StatusChip from '../../components/common/StatusChip';
import storageService from '../../services/storageService';

const reportTemplates = [
  {
    id: 'student_enrollment',
    name: 'Student Enrollment Report',
    description: 'Overview of all student enrollments by program and status',
    icon: PeopleIcon,
    color: '#b30537',
    storageKey: 'students',
    columns: [
      { field: 'studentId', headerName: 'Student ID', flex: 1, minWidth: 110 },
      { field: 'name', headerName: 'Name', flex: 1.5, minWidth: 150, valueGetter: (value, row) => row.name || `${row.firstName || ''} ${row.lastName || ''}`.trim() || '-' },
      { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 180 },
      { field: 'program', headerName: 'Program', flex: 1.2, minWidth: 130, valueGetter: (value, row) => row.programName || row.program || '-' },
      { field: 'enrollmentDate', headerName: 'Enrolled On', flex: 1, minWidth: 120, valueGetter: (value, row) => row.enrollmentDate || row.createdAt?.split('T')[0] || '-' },
      { field: 'status', headerName: 'Status', flex: 1, minWidth: 110, renderCell: (params) => <StatusChip status={params.value || 'Active'} /> },
    ],
  },
  {
    id: 'fee_collection',
    name: 'Fee Collection Report',
    description: 'Summary of all fees collected and outstanding payments',
    icon: PaymentIcon,
    color: '#2e7d32',
    storageKey: 'payments',
    columns: [
      { field: 'receiptNo', headerName: 'Receipt No.', flex: 1, minWidth: 110, valueGetter: (value, row) => row.receiptNo || row.paymentId || row.id?.slice(0, 8) },
      { field: 'studentName', headerName: 'Student', flex: 1.3, minWidth: 140, valueGetter: (value, row) => row.studentName || row.student || '-' },
      { field: 'amount', headerName: 'Amount', flex: 0.8, minWidth: 100, valueGetter: (value, row) => `$${parseFloat(row.amount || 0).toFixed(2)}` },
      { field: 'paymentDate', headerName: 'Date', flex: 1, minWidth: 110, valueGetter: (value, row) => row.paymentDate || row.date || row.createdAt?.split('T')[0] || '-' },
      { field: 'method', headerName: 'Method', flex: 0.9, minWidth: 100, valueGetter: (value, row) => row.method || row.paymentMethod || '-' },
      { field: 'status', headerName: 'Status', flex: 0.9, minWidth: 100, renderCell: (params) => <StatusChip status={params.value || 'Paid'} /> },
    ],
  },
  {
    id: 'attendance_summary',
    name: 'Attendance Summary Report',
    description: 'Attendance statistics across programs and cohorts',
    icon: EventAvailableIcon,
    color: '#1565c0',
    storageKey: 'attendance',
    columns: [
      { field: 'studentId', headerName: 'Student ID', flex: 1, minWidth: 110 },
      { field: 'studentName', headerName: 'Name', flex: 1.3, minWidth: 140, valueGetter: (value, row) => row.studentName || row.name || '-' },
      { field: 'module', headerName: 'Module', flex: 1.2, minWidth: 130, valueGetter: (value, row) => row.module || row.moduleName || '-' },
      { field: 'date', headerName: 'Date', flex: 1, minWidth: 110, valueGetter: (value, row) => row.date || row.attendanceDate || '-' },
      { field: 'present', headerName: 'Present', flex: 0.7, minWidth: 80, valueGetter: (value, row) => row.present ? 'Yes' : 'No' },
      { field: 'status', headerName: 'Status', flex: 0.9, minWidth: 100, renderCell: (params) => <StatusChip status={params.value || (params.row.present ? 'Active' : 'Inactive')} /> },
    ],
  },
  {
    id: 'academic_performance',
    name: 'Academic Performance Report',
    description: 'Student academic results and grade distribution',
    icon: AssessmentIcon,
    color: '#7b1fa2',
    storageKey: 'test_results',
    columns: [
      { field: 'studentId', headerName: 'Student ID', flex: 1, minWidth: 110 },
      { field: 'studentName', headerName: 'Name', flex: 1.3, minWidth: 140, valueGetter: (value, row) => row.studentName || row.name || '-' },
      { field: 'testName', headerName: 'Test', flex: 1.2, minWidth: 130, valueGetter: (value, row) => row.testName || row.test || '-' },
      { field: 'score', headerName: 'Score', flex: 0.7, minWidth: 80, valueGetter: (value, row) => row.score || row.marks || '-' },
      { field: 'maxMarks', headerName: 'Max Marks', flex: 0.7, minWidth: 90, valueGetter: (value, row) => row.maxMarks || row.totalMarks || '100' },
      { field: 'grade', headerName: 'Grade', flex: 0.6, minWidth: 70, valueGetter: (value, row) => row.grade || '-' },
      { field: 'percentage', headerName: 'Percentage', flex: 0.8, minWidth: 100, valueGetter: (value, row) => {
        const score = parseFloat(row.score || row.marks || 0);
        const max = parseFloat(row.maxMarks || row.totalMarks || 100);
        return max > 0 ? `${((score / max) * 100).toFixed(1)}%` : '-';
      }},
    ],
  },
  {
    id: 'program_summary',
    name: 'Program Summary Report',
    description: 'Summary statistics for all programs',
    icon: SchoolIcon,
    color: '#e65100',
    storageKey: 'programs',
    columns: [
      { field: 'code', headerName: 'Code', flex: 0.8, minWidth: 90, valueGetter: (value, row) => row.code || row.programCode || '-' },
      { field: 'name', headerName: 'Program Name', flex: 1.5, minWidth: 180, valueGetter: (value, row) => row.name || row.programName || '-' },
      { field: 'duration', headerName: 'Duration', flex: 0.8, minWidth: 90, valueGetter: (value, row) => row.duration || '-' },
      { field: 'fee', headerName: 'Fee', flex: 0.8, minWidth: 90, valueGetter: (value, row) => row.fee ? `$${row.fee}` : '-' },
      { field: 'status', headerName: 'Status', flex: 0.9, minWidth: 100, renderCell: (params) => <StatusChip status={params.value || 'Active'} /> },
    ],
  },
  {
    id: 'invoice_report',
    name: 'Invoice Report',
    description: 'All generated invoices and their current status',
    icon: ReceiptIcon,
    color: '#00695c',
    storageKey: 'invoices',
    columns: [
      { field: 'invoiceNo', headerName: 'Invoice No.', flex: 1, minWidth: 120, valueGetter: (value, row) => row.invoiceNo || row.invoiceNumber || row.id?.slice(0, 8) },
      { field: 'studentName', headerName: 'Student', flex: 1.3, minWidth: 140, valueGetter: (value, row) => row.studentName || row.student || '-' },
      { field: 'amount', headerName: 'Amount', flex: 0.8, minWidth: 100, valueGetter: (value, row) => `$${parseFloat(row.amount || row.totalAmount || 0).toFixed(2)}` },
      { field: 'dueDate', headerName: 'Due Date', flex: 1, minWidth: 110, valueGetter: (value, row) => row.dueDate || '-' },
      { field: 'status', headerName: 'Status', flex: 0.9, minWidth: 100, renderCell: (params) => <StatusChip status={params.value || 'Generated'} /> },
    ],
  },
  {
    id: 'ticket_report',
    name: 'Support Tickets Report',
    description: 'Overview of all support tickets and resolution status',
    icon: SupportAgentIcon,
    color: '#ad1457',
    storageKey: 'tickets',
    columns: [
      { field: 'ticketId', headerName: 'Ticket ID', flex: 0.8, minWidth: 100, valueGetter: (value, row) => row.ticketId || row.id?.slice(0, 8) },
      { field: 'subject', headerName: 'Subject', flex: 1.5, minWidth: 160, valueGetter: (value, row) => row.subject || row.title || '-' },
      { field: 'studentName', headerName: 'Raised By', flex: 1.2, minWidth: 130, valueGetter: (value, row) => row.studentName || row.raisedBy || '-' },
      { field: 'category', headerName: 'Category', flex: 1, minWidth: 110 },
      { field: 'priority', headerName: 'Priority', flex: 0.8, minWidth: 90 },
      { field: 'status', headerName: 'Status', flex: 0.9, minWidth: 100, renderCell: (params) => <StatusChip status={params.value || 'Open'} /> },
    ],
  },
  {
    id: 'employee_report',
    name: 'Employee Report',
    description: 'Employee roster and department-wise listing',
    icon: BadgeIcon,
    color: '#37474f',
    storageKey: 'employees',
    columns: [
      { field: 'employeeId', headerName: 'Employee ID', flex: 1, minWidth: 110, valueGetter: (value, row) => row.employeeId || row.empId || row.id?.slice(0, 8) },
      { field: 'name', headerName: 'Name', flex: 1.3, minWidth: 140, valueGetter: (value, row) => row.name || `${row.firstName || ''} ${row.lastName || ''}`.trim() || '-' },
      { field: 'department', headerName: 'Department', flex: 1, minWidth: 120 },
      { field: 'designation', headerName: 'Designation', flex: 1, minWidth: 120, valueGetter: (value, row) => row.designation || row.role || '-' },
      { field: 'email', headerName: 'Email', flex: 1.3, minWidth: 160 },
      { field: 'status', headerName: 'Status', flex: 0.9, minWidth: 100, renderCell: (params) => <StatusChip status={params.value || 'Active'} /> },
    ],
  },
];

export default function CannedReport() {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState([]);

  const handleSelectReport = (report) => {
    const data = storageService.getAll(report.storageKey);
    setReportData(data);
    setSelectedReport(report);
    enqueueSnackbar(`${report.name} generated with ${data.length} records`, { variant: 'success' });
  };

  const handleBack = () => {
    setSelectedReport(null);
    setReportData([]);
  };

  return (
    <Box>
      <PageHeader
        title="Canned Reports"
        breadcrumbs={[
          { label: 'Reports', path: '/reports' },
          { label: 'Canned Reports' },
        ]}
        action={selectedReport ? (
          <Tooltip title="Back to Report List">
            <IconButton onClick={handleBack} sx={{ color: '#b30537' }}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      />

      {!selectedReport ? (
        <Grid container spacing={2.5}>
          {reportTemplates.map((report) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={report.id}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
                }}
              >
                <CardActionArea onClick={() => handleSelectReport(report)} sx={{ height: '100%', p: 2 }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 56, height: 56, borderRadius: '14px',
                        backgroundColor: `${report.color}15`, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <report.icon sx={{ color: report.color, fontSize: 30 }} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {report.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {report.description}
                    </Typography>
                    <Chip
                      label={`Source: ${report.storageKey}`}
                      size="small"
                      sx={{ mt: 0.5, fontSize: '0.72rem' }}
                    />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handleBack} size="small">
              <ArrowBackIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <selectedReport.icon sx={{ color: selectedReport.color, fontSize: 24 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {selectedReport.name}
              </Typography>
              <Chip label={`${reportData.length} records`} size="small" color="primary" />
            </Box>
          </Box>
          <DataTable
            rows={reportData}
            columns={selectedReport.columns}
            exportFilename={selectedReport.id}
            pageSize={10}
          />
        </Box>
      )}
    </Box>
  );
}
