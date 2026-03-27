import { Fragment, useState, useEffect } from 'react';
import {
  Box, Paper, Typography, TextField, MenuItem, Button, Stepper, Step, StepLabel,
  Card, CardContent, Divider, Checkbox, FormControlLabel, Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import HomeIcon from '@mui/icons-material/Home';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import WorkIcon from '@mui/icons-material/Work';
import InfoIcon from '@mui/icons-material/Info';
import GavelIcon from '@mui/icons-material/Gavel';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PageHeader from '../../components/common/PageHeader';
import FileUpload from '../../components/common/FileUpload';
import storageService from '../../services/storageService';
import { useSnackbar } from 'notistack';
import { COUNTRIES } from '../../data/constants';

const PSB_RED = '#b30537';
const PSB_RED_HOVER = '#800025';

const steps = [
  'Personal Particulars',
  'Course Selection',
  'Documents',
  'Emergency Contacts',
  'Addresses',
  'Education History',
  'Employment Details',
  'Additional Information',
  'Declaration',
  'Review & Submit',
];

const stepIcons = [
  PersonIcon, SchoolIcon, DescriptionIcon, ContactPhoneIcon, HomeIcon,
  HistoryEduIcon, WorkIcon, InfoIcon, GavelIcon, RateReviewIcon,
];

const PASS_TYPES = [
  'Student Pass', 'Dependent Pass', 'Work Permit', 'Employment Pass',
  'S Pass', 'Long Term Visit Pass', 'Permanent Resident', 'Citizen', 'IPA', 'STP',
];

const SPONSORSHIP_TYPES = [
  'Self-Sponsored', 'Company Sponsored', 'Government Sponsored', 'Parent/Guardian',
];

const COURSE_LEVELS = ['Diploma', 'Advanced Diploma', 'Bachelor', 'Master', 'Certificate'];

const DISCIPLINES = [
  'Business & Management', 'Engineering & Technology', 'Information Technology',
  'Media & Communications', 'Life Sciences', 'Sport Science', 'Accounting & Finance',
  'Cyber Security', 'Electrical Engineering', 'Hospitality & Tourism',
];

const REFERRAL_SOURCES = ['Agent', 'Walk-in', 'Online', 'Friend/Family', 'Social Media', 'Exhibition'];

const ENGLISH_TEST_TYPES = ['IELTS', 'TOEFL', 'PTE', 'Duolingo', 'None'];

const REQUIRED_DOCUMENTS = [
  { key: 'idDocument', label: 'ID Document (Passport)', accept: 'image/*,.pdf' },
  { key: 'nationalId', label: 'National ID', accept: 'image/*,.pdf' },
  { key: 'ipaLetter', label: 'IPA Letter', accept: '.pdf,.doc,.docx' },
  { key: 'stpCard', label: 'STP Card', accept: 'image/*,.pdf' },
];

const generateApplicationId = () => {
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
  return `APP${year}${seq}`;
};

const generateStudentId = () => {
  const year = new Date().getFullYear().toString().slice(-2);
  const seq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
  return `STU${year}${seq}`;
};

const sectionHeading = (text) => (
  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#333' }}>
    {text}
  </Typography>
);

const sectionDivider = (text) => (
  <>
    <Divider sx={{ my: 2 }} />
    {sectionHeading(text)}
  </>
);

// ---------------------------------------------------------------------------
// COMPONENT
// ---------------------------------------------------------------------------
export default function OnlineApplication() {
  const { enqueueSnackbar } = useSnackbar();
  const [activeStep, setActiveStep] = useState(0);
  const [programs, setPrograms] = useState([]);
  const [intakes, setIntakes] = useState([]);
  const [documents, setDocuments] = useState({});
  const [errors, setErrors] = useState({});

  // Step 1 -- Personal Particulars
  const [personal, setPersonal] = useState({
    title: '', firstName: '', lastName: '', dateOfBirth: '', gender: '',
    mobile: '', countryCode: '+65', email: '', nationality: '',
    passType: '', finNumber: '', stpExpiry: '', ipaNumber: '',
    sponsorship: '',
  });

  // Step 2 -- Course Selection (3 preference rows)
  const blankPref = { level: '', discipline: '', courseId: '', courseName: '', intakeId: '', intakeName: '' };
  const [coursePrefs, setCoursePrefs] = useState([
    { ...blankPref }, { ...blankPref }, { ...blankPref },
  ]);
  const [exemptedModules, setExemptedModules] = useState('');

  // Step 4 -- Emergency Contacts
  const blankContact = { name: '', mobile: '', email: '' };
  const [emergencyContacts, setEmergencyContacts] = useState({
    father: { ...blankContact },
    mother: { ...blankContact },
    guardian: { ...blankContact },
  });

  // Step 5 -- Addresses
  const blankAddress = { block: '', street: '', unit: '', city: '', state: '', postalCode: '', country: '' };
  const blankSgAddress = { block: '', street: '', unit: '', postalCode: '' };
  const [homeAddress, setHomeAddress] = useState({ ...blankAddress });
  const [sgAddress, setSgAddress] = useState({ ...blankSgAddress });
  const [mailingAddress, setMailingAddress] = useState({ ...blankAddress });
  const [sameAsHome, setSameAsHome] = useState(false);
  const [sameAsSg, setSameAsSg] = useState(false);

  // Step 6 -- Education History
  const blankEdu = { qualificationName: '', yearOfCompletion: '', institution: '', country: '' };
  const [educationHistory, setEducationHistory] = useState([
    { ...blankEdu, label: 'Highest Qualification' },
    { ...blankEdu, label: 'Second Qualification' },
    { ...blankEdu, label: 'Third Qualification' },
    { ...blankEdu, label: 'Fourth Qualification' },
  ]);
  const [eduDocuments, setEduDocuments] = useState({});
  const [englishProficiency, setEnglishProficiency] = useState({
    testType: '', score: '', testDate: '',
  });

  // Step 7 -- Employment
  const blankJob = { companyName: '', designation: '', startDate: '', endDate: '' };
  const [currentEmployment, setCurrentEmployment] = useState({ ...blankJob, currentlyWorking: false });
  const [previousEmployment, setPreviousEmployment] = useState({ ...blankJob });

  // Step 8 -- Additional Information
  const [additional, setAdditional] = useState({
    referralSource: '', agentName: '', agentCode: '', promoCode: '',
    medicalConditions: '', hasDisability: 'No', disabilityDetails: '',
  });

  // Step 9 -- Declaration
  const [declaration, setDeclaration] = useState({
    agreed: false, dataConsent: false, signatureName: '',
  });

  // Load programs and intakes
  useEffect(() => {
    setPrograms(storageService.getAll('programs'));
    setIntakes(storageService.getAll('intakes'));
  }, []);

  // Address sync helpers
  useEffect(() => {
    if (sameAsHome) {
      setSgAddress({
        block: homeAddress.block, street: homeAddress.street,
        unit: homeAddress.unit, postalCode: homeAddress.postalCode,
      });
    }
  }, [sameAsHome, homeAddress]);

  useEffect(() => {
    if (sameAsSg) {
      setMailingAddress({
        block: sgAddress.block, street: sgAddress.street, unit: sgAddress.unit,
        city: '', state: '', postalCode: sgAddress.postalCode, country: 'Singapore',
      });
    }
  }, [sameAsSg, sgAddress]);

  // ---------------------------------------------------------------------------
  // Generic field updaters
  // ---------------------------------------------------------------------------
  const up = (setter) => (field, value) => {
    setter((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const upPersonal = up(setPersonal);
  const upAdditional = up(setAdditional);
  const upDeclaration = up(setDeclaration);
  const upEnglish = up(setEnglishProficiency);

  const updateCoursePref = (index, field, value) => {
    setCoursePrefs((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      if (field === 'courseId') {
        const prog = programs.find((p) => p.id === value);
        copy[index].courseName = prog ? prog.name || prog.programName || prog.courseName || '' : '';
      }
      if (field === 'intakeId') {
        const intake = intakes.find((i) => i.id === value);
        copy[index].intakeName = intake ? intake.name || intake.intakeName || '' : '';
      }
      return copy;
    });
  };

  const updateEmergency = (relation, field, value) => {
    setEmergencyContacts((prev) => ({
      ...prev,
      [relation]: { ...prev[relation], [field]: value },
    }));
  };

  const updateEducation = (index, field, value) => {
    setEducationHistory((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleDocumentUpload = (key, files) => {
    setDocuments((prev) => ({ ...prev, [key]: files }));
  };

  const handleEduDocUpload = (index, files) => {
    setEduDocuments((prev) => ({ ...prev, [index]: files }));
  };

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------
  const validateStep = (step) => {
    const e = {};
    if (step === 0) {
      if (!personal.firstName.trim()) e.firstName = 'Required';
      if (!personal.lastName.trim()) e.lastName = 'Required';
      if (!personal.email.trim()) e.email = 'Required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email)) e.email = 'Invalid email';
      if (!personal.mobile.trim()) e.mobile = 'Required';
      if (!personal.dateOfBirth) e.dateOfBirth = 'Required';
      if (!personal.gender) e.gender = 'Required';
      if (!personal.nationality) e.nationality = 'Required';
    }
    if (step === 1) {
      if (!coursePrefs[0].courseId) e.courseId0 = 'At least first preference is required';
    }
    if (step === 8) {
      if (!declaration.agreed) e.agreed = 'You must agree to the terms';
      if (!declaration.dataConsent) e.dataConsent = 'You must provide data consent';
      if (!declaration.signatureName.trim()) e.signatureName = 'Signature is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    } else {
      enqueueSnackbar('Please fill in all required fields', { variant: 'warning' });
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  // ---------------------------------------------------------------------------
  // Save Draft
  // ---------------------------------------------------------------------------
  const buildFormPayload = () => ({
    personal, coursePrefs, exemptedModules, emergencyContacts,
    homeAddress, sgAddress, mailingAddress,
    educationHistory, englishProficiency,
    currentEmployment, previousEmployment,
    additional, declaration,
  });

  const handleSaveDraft = () => {
    const applicationId = generateApplicationId();
    const draft = {
      applicationId,
      status: 'Draft',
      ...buildFormPayload(),
      savedAt: new Date().toISOString(),
    };
    storageService.create('applications', draft);
    enqueueSnackbar(`Draft saved! Application ID: ${applicationId}`, { variant: 'info' });
  };

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------
  const handleSubmit = () => {
    if (!validateStep(8)) {
      enqueueSnackbar('Please complete the Declaration step first', { variant: 'warning' });
      return;
    }

    const applicationId = generateApplicationId();
    const studentId = generateStudentId();
    const studentName = `${personal.firstName} ${personal.lastName}`;

    // Save application record
    const applicationRecord = {
      applicationId,
      studentId,
      status: 'Submitted',
      ...buildFormPayload(),
      submittedAt: new Date().toISOString(),
    };
    storageService.create('applications', applicationRecord);

    // Save student record
    const primaryCourse = coursePrefs[0];
    const studentData = {
      studentId,
      name: studentName,
      firstName: personal.firstName,
      lastName: personal.lastName,
      email: personal.email,
      phone: `${personal.countryCode} ${personal.mobile}`,
      dateOfBirth: personal.dateOfBirth,
      nationality: personal.nationality,
      passportNumber: personal.finNumber,
      gender: personal.gender,
      address: `${homeAddress.block} ${homeAddress.street} ${homeAddress.unit}, ${homeAddress.city} ${homeAddress.postalCode}, ${homeAddress.country}`.trim(),
      emergencyContact: emergencyContacts.father.name || emergencyContacts.mother.name || emergencyContacts.guardian.name,
      emergencyPhone: emergencyContacts.father.mobile || emergencyContacts.mother.mobile || emergencyContacts.guardian.mobile,
      program: primaryCourse.courseName,
      programId: primaryCourse.courseId,
      intake: primaryCourse.intakeName,
      intakeId: primaryCourse.intakeId,
      studyMode: 'Full-Time',
      status: 'Active',
      enrollmentDate: new Date().toISOString().split('T')[0],
      applicationDate: new Date().toISOString().split('T')[0],
    };
    storageService.create('students', studentData);

    // Save uploaded document records
    const allDocs = { ...documents, ...eduDocuments };
    Object.entries(allDocs).forEach(([docKey, files]) => {
      if (files && files.length > 0) {
        const reqDoc = REQUIRED_DOCUMENTS.find((d) => d.key === docKey);
        files.forEach((file) => {
          storageService.create('documents', {
            studentId,
            studentName,
            documentType: reqDoc?.label || `Education Document ${Number(docKey) + 1}`,
            fileName: file.name,
            fileSize: file.size,
            uploadDate: new Date().toISOString().split('T')[0],
            status: 'Pending',
            remarks: '',
          });
        });
      }
    });

    enqueueSnackbar(`Application submitted! ID: ${applicationId} | Student ID: ${studentId}`, { variant: 'success' });

    // Reset entire form
    setActiveStep(0);
    setPersonal({ title: '', firstName: '', lastName: '', dateOfBirth: '', gender: '', mobile: '', countryCode: '+65', email: '', nationality: '', passType: '', finNumber: '', stpExpiry: '', ipaNumber: '', sponsorship: '' });
    setCoursePrefs([{ ...blankPref }, { ...blankPref }, { ...blankPref }]);
    setExemptedModules('');
    setDocuments({});
    setEmergencyContacts({ father: { ...blankContact }, mother: { ...blankContact }, guardian: { ...blankContact } });
    setHomeAddress({ ...blankAddress });
    setSgAddress({ ...blankSgAddress });
    setMailingAddress({ ...blankAddress });
    setSameAsHome(false);
    setSameAsSg(false);
    setEducationHistory([
      { ...blankEdu, label: 'Highest Qualification' },
      { ...blankEdu, label: 'Second Qualification' },
      { ...blankEdu, label: 'Third Qualification' },
      { ...blankEdu, label: 'Fourth Qualification' },
    ]);
    setEduDocuments({});
    setEnglishProficiency({ testType: '', score: '', testDate: '' });
    setCurrentEmployment({ ...blankJob, currentlyWorking: false });
    setPreviousEmployment({ ...blankJob });
    setAdditional({ referralSource: '', agentName: '', agentCode: '', promoCode: '', medicalConditions: '', hasDisability: 'No', disabilityDetails: '' });
    setDeclaration({ agreed: false, dataConsent: false, signatureName: '' });
    setErrors({});
  };

  // ===========================================================================
  // STEP RENDERERS
  // ===========================================================================

  // -- Step 1: Personal Particulars -------------------------------------------
  const renderPersonalParticulars = () => (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12 }}>{sectionHeading('Personal Particulars')}</Grid>
      <Grid size={{ xs: 12, sm: 3 }}>
        <TextField select fullWidth label="Title" value={personal.title} onChange={(e) => upPersonal('title', e.target.value)} size="small">
          {['Mr', 'Mrs', 'Ms', 'Dr'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 4.5 }}>
        <TextField fullWidth label="First Name" value={personal.firstName} onChange={(e) => upPersonal('firstName', e.target.value)} required size="small" error={!!errors.firstName} helperText={errors.firstName} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4.5 }}>
        <TextField fullWidth label="Last Name" value={personal.lastName} onChange={(e) => upPersonal('lastName', e.target.value)} required size="small" error={!!errors.lastName} helperText={errors.lastName} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth type="date" label="Date of Birth" value={personal.dateOfBirth} onChange={(e) => upPersonal('dateOfBirth', e.target.value)} slotProps={{ inputLabel: { shrink: true } }} required size="small" error={!!errors.dateOfBirth} helperText={errors.dateOfBirth} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField select fullWidth label="Gender" value={personal.gender} onChange={(e) => upPersonal('gender', e.target.value)} required size="small" error={!!errors.gender} helperText={errors.gender}>
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
        </TextField>
      </Grid>

      <Grid size={{ xs: 12 }}>{sectionDivider('Contact Details')}</Grid>
      <Grid size={{ xs: 12, sm: 3 }}>
        <TextField fullWidth label="Country Code" value={personal.countryCode} onChange={(e) => upPersonal('countryCode', e.target.value)} size="small" placeholder="+65" />
      </Grid>
      <Grid size={{ xs: 12, sm: 4.5 }}>
        <TextField fullWidth label="Mobile Number" value={personal.mobile} onChange={(e) => upPersonal('mobile', e.target.value)} required size="small" error={!!errors.mobile} helperText={errors.mobile} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4.5 }}>
        <TextField fullWidth label="Email Address" type="email" value={personal.email} onChange={(e) => upPersonal('email', e.target.value)} required size="small" error={!!errors.email} helperText={errors.email} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField select fullWidth label="Nationality" value={personal.nationality} onChange={(e) => upPersonal('nationality', e.target.value)} required size="small" error={!!errors.nationality} helperText={errors.nationality}>
          {COUNTRIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </TextField>
      </Grid>

      <Grid size={{ xs: 12 }}>{sectionDivider('Pass & Immigration Details')}</Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField select fullWidth label="Type of Pass" value={personal.passType} onChange={(e) => upPersonal('passType', e.target.value)} size="small">
          {PASS_TYPES.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="FIN Number" value={personal.finNumber} onChange={(e) => upPersonal('finNumber', e.target.value)} size="small" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth type="date" label="STP Expiry Date" value={personal.stpExpiry} onChange={(e) => upPersonal('stpExpiry', e.target.value)} slotProps={{ inputLabel: { shrink: true } }} size="small" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="IPA Number" value={personal.ipaNumber} onChange={(e) => upPersonal('ipaNumber', e.target.value)} size="small" />
      </Grid>

      <Grid size={{ xs: 12 }}>{sectionDivider('Sponsorship')}</Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField select fullWidth label="Sponsorship" value={personal.sponsorship} onChange={(e) => upPersonal('sponsorship', e.target.value)} size="small">
          {SPONSORSHIP_TYPES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
      </Grid>
    </Grid>
  );

  // -- Step 2: Course Selection -----------------------------------------------
  const renderCourseSelection = () => (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12 }}>{sectionHeading('Course Preferences')}</Grid>
      {coursePrefs.map((pref, idx) => (
        <Fragment key={idx}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: idx > 0 ? 1 : 0, color: PSB_RED }}>
              Preference {idx + 1} {idx === 0 ? '(Required)' : '(Optional)'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField select fullWidth label="Level" value={pref.level} onChange={(e) => updateCoursePref(idx, 'level', e.target.value)} size="small" error={idx === 0 && !!errors.courseId0 && !pref.level}>
              {COURSE_LEVELS.map((l) => <MenuItem key={l} value={l}>{l}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField select fullWidth label="Discipline" value={pref.discipline} onChange={(e) => updateCoursePref(idx, 'discipline', e.target.value)} size="small">
              {DISCIPLINES.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField select fullWidth label="Course" value={pref.courseId} onChange={(e) => updateCoursePref(idx, 'courseId', e.target.value)} size="small" error={idx === 0 && !!errors.courseId0} helperText={idx === 0 ? errors.courseId0 : ''}>
              {programs.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name || p.programName || p.courseName || p.id}</MenuItem>
              ))}
              {programs.length === 0 && <MenuItem disabled value="">No programs available</MenuItem>}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField select fullWidth label="Intake" value={pref.intakeId} onChange={(e) => updateCoursePref(idx, 'intakeId', e.target.value)} size="small">
              {intakes.map((i) => (
                <MenuItem key={i.id} value={i.id}>{i.name || i.intakeName || i.id}</MenuItem>
              ))}
              {intakes.length === 0 && <MenuItem disabled value="">No intakes available</MenuItem>}
            </TextField>
          </Grid>
        </Fragment>
      ))}
      <Grid size={{ xs: 12 }}>{sectionDivider('Exempted Modules')}</Grid>
      <Grid size={{ xs: 12 }}>
        <TextField fullWidth label="Exempted Modules (if any)" value={exemptedModules} onChange={(e) => setExemptedModules(e.target.value)} multiline rows={3} size="small" placeholder="List any modules you wish to be exempted from..." />
      </Grid>
    </Grid>
  );

  // -- Step 3: Documents ------------------------------------------------------
  const renderDocuments = () => (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12 }}>
        {sectionHeading('Upload Required Documents')}
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          Please upload the following documents. Accepted formats: PDF, JPG, PNG. Max 5MB per file.
        </Typography>
      </Grid>
      {REQUIRED_DOCUMENTS.map((doc) => (
        <Grid size={{ xs: 12, sm: 6 }} key={doc.key}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>{doc.label}</Typography>
            <FileUpload accept={doc.accept} multiple={false} label={`Upload ${doc.label}`} onFilesChange={(files) => handleDocumentUpload(doc.key, files)} />
            {documents[doc.key] && documents[doc.key].length > 0 ? (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon sx={{ color: '#2e7d32', fontSize: 18 }} />
                <Typography variant="caption" color="success.main">{documents[doc.key][0].name} uploaded</Typography>
              </Box>
            ) : (
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CloudUploadIcon sx={{ color: '#999', fontSize: 18 }} />
                <Typography variant="caption" color="textSecondary">Not uploaded</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  // -- Step 4: Emergency Contacts ---------------------------------------------
  const renderEmergencyContacts = () => {
    const relations = [
      { key: 'father', label: "Father's Details" },
      { key: 'mother', label: "Mother's Details" },
      { key: 'guardian', label: "Guardian's Details" },
    ];
    return (
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12 }}>{sectionHeading('Emergency Contacts')}</Grid>
        {relations.map((rel) => (
          <Fragment key={rel.key}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1, color: PSB_RED }}>{rel.label}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth label="Name" value={emergencyContacts[rel.key].name} onChange={(e) => updateEmergency(rel.key, 'name', e.target.value)} size="small" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth label="Mobile" value={emergencyContacts[rel.key].mobile} onChange={(e) => updateEmergency(rel.key, 'mobile', e.target.value)} size="small" />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField fullWidth label="Email" value={emergencyContacts[rel.key].email} onChange={(e) => updateEmergency(rel.key, 'email', e.target.value)} size="small" />
            </Grid>
          </Fragment>
        ))}
      </Grid>
    );
  };

  // -- Step 5: Addresses ------------------------------------------------------
  const addressFields = (addr, setter, includeCity = true) => {
    const update = (field, value) => setter((prev) => ({ ...prev, [field]: value }));
    return (
      <>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth label="Block/House No." value={addr.block} onChange={(e) => update('block', e.target.value)} size="small" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth label="Street Name" value={addr.street} onChange={(e) => update('street', e.target.value)} size="small" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField fullWidth label="Unit No." value={addr.unit} onChange={(e) => update('unit', e.target.value)} size="small" />
        </Grid>
        {includeCity && (
          <>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField fullWidth label="City" value={addr.city} onChange={(e) => update('city', e.target.value)} size="small" />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField fullWidth label="State/Province" value={addr.state} onChange={(e) => update('state', e.target.value)} size="small" />
            </Grid>
          </>
        )}
        <Grid size={{ xs: 12, sm: includeCity ? 3 : 6 }}>
          <TextField fullWidth label="Postal Code" value={addr.postalCode} onChange={(e) => update('postalCode', e.target.value)} size="small" />
        </Grid>
        {includeCity && (
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField select fullWidth label="Country" value={addr.country} onChange={(e) => update('country', e.target.value)} size="small">
              {COUNTRIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Grid>
        )}
      </>
    );
  };

  const renderAddresses = () => (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12 }}>{sectionHeading('Home Country Address')}</Grid>
      {addressFields(homeAddress, setHomeAddress, true)}

      <Grid size={{ xs: 12 }}>
        {sectionDivider('Singapore Residential Address')}
        <FormControlLabel
          control={<Checkbox checked={sameAsHome} onChange={(e) => setSameAsHome(e.target.checked)} size="small" sx={{ color: PSB_RED, '&.Mui-checked': { color: PSB_RED } }} />}
          label={<Typography variant="body2">Same as Home Country Address</Typography>}
        />
      </Grid>
      {!sameAsHome && addressFields(sgAddress, setSgAddress, false)}

      <Grid size={{ xs: 12 }}>
        {sectionDivider('Mailing Address')}
        <FormControlLabel
          control={<Checkbox checked={sameAsSg} onChange={(e) => setSameAsSg(e.target.checked)} size="small" sx={{ color: PSB_RED, '&.Mui-checked': { color: PSB_RED } }} />}
          label={<Typography variant="body2">Same as Singapore Residential Address</Typography>}
        />
      </Grid>
      {!sameAsSg && addressFields(mailingAddress, setMailingAddress, true)}
    </Grid>
  );

  // -- Step 6: Education History ----------------------------------------------
  const renderEducationHistory = () => (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12 }}>{sectionHeading('Education History')}</Grid>
      {educationHistory.map((edu, idx) => (
        <Fragment key={idx}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: idx > 0 ? 1 : 0, color: PSB_RED }}>{edu.label}</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label="Qualification Name" value={edu.qualificationName} onChange={(e) => updateEducation(idx, 'qualificationName', e.target.value)} size="small" />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <TextField fullWidth label="Year of Completion" value={edu.yearOfCompletion} onChange={(e) => updateEducation(idx, 'yearOfCompletion', e.target.value)} size="small" placeholder="e.g. 2023" />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label="Institution" value={edu.institution} onChange={(e) => updateEducation(idx, 'institution', e.target.value)} size="small" />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <TextField select fullWidth label="Country" value={edu.country} onChange={(e) => updateEducation(idx, 'country', e.target.value)} size="small">
              {COUNTRIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <Paper variant="outlined" sx={{ p: 1 }}>
              <FileUpload accept=".pdf,.doc,.docx,image/*" multiple={false} label="Upload Doc" onFilesChange={(files) => handleEduDocUpload(idx, files)} maxSize={5} />
              {eduDocuments[idx] && eduDocuments[idx].length > 0 ? (
                <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckCircleIcon sx={{ color: '#2e7d32', fontSize: 14 }} />
                  <Typography variant="caption" color="success.main">Uploaded</Typography>
                </Box>
              ) : (
                <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>No file</Typography>
              )}
            </Paper>
          </Grid>
        </Fragment>
      ))}

      <Grid size={{ xs: 12 }}>{sectionDivider('English Proficiency')}</Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField select fullWidth label="Test Type" value={englishProficiency.testType} onChange={(e) => upEnglish('testType', e.target.value)} size="small">
          {ENGLISH_TEST_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField fullWidth label="Score" value={englishProficiency.score} onChange={(e) => upEnglish('score', e.target.value)} size="small" disabled={englishProficiency.testType === 'None'} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField fullWidth type="date" label="Test Date" value={englishProficiency.testDate} onChange={(e) => upEnglish('testDate', e.target.value)} slotProps={{ inputLabel: { shrink: true } }} size="small" disabled={englishProficiency.testType === 'None'} />
      </Grid>
    </Grid>
  );

  // -- Step 7: Employment Details ---------------------------------------------
  const renderEmployment = () => (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12 }}>{sectionHeading('Current Employment')}</Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Company Name" value={currentEmployment.companyName} onChange={(e) => setCurrentEmployment((p) => ({ ...p, companyName: e.target.value }))} size="small" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Designation" value={currentEmployment.designation} onChange={(e) => setCurrentEmployment((p) => ({ ...p, designation: e.target.value }))} size="small" />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField fullWidth type="date" label="Start Date" value={currentEmployment.startDate} onChange={(e) => setCurrentEmployment((p) => ({ ...p, startDate: e.target.value }))} slotProps={{ inputLabel: { shrink: true } }} size="small" />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField fullWidth type="date" label="End Date" value={currentEmployment.endDate} onChange={(e) => setCurrentEmployment((p) => ({ ...p, endDate: e.target.value }))} slotProps={{ inputLabel: { shrink: true } }} size="small" disabled={currentEmployment.currentlyWorking} />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <FormControlLabel
          control={
            <Checkbox checked={currentEmployment.currentlyWorking} onChange={(e) => setCurrentEmployment((p) => ({ ...p, currentlyWorking: e.target.checked, endDate: '' }))} size="small" sx={{ color: PSB_RED, '&.Mui-checked': { color: PSB_RED } }} />
          }
          label={<Typography variant="body2">Currently Working</Typography>}
          sx={{ mt: 0.5 }}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>{sectionDivider('Previous Employment')}</Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Company Name" value={previousEmployment.companyName} onChange={(e) => setPreviousEmployment((p) => ({ ...p, companyName: e.target.value }))} size="small" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Designation" value={previousEmployment.designation} onChange={(e) => setPreviousEmployment((p) => ({ ...p, designation: e.target.value }))} size="small" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth type="date" label="Start Date" value={previousEmployment.startDate} onChange={(e) => setPreviousEmployment((p) => ({ ...p, startDate: e.target.value }))} slotProps={{ inputLabel: { shrink: true } }} size="small" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth type="date" label="End Date" value={previousEmployment.endDate} onChange={(e) => setPreviousEmployment((p) => ({ ...p, endDate: e.target.value }))} slotProps={{ inputLabel: { shrink: true } }} size="small" />
      </Grid>
    </Grid>
  );

  // -- Step 8: Additional Information -----------------------------------------
  const renderAdditionalInfo = () => (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12 }}>{sectionHeading('Referral Information')}</Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField select fullWidth label="Referral Source" value={additional.referralSource} onChange={(e) => upAdditional('referralSource', e.target.value)} size="small">
          {REFERRAL_SOURCES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
        </TextField>
      </Grid>
      {additional.referralSource === 'Agent' && (
        <>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label="Agent Name" value={additional.agentName} onChange={(e) => upAdditional('agentName', e.target.value)} size="small" />
          </Grid>
          <Grid size={{ xs: 12, sm: 3 }}>
            <TextField fullWidth label="Agent Code" value={additional.agentCode} onChange={(e) => upAdditional('agentCode', e.target.value)} size="small" />
          </Grid>
        </>
      )}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Promo Code" value={additional.promoCode} onChange={(e) => upAdditional('promoCode', e.target.value)} size="small" placeholder="Enter promo code if applicable" />
      </Grid>

      <Grid size={{ xs: 12 }}>{sectionDivider('Medical & Disability')}</Grid>
      <Grid size={{ xs: 12 }}>
        <TextField fullWidth label="Medical Conditions" value={additional.medicalConditions} onChange={(e) => upAdditional('medicalConditions', e.target.value)} multiline rows={3} size="small" placeholder="Please list any medical conditions..." />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField select fullWidth label="Do you have a disability?" value={additional.hasDisability} onChange={(e) => upAdditional('hasDisability', e.target.value)} size="small">
          <MenuItem value="No">No</MenuItem>
          <MenuItem value="Yes">Yes</MenuItem>
        </TextField>
      </Grid>
      {additional.hasDisability === 'Yes' && (
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField fullWidth label="Disability Details" value={additional.disabilityDetails} onChange={(e) => upAdditional('disabilityDetails', e.target.value)} size="small" />
        </Grid>
      )}
    </Grid>
  );

  // -- Step 9: Declaration ----------------------------------------------------
  const renderDeclaration = () => (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12 }}>{sectionHeading('Declaration')}</Grid>
      <Grid size={{ xs: 12 }}>
        <Paper variant="outlined" sx={{ p: 3, backgroundColor: '#fafafa' }}>
          <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8 }}>
            I hereby declare that the information provided in this application form is true, complete, and correct to the best of my knowledge and belief. I understand that any false or misleading information may result in the rejection of my application or termination of my enrolment. I acknowledge that PSB Academy reserves the right to verify the information provided and to request additional documentation as deemed necessary.
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8 }}>
            I further understand that submission of this application does not guarantee admission, and that PSB Academy's decision on my application is final. I agree to abide by the rules, regulations, and policies of PSB Academy if admitted.
          </Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox checked={declaration.agreed} onChange={(e) => upDeclaration('agreed', e.target.checked)} size="small" sx={{ color: errors.agreed ? '#d32f2f' : PSB_RED, '&.Mui-checked': { color: PSB_RED } }} />
          }
          label={<Typography variant="body2" color={errors.agreed ? 'error' : 'textPrimary'}>I agree to the terms and conditions *</Typography>}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox checked={declaration.dataConsent} onChange={(e) => upDeclaration('dataConsent', e.target.checked)} size="small" sx={{ color: errors.dataConsent ? '#d32f2f' : PSB_RED, '&.Mui-checked': { color: PSB_RED } }} />
          }
          label={<Typography variant="body2" color={errors.dataConsent ? 'error' : 'textPrimary'}>I consent to the collection, use, and disclosure of my personal data by PSB Academy for the purposes of processing my application and for administrative and educational purposes *</Typography>}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Digital Signature (Full Name)" value={declaration.signatureName} onChange={(e) => upDeclaration('signatureName', e.target.value)} size="small" required error={!!errors.signatureName} helperText={errors.signatureName} placeholder="Type your full legal name" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Date" value={new Date().toISOString().split('T')[0]} size="small" slotProps={{ input: { readOnly: true }, inputLabel: { shrink: true } }} />
      </Grid>
    </Grid>
  );

  // -- Step 10: Review & Submit -----------------------------------------------
  const reviewField = (label, value) => {
    if (!value) return null;
    return <Typography variant="body2" sx={{ mb: 0.5 }}><strong>{label}:</strong> {value}</Typography>;
  };

  const renderReview = () => {
    const uploadedCount = Object.values(documents).filter((f) => f && f.length > 0).length;
    const primaryCourse = coursePrefs[0];

    return (
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12 }}>{sectionHeading('Review Your Application')}</Grid>

        {/* Personal Particulars */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <PersonIcon sx={{ color: PSB_RED }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Personal Particulars</Typography>
              </Box>
              {reviewField('Name', `${personal.title} ${personal.firstName} ${personal.lastName}`.trim())}
              {reviewField('Date of Birth', personal.dateOfBirth)}
              {reviewField('Gender', personal.gender)}
              {reviewField('Mobile', `${personal.countryCode} ${personal.mobile}`)}
              {reviewField('Email', personal.email)}
              {reviewField('Nationality', personal.nationality)}
              {reviewField('Pass Type', personal.passType)}
              {reviewField('FIN', personal.finNumber)}
              {reviewField('Sponsorship', personal.sponsorship)}
            </CardContent>
          </Card>
        </Grid>

        {/* Course Selection */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <SchoolIcon sx={{ color: PSB_RED }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Course Selection</Typography>
              </Box>
              {coursePrefs.map((pref, idx) => (
                pref.courseName ? (
                  <Box key={idx} sx={{ mb: 1 }}>
                    <Typography variant="body2"><strong>Preference {idx + 1}:</strong> {pref.courseName}</Typography>
                    <Typography variant="caption" color="textSecondary">{pref.level} | {pref.discipline} | Intake: {pref.intakeName || 'N/A'}</Typography>
                  </Box>
                ) : null
              ))}
              {exemptedModules && reviewField('Exempted Modules', exemptedModules)}
            </CardContent>
          </Card>
        </Grid>

        {/* Documents */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <DescriptionIcon sx={{ color: PSB_RED }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Documents</Typography>
              </Box>
              <Typography variant="body2">{uploadedCount} of {REQUIRED_DOCUMENTS.length} documents uploaded</Typography>
              {REQUIRED_DOCUMENTS.map((doc) => (
                <Box key={doc.key} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  {documents[doc.key] && documents[doc.key].length > 0 ? (
                    <CheckCircleIcon sx={{ color: '#2e7d32', fontSize: 16 }} />
                  ) : (
                    <CloudUploadIcon sx={{ color: '#999', fontSize: 16 }} />
                  )}
                  <Typography variant="caption">{doc.label}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Emergency Contacts */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <ContactPhoneIcon sx={{ color: PSB_RED }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Emergency Contacts</Typography>
              </Box>
              {emergencyContacts.father.name && reviewField('Father', `${emergencyContacts.father.name} (${emergencyContacts.father.mobile})`)}
              {emergencyContacts.mother.name && reviewField('Mother', `${emergencyContacts.mother.name} (${emergencyContacts.mother.mobile})`)}
              {emergencyContacts.guardian.name && reviewField('Guardian', `${emergencyContacts.guardian.name} (${emergencyContacts.guardian.mobile})`)}
              {!emergencyContacts.father.name && !emergencyContacts.mother.name && !emergencyContacts.guardian.name && (
                <Typography variant="body2" color="textSecondary">No contacts provided</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Addresses */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <HomeIcon sx={{ color: PSB_RED }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Addresses</Typography>
              </Box>
              {reviewField('Home Country', `${homeAddress.block} ${homeAddress.street} ${homeAddress.unit}, ${homeAddress.city} ${homeAddress.postalCode}, ${homeAddress.country}`.replace(/\s+/g, ' ').trim())}
              {reviewField('Singapore', `${sgAddress.block} ${sgAddress.street} ${sgAddress.unit}, ${sgAddress.postalCode}`.replace(/\s+/g, ' ').trim())}
            </CardContent>
          </Card>
        </Grid>

        {/* Education */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <HistoryEduIcon sx={{ color: PSB_RED }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Education History</Typography>
              </Box>
              {educationHistory.map((edu, idx) => (
                edu.qualificationName ? (
                  <Box key={idx} sx={{ mb: 0.5 }}>
                    <Typography variant="body2"><strong>{edu.label}:</strong> {edu.qualificationName} ({edu.yearOfCompletion}) - {edu.institution}, {edu.country}</Typography>
                  </Box>
                ) : null
              ))}
              {englishProficiency.testType && englishProficiency.testType !== 'None' && (
                reviewField('English Proficiency', `${englishProficiency.testType} - Score: ${englishProficiency.score}`)
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Employment */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <WorkIcon sx={{ color: PSB_RED }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Employment</Typography>
              </Box>
              {currentEmployment.companyName ? (
                <>
                  {reviewField('Current', `${currentEmployment.designation} at ${currentEmployment.companyName}`)}
                  {reviewField('Period', `${currentEmployment.startDate} - ${currentEmployment.currentlyWorking ? 'Present' : currentEmployment.endDate}`)}
                </>
              ) : (
                <Typography variant="body2" color="textSecondary">No current employment provided</Typography>
              )}
              {previousEmployment.companyName && reviewField('Previous', `${previousEmployment.designation} at ${previousEmployment.companyName}`)}
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <InfoIcon sx={{ color: PSB_RED }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Additional Information</Typography>
              </Box>
              {reviewField('Referral Source', additional.referralSource)}
              {additional.referralSource === 'Agent' && reviewField('Agent', `${additional.agentName} (${additional.agentCode})`)}
              {reviewField('Promo Code', additional.promoCode)}
              {reviewField('Medical Conditions', additional.medicalConditions)}
              {reviewField('Disability', additional.hasDisability === 'Yes' ? additional.disabilityDetails : 'No')}
            </CardContent>
          </Card>
        </Grid>

        {/* Application Fee */}
        <Grid size={{ xs: 12 }}>
          <Card variant="outlined" sx={{ backgroundColor: '#fff8f9', borderColor: PSB_RED }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: PSB_RED }}>Application Fee</Typography>
                  <Typography variant="body2" color="textSecondary">Non-refundable application processing fee (Flywire Payment)</Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: PSB_RED }}>S$164.00</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Declaration status */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={declaration.agreed ? 'Terms Agreed' : 'Terms Not Agreed'} color={declaration.agreed ? 'success' : 'default'} size="small" icon={declaration.agreed ? <CheckCircleIcon /> : undefined} />
            <Chip label={declaration.dataConsent ? 'Data Consent Given' : 'Data Consent Pending'} color={declaration.dataConsent ? 'success' : 'default'} size="small" icon={declaration.dataConsent ? <CheckCircleIcon /> : undefined} />
            <Chip label={declaration.signatureName ? `Signed by: ${declaration.signatureName}` : 'Not Signed'} color={declaration.signatureName ? 'success' : 'default'} size="small" />
          </Box>
        </Grid>
      </Grid>
    );
  };

  // ===========================================================================
  // STEP ROUTER
  // ===========================================================================
  const getStepContent = (step) => {
    switch (step) {
      case 0: return renderPersonalParticulars();
      case 1: return renderCourseSelection();
      case 2: return renderDocuments();
      case 3: return renderEmergencyContacts();
      case 4: return renderAddresses();
      case 5: return renderEducationHistory();
      case 6: return renderEmployment();
      case 7: return renderAdditionalInfo();
      case 8: return renderDeclaration();
      case 9: return renderReview();
      default: return null;
    }
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================
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
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4, overflowX: 'auto' }}>
          {steps.map((label, index) => {
            const Icon = stepIcons[index];
            return (
              <Step key={label}>
                <StepLabel
                  slots={{
                    stepIcon: () => (
                      <Box
                        sx={{
                          width: 40, height: 40, borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          backgroundColor: index <= activeStep ? PSB_RED : '#e0e0e0',
                          color: '#fff', transition: 'background-color 0.3s',
                        }}
                      >
                        <Icon sx={{ fontSize: 20 }} />
                      </Box>
                    ),
                  }}
                >
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: index === activeStep ? 700 : 400 }}>
                    {label}
                  </Typography>
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
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {activeStep === steps.length - 1 ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveDraft}
                  sx={{ borderColor: PSB_RED, color: PSB_RED, '&:hover': { borderColor: PSB_RED_HOVER, backgroundColor: 'rgba(179,5,55,0.04)' } }}
                >
                  Save Draft
                </Button>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleSubmit}
                  sx={{ backgroundColor: PSB_RED, '&:hover': { backgroundColor: PSB_RED_HOVER } }}
                >
                  Finalize &amp; Submit
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleNext}
                sx={{ backgroundColor: PSB_RED, '&:hover': { backgroundColor: PSB_RED_HOVER } }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}