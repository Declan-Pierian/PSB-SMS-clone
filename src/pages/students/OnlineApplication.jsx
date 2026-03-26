import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Typography, TextField, MenuItem, Button, Stepper, Step, StepLabel,
  Card, CardContent, Divider, List, ListItem, ListItemIcon, ListItemText,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PageHeader from '../../components/common/PageHeader';
import FileUpload from '../../components/common/FileUpload';
import storageService from '../../services/storageService';
import { useSnackbar } from 'notistack';
import { COUNTRIES } from '../../data/constants';

const steps = ['Personal Information', 'Program Selection', 'Document Upload', 'Review & Submit'];
const stepIcons = [PersonIcon, SchoolIcon, DescriptionIcon, CheckCircleIcon];

const REQUIRED_DOCUMENTS = [
  { key: 'passport', label: 'Passport Copy', accept: 'image/*,.pdf' },
  { key: 'transcripts', label: 'Academic Transcripts', accept: '.pdf,.doc,.docx' },
  { key: 'englishProficiency', label: 'English Proficiency Certificate', accept: '.pdf,.doc,.docx' },
  { key: 'photo', label: 'Passport-size Photo', accept: 'image/*' },
  { key: 'sop', label: 'Statement of Purpose', accept: '.pdf,.doc,.docx' },
];

const generateStudentId = () => {
  const year = new Date().getFullYear().toString().slice(-2);
  const seq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
  return `STU${year}${seq}`;
};

export default function OnlineApplication() {
  const { enqueueSnackbar } = useSnackbar();
  const [activeStep, setActiveStep] = useState(0);
  const [programs, setPrograms] = useState([]);
  const [intakes, setIntakes] = useState([]);
  const [documents, setDocuments] = useState({});
  const [errors, setErrors] = useState({});

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    passportNumber: '',
    gender: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const [programSelection, setProgramSelection] = useState({
    programId: '',
    programName: '',
    intakeId: '',
    intakeName: '',
    studyMode: '',
  });

  useEffect(() => {
    setPrograms(storageService.getAll('programs'));
    setIntakes(storageService.getAll('intakes'));
  }, []);

  const handlePersonalChange = (field, value) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleProgramChange = (field, value) => {
    setProgramSelection((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'programId') {
        const prog = programs.find((p) => p.id === value);
        updated.programName = prog ? prog.name || prog.programName || '' : '';
      }
      if (field === 'intakeId') {
        const intake = intakes.find((i) => i.id === value);
        updated.intakeName = intake ? intake.name || intake.intakeName || '' : '';
      }
      return updated;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleDocumentUpload = (key, files) => {
    setDocuments((prev) => ({ ...prev, [key]: files }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 0) {
      if (!personalInfo.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!personalInfo.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!personalInfo.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) newErrors.email = 'Invalid email format';
      if (!personalInfo.phone.trim()) newErrors.phone = 'Phone is required';
      if (!personalInfo.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!personalInfo.nationality) newErrors.nationality = 'Nationality is required';
      if (!personalInfo.passportNumber.trim()) newErrors.passportNumber = 'Passport number is required';
      if (!personalInfo.gender) newErrors.gender = 'Gender is required';
    }

    if (step === 1) {
      if (!programSelection.programId) newErrors.programId = 'Please select a program';
      if (!programSelection.intakeId) newErrors.intakeId = 'Please select an intake';
      if (!programSelection.studyMode) newErrors.studyMode = 'Please select study mode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    } else {
      enqueueSnackbar('Please fill in all required fields', { variant: 'warning' });
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    const studentId = generateStudentId();
    const studentName = `${personalInfo.firstName} ${personalInfo.lastName}`;

    const studentData = {
      studentId,
      name: studentName,
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      email: personalInfo.email,
      phone: personalInfo.phone,
      dateOfBirth: personalInfo.dateOfBirth,
      nationality: personalInfo.nationality,
      passportNumber: personalInfo.passportNumber,
      gender: personalInfo.gender,
      address: personalInfo.address,
      emergencyContact: personalInfo.emergencyContact,
      emergencyPhone: personalInfo.emergencyPhone,
      program: programSelection.programName,
      programId: programSelection.programId,
      intake: programSelection.intakeName,
      intakeId: programSelection.intakeId,
      studyMode: programSelection.studyMode,
      status: 'Active',
      enrollmentDate: new Date().toISOString().split('T')[0],
      applicationDate: new Date().toISOString().split('T')[0],
    };

    storageService.create('students', studentData);

    // Create document records for uploaded files
    Object.entries(documents).forEach(([docKey, files]) => {
      if (files && files.length > 0) {
        const docType = REQUIRED_DOCUMENTS.find((d) => d.key === docKey);
        files.forEach((file) => {
          storageService.create('documents', {
            studentId,
            studentName,
            documentType: docType?.label || docKey,
            fileName: file.name,
            fileSize: file.size,
            uploadDate: new Date().toISOString().split('T')[0],
            status: 'Pending',
            remarks: '',
          });
        });
      }
    });

    enqueueSnackbar(`Application submitted successfully! Student ID: ${studentId}`, { variant: 'success' });

    // Reset form
    setActiveStep(0);
    setPersonalInfo({
      firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '',
      nationality: '', passportNumber: '', gender: '', address: '',
      emergencyContact: '', emergencyPhone: '',
    });
    setProgramSelection({ programId: '', programName: '', intakeId: '', intakeName: '', studyMode: '' });
    setDocuments({});
    setErrors({});
  };

  const renderPersonalInfo = () => (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
          Applicant Details
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="First Name" value={personalInfo.firstName} onChange={(e) => handlePersonalChange('firstName', e.target.value)} required size="small" error={!!errors.firstName} helperText={errors.firstName} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Last Name" value={personalInfo.lastName} onChange={(e) => handlePersonalChange('lastName', e.target.value)} required size="small" error={!!errors.lastName} helperText={errors.lastName} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Email Address" type="email" value={personalInfo.email} onChange={(e) => handlePersonalChange('email', e.target.value)} required size="small" error={!!errors.email} helperText={errors.email} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Phone Number" value={personalInfo.phone} onChange={(e) => handlePersonalChange('phone', e.target.value)} required size="small" error={!!errors.phone} helperText={errors.phone} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth type="date" label="Date of Birth" value={personalInfo.dateOfBirth} onChange={(e) => handlePersonalChange('dateOfBirth', e.target.value)} InputLabelProps={{ shrink: true }} required size="small" error={!!errors.dateOfBirth} helperText={errors.dateOfBirth} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField select fullWidth label="Gender" value={personalInfo.gender} onChange={(e) => handlePersonalChange('gender', e.target.value)} required size="small" error={!!errors.gender} helperText={errors.gender}>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField select fullWidth label="Nationality" value={personalInfo.nationality} onChange={(e) => handlePersonalChange('nationality', e.target.value)} required size="small" error={!!errors.nationality} helperText={errors.nationality}>
          {COUNTRIES.map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Passport Number" value={personalInfo.passportNumber} onChange={(e) => handlePersonalChange('passportNumber', e.target.value)} required size="small" error={!!errors.passportNumber} helperText={errors.passportNumber} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
          Additional Information
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField fullWidth label="Address" value={personalInfo.address} onChange={(e) => handlePersonalChange('address', e.target.value)} multiline rows={2} size="small" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Emergency Contact Name" value={personalInfo.emergencyContact} onChange={(e) => handlePersonalChange('emergencyContact', e.target.value)} size="small" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Emergency Contact Phone" value={personalInfo.emergencyPhone} onChange={(e) => handlePersonalChange('emergencyPhone', e.target.value)} size="small" />
      </Grid>
    </Grid>
  );

  const renderProgramSelection = () => (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
          Select Your Program
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          select fullWidth label="Program" value={programSelection.programId}
          onChange={(e) => handleProgramChange('programId', e.target.value)}
          required size="small" error={!!errors.programId} helperText={errors.programId}
        >
          {programs.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name || p.programName || p.courseName || p.id}
            </MenuItem>
          ))}
          {programs.length === 0 && <MenuItem disabled value="">No programs available</MenuItem>}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          select fullWidth label="Intake" value={programSelection.intakeId}
          onChange={(e) => handleProgramChange('intakeId', e.target.value)}
          required size="small" error={!!errors.intakeId} helperText={errors.intakeId}
        >
          {intakes.map((i) => (
            <MenuItem key={i.id} value={i.id}>
              {i.name || i.intakeName || i.id}
            </MenuItem>
          ))}
          {intakes.length === 0 && <MenuItem disabled value="">No intakes available</MenuItem>}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          select fullWidth label="Study Mode" value={programSelection.studyMode}
          onChange={(e) => handleProgramChange('studyMode', e.target.value)}
          required size="small" error={!!errors.studyMode} helperText={errors.studyMode}
        >
          <MenuItem value="Full-Time">Full-Time</MenuItem>
          <MenuItem value="Part-Time">Part-Time</MenuItem>
          <MenuItem value="Online">Online</MenuItem>
        </TextField>
      </Grid>
      {programSelection.programId && (
        <Grid size={{ xs: 12 }}>
          <Card variant="outlined" sx={{ mt: 1, backgroundColor: '#f8f9fa' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Selected Program</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                {programSelection.programName || 'N/A'}
              </Typography>
              {programSelection.intakeName && (
                <Typography variant="body2" color="textSecondary">
                  Intake: {programSelection.intakeName}
                </Typography>
              )}
              {programSelection.studyMode && (
                <Typography variant="body2" color="textSecondary">
                  Mode: {programSelection.studyMode}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );

  const renderDocumentUpload = () => (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, color: '#333' }}>
          Upload Required Documents
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Please upload the following documents. Accepted formats: PDF, DOC, DOCX, JPG, PNG. Max 5MB per file.
        </Typography>
      </Grid>
      {REQUIRED_DOCUMENTS.map((doc) => (
        <Grid size={{ xs: 12, sm: 6 }} key={doc.key}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              {doc.label}
            </Typography>
            <FileUpload
              accept={doc.accept}
              multiple={false}
              label={`Upload ${doc.label}`}
              onFilesChange={(files) => handleDocumentUpload(doc.key, files)}
            />
            {documents[doc.key] && documents[doc.key].length > 0 && (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon sx={{ color: '#2e7d32', fontSize: 18 }} />
                <Typography variant="caption" color="success.main">
                  {documents[doc.key][0].name} uploaded
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  const renderReview = () => {
    const uploadedDocs = Object.entries(documents).filter(([, files]) => files && files.length > 0);

    return (
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
            Review Your Application
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Please review all information before submitting.
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PersonIcon sx={{ color: '#b30537' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Personal Information</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                <Typography variant="body2"><strong>Name:</strong> {personalInfo.firstName} {personalInfo.lastName}</Typography>
                <Typography variant="body2"><strong>Email:</strong> {personalInfo.email}</Typography>
                <Typography variant="body2"><strong>Phone:</strong> {personalInfo.phone}</Typography>
                <Typography variant="body2"><strong>Date of Birth:</strong> {personalInfo.dateOfBirth}</Typography>
                <Typography variant="body2"><strong>Gender:</strong> {personalInfo.gender}</Typography>
                <Typography variant="body2"><strong>Nationality:</strong> {personalInfo.nationality}</Typography>
                <Typography variant="body2"><strong>Passport:</strong> {personalInfo.passportNumber}</Typography>
                {personalInfo.address && <Typography variant="body2"><strong>Address:</strong> {personalInfo.address}</Typography>}
                {personalInfo.emergencyContact && <Typography variant="body2"><strong>Emergency Contact:</strong> {personalInfo.emergencyContact} ({personalInfo.emergencyPhone})</Typography>}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <SchoolIcon sx={{ color: '#b30537' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Program Details</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                <Typography variant="body2"><strong>Program:</strong> {programSelection.programName || 'N/A'}</Typography>
                <Typography variant="body2"><strong>Intake:</strong> {programSelection.intakeName || 'N/A'}</Typography>
                <Typography variant="body2"><strong>Study Mode:</strong> {programSelection.studyMode}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <DescriptionIcon sx={{ color: '#b30537' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Uploaded Documents</Typography>
              </Box>
              {uploadedDocs.length > 0 ? (
                <List dense disablePadding>
                  {uploadedDocs.map(([key, files]) => {
                    const docInfo = REQUIRED_DOCUMENTS.find((d) => d.key === key);
                    return (
                      <ListItem key={key} disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <InsertDriveFileIcon sx={{ color: '#666', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={docInfo?.label || key}
                          secondary={files[0]?.name}
                          primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500 }}
                          secondaryTypographyProps={{ fontSize: '0.8rem' }}
                        />
                        <CheckCircleIcon sx={{ color: '#2e7d32', fontSize: 18 }} />
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary">No documents uploaded</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0: return renderPersonalInfo();
      case 1: return renderProgramSelection();
      case 2: return renderDocumentUpload();
      case 3: return renderReview();
      default: return null;
    }
  };

  return (
    <Box>
      <PageHeader
        title="Online Application"
        breadcrumbs={[
          { label: 'Students', path: '/students/search' },
          { label: 'Online Application' },
        ]}
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label, index) => {
            const Icon = stepIcons[index];
            return (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 40, height: 40, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: index <= activeStep ? '#b30537' : '#e0e0e0',
                        color: '#fff',
                      }}
                    >
                      <Icon sx={{ fontSize: 20 }} />
                    </Box>
                  )}
                >
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, pt: 2, borderTop: '1px solid #eee' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            disabled={activeStep === 0}
            color="inherit"
          >
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleSubmit}
              sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}
            >
              Submit Application
            </Button>
          ) : (
            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={handleNext}
              sx={{ backgroundColor: '#b30537', '&:hover': { backgroundColor: '#800025' } }}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
