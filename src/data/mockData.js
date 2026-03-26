import { v4 as uuidv4 } from 'uuid';

const id = () => uuidv4();
const date = (daysAgo = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const SCHOOLS = [
  { id: id(), name: 'PSB Academy - Main Campus', code: 'PSB-MC', address: '6 Raffles Boulevard, Marina Square, Singapore 039594', status: 'Active' },
  { id: id(), name: 'PSB Academy - STEM Campus', code: 'PSB-STEM', address: '11 Lor 3 Toa Payoh, Singapore 319579', status: 'Active' },
  { id: id(), name: 'PSB Academy - City Campus', code: 'PSB-CC', address: '355 Jalan Bukit Ho Swee, Singapore 169567', status: 'Active' },
];

const PROGRAMS = [
  { id: id(), name: 'Bachelor of Science in Computer Science', shortCode: 'BSC-CS', type: 'Bachelor Degree', school: 'PSB-MC', year: '2025', status: 'Active', duration: '36 months', fees: 32000 },
  { id: id(), name: 'Diploma in Business Administration', shortCode: 'DIP-BA', type: 'Diploma', school: 'PSB-MC', year: '2025', status: 'Active', duration: '18 months', fees: 18000 },
  { id: id(), name: 'Master of Business Administration', shortCode: 'MBA', type: 'Master Degree', school: 'PSB-MC', year: '2025', status: 'Active', duration: '24 months', fees: 45000 },
  { id: id(), name: 'Bachelor of Arts in Communication', shortCode: 'BA-COMM', type: 'Bachelor Degree', school: 'PSB-STEM', year: '2025', status: 'Active', duration: '36 months', fees: 28000 },
  { id: id(), name: 'Diploma in Information Technology', shortCode: 'DIP-IT', type: 'Diploma', school: 'PSB-STEM', year: '2025', status: 'Active', duration: '18 months', fees: 16000 },
  { id: id(), name: 'Certificate in Digital Marketing', shortCode: 'CERT-DM', type: 'Certificate', school: 'PSB-CC', year: '2025', status: 'Active', duration: '6 months', fees: 8000 },
  { id: id(), name: 'Advanced Diploma in Hospitality', shortCode: 'ADIP-HOSP', type: 'Advanced Diploma', school: 'PSB-CC', year: '2025', status: 'Active', duration: '24 months', fees: 22000 },
  { id: id(), name: 'Bachelor of Engineering (Honours)', shortCode: 'BENG', type: 'Bachelor Degree', school: 'PSB-STEM', year: '2026', status: 'Active', duration: '48 months', fees: 38000 },
  { id: id(), name: 'Diploma in Accounting & Finance', shortCode: 'DIP-AF', type: 'Diploma', school: 'PSB-MC', year: '2026', status: 'Active', duration: '18 months', fees: 17000 },
  { id: id(), name: 'Short Course: Data Analytics', shortCode: 'SC-DA', type: 'Short Course', school: 'PSB-STEM', year: '2026', status: 'Active', duration: '3 months', fees: 5000 },
];

const MODULES = [
  { id: id(), name: 'Introduction to Programming', code: 'CS101', program: 'BSC-CS', type: 'Core', credits: 4, instructor: 'Dr. Tan Wei Lin', status: 'Active' },
  { id: id(), name: 'Data Structures & Algorithms', code: 'CS201', program: 'BSC-CS', type: 'Core', credits: 4, instructor: 'Dr. Lim Kah Seng', status: 'Active' },
  { id: id(), name: 'Database Management Systems', code: 'CS301', program: 'BSC-CS', type: 'Core', credits: 3, instructor: 'Dr. Tan Wei Lin', status: 'Active' },
  { id: id(), name: 'Business Communication', code: 'BA101', program: 'DIP-BA', type: 'Core', credits: 3, instructor: 'Ms. Sarah Chen', status: 'Active' },
  { id: id(), name: 'Principles of Marketing', code: 'BA201', program: 'DIP-BA', type: 'Core', credits: 3, instructor: 'Mr. James Wong', status: 'Active' },
  { id: id(), name: 'Financial Accounting', code: 'AF101', program: 'DIP-AF', type: 'Core', credits: 4, instructor: 'Ms. Rachel Goh', status: 'Active' },
  { id: id(), name: 'Strategic Management', code: 'MBA501', program: 'MBA', type: 'Core', credits: 4, instructor: 'Prof. David Lee', status: 'Active' },
  { id: id(), name: 'Web Development', code: 'IT201', program: 'DIP-IT', type: 'Elective', credits: 3, instructor: 'Mr. Kevin Ng', status: 'Active' },
];

const COHORTS = [
  { id: id(), name: 'BSC-CS Jan 2025', code: 'BSC-CS-JAN25', program: 'BSC-CS', year: '2025', startDate: '2025-01-15', endDate: '2027-12-15', status: 'Active', capacity: 40, enrolled: 35 },
  { id: id(), name: 'DIP-BA Mar 2025', code: 'DIP-BA-MAR25', program: 'DIP-BA', year: '2025', startDate: '2025-03-01', endDate: '2026-08-30', status: 'Active', capacity: 50, enrolled: 42 },
  { id: id(), name: 'MBA Sep 2025', code: 'MBA-SEP25', program: 'MBA', year: '2025', startDate: '2025-09-01', endDate: '2027-08-30', status: 'Upcoming', capacity: 30, enrolled: 18 },
  { id: id(), name: 'DIP-IT Jan 2025', code: 'DIP-IT-JAN25', program: 'DIP-IT', year: '2025', startDate: '2025-01-15', endDate: '2026-06-30', status: 'Active', capacity: 45, enrolled: 40 },
  { id: id(), name: 'CERT-DM Jun 2025', code: 'CERT-DM-JUN25', program: 'CERT-DM', year: '2025', startDate: '2025-06-01', endDate: '2025-11-30', status: 'Completed', capacity: 25, enrolled: 22 },
];

const STUDENTS = [
  { id: id(), studentCode: 'PSB2025001', name: 'Arun Kumar', email: 'arun.kumar@email.com', mobile: '+65 9123 4567', nationality: 'India', dob: '1999-05-15', program: 'BSC-CS', cohort: 'BSC-CS-JAN25', status: 'Active', stage: 'Enrolled', enquiryDate: date(180), agent: 'Global Education Pte Ltd' },
  { id: id(), studentCode: 'PSB2025002', name: 'Li Wei', email: 'li.wei@email.com', mobile: '+65 8234 5678', nationality: 'China', dob: '2000-08-22', program: 'BSC-CS', cohort: 'BSC-CS-JAN25', status: 'Active', stage: 'Enrolled', enquiryDate: date(175), agent: '' },
  { id: id(), studentCode: 'PSB2025003', name: 'Nguyen Thi Mai', email: 'mai.nguyen@email.com', mobile: '+65 9345 6789', nationality: 'Vietnam', dob: '1998-12-03', program: 'DIP-BA', cohort: 'DIP-BA-MAR25', status: 'Active', stage: 'Enrolled', enquiryDate: date(200), agent: 'Asia Pacific Recruitment' },
  { id: id(), studentCode: 'PSB2025004', name: 'Muhammad Rizky', email: 'rizky.m@email.com', mobile: '+65 8456 7890', nationality: 'Indonesia', dob: '2001-03-18', program: 'DIP-IT', cohort: 'DIP-IT-JAN25', status: 'Active', stage: 'Enrolled', enquiryDate: date(160), agent: '' },
  { id: id(), studentCode: 'PSB2025005', name: 'Priya Sharma', email: 'priya.sharma@email.com', mobile: '+65 9567 8901', nationality: 'India', dob: '1997-07-25', program: 'MBA', cohort: 'MBA-SEP25', status: 'Active', stage: 'Enrolled', enquiryDate: date(90), agent: 'Global Education Pte Ltd' },
  { id: id(), studentCode: 'PSB2025006', name: 'Tan Jia Hui', email: 'jiahui.tan@email.com', mobile: '+65 8678 9012', nationality: 'Singapore', dob: '2002-01-10', program: 'CERT-DM', cohort: 'CERT-DM-JUN25', status: 'Graduated', stage: 'Graduated', enquiryDate: date(250), agent: '' },
  { id: id(), studentCode: 'PSB2025007', name: 'Kim Soo Jin', email: 'soojin.kim@email.com', mobile: '+65 9789 0123', nationality: 'South Korea', dob: '1999-09-08', program: 'BA-COMM', cohort: 'BSC-CS-JAN25', status: 'Active', stage: 'Enrolled', enquiryDate: date(170), agent: 'Korea Education Agency' },
  { id: id(), studentCode: 'PSB2025008', name: 'Siti Nurhaliza', email: 'siti.n@email.com', mobile: '+65 8890 1234', nationality: 'Malaysia', dob: '2000-04-14', program: 'DIP-BA', cohort: 'DIP-BA-MAR25', status: 'Active', stage: 'Enrolled', enquiryDate: date(190), agent: '' },
  { id: id(), studentCode: 'PSB2025009', name: 'Tanaka Yuki', email: 'yuki.tanaka@email.com', mobile: '+65 9901 2345', nationality: 'Japan', dob: '1998-11-28', program: 'MBA', cohort: 'MBA-SEP25', status: 'Active', stage: 'Documents Pending', enquiryDate: date(60), agent: 'Japan Student Services' },
  { id: id(), studentCode: 'PSB2025010', name: 'David Rodrigues', email: 'david.r@email.com', mobile: '+65 8012 3456', nationality: 'India', dob: '2001-06-30', program: 'BSC-CS', cohort: 'BSC-CS-JAN25', status: 'Active', stage: 'Enrolled', enquiryDate: date(185), agent: 'Global Education Pte Ltd' },
  { id: id(), studentCode: 'PSB2025011', name: 'Chen Xiao Ming', email: 'xiaoming.c@email.com', mobile: '+65 9111 2222', nationality: 'China', dob: '2000-02-20', program: 'DIP-IT', cohort: 'DIP-IT-JAN25', status: 'Active', stage: 'Enrolled', enquiryDate: date(155), agent: '' },
  { id: id(), studentCode: 'PSB2025012', name: 'Rahul Mehta', email: 'rahul.mehta@email.com', mobile: '+65 8222 3333', nationality: 'India', dob: '1999-10-05', program: 'BENG', cohort: 'BSC-CS-JAN25', status: 'Active', stage: 'Enrolled', enquiryDate: date(140), agent: 'Asia Pacific Recruitment' },
  { id: id(), studentCode: 'PSB2025013', name: 'Maria Santos', email: 'maria.santos@email.com', mobile: '+65 9333 4444', nationality: 'Philippines', dob: '2001-08-12', program: 'DIP-BA', cohort: 'DIP-BA-MAR25', status: 'Withdrawn', stage: 'Withdrawn', enquiryDate: date(210), agent: '' },
  { id: id(), studentCode: 'PSB2025014', name: 'Lwin Myo Aung', email: 'lwin.myo@email.com', mobile: '+65 8444 5555', nationality: 'Myanmar', dob: '1998-03-25', program: 'DIP-AF', cohort: 'DIP-BA-MAR25', status: 'Active', stage: 'Enrolled', enquiryDate: date(195), agent: '' },
  { id: id(), studentCode: 'PSB2025015', name: 'Patel Anisha', email: 'anisha.p@email.com', mobile: '+65 9555 6666', nationality: 'India', dob: '2000-12-18', program: 'SC-DA', cohort: 'CERT-DM-JUN25', status: 'Active', stage: 'New Enquiry', enquiryDate: date(30), agent: 'Global Education Pte Ltd' },
  { id: id(), studentCode: 'PSB2025016', name: 'Wattana Chai', email: 'wattana.c@email.com', mobile: '+65 8666 7777', nationality: 'Thailand', dob: '1999-07-09', program: 'ADIP-HOSP', cohort: 'DIP-IT-JAN25', status: 'Active', stage: 'Enrolled', enquiryDate: date(150), agent: '' },
  { id: id(), studentCode: 'PSB2025017', name: 'Sophie Anderson', email: 'sophie.a@email.com', mobile: '+65 9777 8888', nationality: 'Australia', dob: '2001-04-02', program: 'BA-COMM', cohort: 'BSC-CS-JAN25', status: 'Active', stage: 'Application Submitted', enquiryDate: date(45), agent: '' },
  { id: id(), studentCode: 'PSB2025018', name: 'Ahmad Bin Hassan', email: 'ahmad.h@email.com', mobile: '+65 8888 9999', nationality: 'Malaysia', dob: '2000-09-15', program: 'DIP-IT', cohort: 'DIP-IT-JAN25', status: 'Suspended', stage: 'Suspended', enquiryDate: date(165), agent: '' },
  { id: id(), studentCode: 'PSB2025019', name: 'Raj Patel', email: 'raj.patel@email.com', mobile: '+65 9999 0000', nationality: 'India', dob: '1997-01-30', program: 'MBA', cohort: 'MBA-SEP25', status: 'Active', stage: 'Offer Issued', enquiryDate: date(75), agent: 'Asia Pacific Recruitment' },
  { id: id(), studentCode: 'PSB2025020', name: 'Yoko Yamamoto', email: 'yoko.y@email.com', mobile: '+65 8000 1111', nationality: 'Japan', dob: '1999-06-20', program: 'CERT-DM', cohort: 'CERT-DM-JUN25', status: 'Graduated', stage: 'Graduated', enquiryDate: date(260), agent: 'Japan Student Services' },
];

const EMPLOYEES = [
  { id: id(), name: 'Dr. Tan Wei Lin', code: 'EMP001', username: 'tanwl', email: 'tanwl@psb.edu.sg', mobile: '+65 9100 0001', type: 'Teaching', type2: 'Full-Time', designation: 'Senior Lecturer', department: 'Computer Science', status: 'Active', joinDate: '2018-03-15' },
  { id: id(), name: 'Dr. Lim Kah Seng', code: 'EMP002', username: 'limks', email: 'limks@psb.edu.sg', mobile: '+65 9100 0002', type: 'Teaching', type2: 'Full-Time', designation: 'Associate Professor', department: 'Computer Science', status: 'Active', joinDate: '2015-08-01' },
  { id: id(), name: 'Ms. Sarah Chen', code: 'EMP003', username: 'chens', email: 'chens@psb.edu.sg', mobile: '+65 9100 0003', type: 'Teaching', type2: 'Full-Time', designation: 'Lecturer', department: 'Business', status: 'Active', joinDate: '2020-01-10' },
  { id: id(), name: 'Mr. James Wong', code: 'EMP004', username: 'wongj', email: 'wongj@psb.edu.sg', mobile: '+65 9100 0004', type: 'Teaching', type2: 'Part-Time', designation: 'Lecturer', department: 'Marketing', status: 'Active', joinDate: '2021-06-01' },
  { id: id(), name: 'Ms. Rachel Goh', code: 'EMP005', username: 'gohr', email: 'gohr@psb.edu.sg', mobile: '+65 9100 0005', type: 'Teaching', type2: 'Full-Time', designation: 'Lecturer', department: 'Finance', status: 'Active', joinDate: '2019-09-15' },
  { id: id(), name: 'Prof. David Lee', code: 'EMP006', username: 'leed', email: 'leed@psb.edu.sg', mobile: '+65 9100 0006', type: 'Teaching', type2: 'Full-Time', designation: 'Professor', department: 'Management', status: 'Active', joinDate: '2012-01-01' },
  { id: id(), name: 'Mr. Kevin Ng', code: 'EMP007', username: 'ngk', email: 'ngk@psb.edu.sg', mobile: '+65 9100 0007', type: 'Teaching', type2: 'Full-Time', designation: 'Lecturer', department: 'Information Technology', status: 'Active', joinDate: '2022-03-01' },
  { id: id(), name: 'Ms. Amy Lim', code: 'EMP008', username: 'lima', email: 'lima@psb.edu.sg', mobile: '+65 9100 0008', type: 'Administrative', type2: 'Full-Time', designation: 'Admin Officer', department: 'Student Services', status: 'Active', joinDate: '2019-05-20' },
  { id: id(), name: 'Mr. John Tan', code: 'EMP009', username: 'tanj', email: 'tanj@psb.edu.sg', mobile: '+65 9100 0009', type: 'Administrative', type2: 'Full-Time', designation: 'Manager', department: 'Finance', status: 'Active', joinDate: '2016-11-01' },
  { id: id(), name: 'Ms. Linda Ho', code: 'EMP010', username: 'hol', email: 'hol@psb.edu.sg', mobile: '+65 9100 0010', type: 'Management', type2: 'Full-Time', designation: 'Director', department: 'Admissions', status: 'Active', joinDate: '2014-07-15' },
];

const INVOICES = [
  { id: id(), invoiceNumber: 'INV-2025-0001', date: date(30), dueDate: date(-15), studentCode: 'PSB2025001', studentName: 'Arun Kumar', amount: 8000, taxAmount: 560, totalAmount: 8560, status: 'Paid', invoiceTo: 'Arun Kumar' },
  { id: id(), invoiceNumber: 'INV-2025-0002', date: date(28), dueDate: date(-13), studentCode: 'PSB2025002', studentName: 'Li Wei', amount: 8000, taxAmount: 560, totalAmount: 8560, status: 'Paid', invoiceTo: 'Li Wei' },
  { id: id(), invoiceNumber: 'INV-2025-0003', date: date(25), dueDate: date(-10), studentCode: 'PSB2025003', studentName: 'Nguyen Thi Mai', amount: 6000, taxAmount: 420, totalAmount: 6420, status: 'Partially Paid', invoiceTo: 'Nguyen Thi Mai' },
  { id: id(), invoiceNumber: 'INV-2025-0004', date: date(20), dueDate: date(-5), studentCode: 'PSB2025004', studentName: 'Muhammad Rizky', amount: 5333, taxAmount: 373, totalAmount: 5706, status: 'Overdue', invoiceTo: 'Muhammad Rizky' },
  { id: id(), invoiceNumber: 'INV-2025-0005', date: date(15), dueDate: date(0), studentCode: 'PSB2025005', studentName: 'Priya Sharma', amount: 15000, taxAmount: 1050, totalAmount: 16050, status: 'Sent', invoiceTo: 'Priya Sharma' },
  { id: id(), invoiceNumber: 'INV-2025-0006', date: date(10), dueDate: date(5), studentCode: 'PSB2025007', studentName: 'Kim Soo Jin', amount: 9333, taxAmount: 653, totalAmount: 9986, status: 'Generated', invoiceTo: 'Kim Soo Jin' },
  { id: id(), invoiceNumber: 'INV-2025-0007', date: date(5), dueDate: date(10), studentCode: 'PSB2025008', studentName: 'Siti Nurhaliza', amount: 6000, taxAmount: 420, totalAmount: 6420, status: 'Sent', invoiceTo: 'Siti Nurhaliza' },
  { id: id(), invoiceNumber: 'INV-2025-0008', date: date(3), dueDate: date(12), studentCode: 'PSB2025010', studentName: 'David Rodrigues', amount: 8000, taxAmount: 560, totalAmount: 8560, status: 'Generated', invoiceTo: 'David Rodrigues' },
  { id: id(), invoiceNumber: 'INV-2025-0009', date: date(60), dueDate: date(25), studentCode: 'PSB2025006', studentName: 'Tan Jia Hui', amount: 4000, taxAmount: 280, totalAmount: 4280, status: 'Paid', invoiceTo: 'Tan Jia Hui' },
  { id: id(), invoiceNumber: 'INV-2025-0010', date: date(55), dueDate: date(20), studentCode: 'PSB2025011', studentName: 'Chen Xiao Ming', amount: 5333, taxAmount: 373, totalAmount: 5706, status: 'Paid', invoiceTo: 'Chen Xiao Ming' },
  { id: id(), invoiceNumber: 'INV-2025-0011', date: date(50), dueDate: date(15), studentCode: 'PSB2025012', studentName: 'Rahul Mehta', amount: 9500, taxAmount: 665, totalAmount: 10165, status: 'Partially Paid', invoiceTo: 'Rahul Mehta' },
  { id: id(), invoiceNumber: 'INV-2025-0012', date: date(2), dueDate: date(17), studentCode: 'PSB2025014', studentName: 'Lwin Myo Aung', amount: 5667, taxAmount: 397, totalAmount: 6064, status: 'Generated', invoiceTo: 'Lwin Myo Aung' },
  { id: id(), invoiceNumber: 'INV-2025-0013', date: date(45), dueDate: date(10), studentCode: 'PSB2025016', studentName: 'Wattana Chai', amount: 7333, taxAmount: 513, totalAmount: 7846, status: 'Paid', invoiceTo: 'Wattana Chai' },
  { id: id(), invoiceNumber: 'INV-2025-0014', date: date(1), dueDate: date(16), studentCode: 'PSB2025019', studentName: 'Raj Patel', amount: 15000, taxAmount: 1050, totalAmount: 16050, status: 'Sent', invoiceTo: 'Raj Patel' },
  { id: id(), invoiceNumber: 'INV-2025-0015', date: date(40), dueDate: date(5), studentCode: 'PSB2025020', studentName: 'Yoko Yamamoto', amount: 4000, taxAmount: 280, totalAmount: 4280, status: 'Paid', invoiceTo: 'Yoko Yamamoto' },
];

const CREDIT_NOTES = [
  { id: id(), creditNoteNumber: 'CN-2025-001', date: date(20), studentName: 'Nguyen Thi Mai', studentCode: 'PSB2025003', invoiceNumber: 'INV-2025-0003', amount: 1000, taxAmount: 70, total: 1070, businessApproval: 'Approved', financeApproval: 'Approved', status: 'Finance Approved' },
  { id: id(), creditNoteNumber: 'CN-2025-002', date: date(15), studentName: 'Muhammad Rizky', studentCode: 'PSB2025004', invoiceNumber: 'INV-2025-0004', amount: 500, taxAmount: 35, total: 535, businessApproval: 'Approved', financeApproval: 'Pending', status: 'Business Approved' },
  { id: id(), creditNoteNumber: 'CN-2025-003', date: date(10), studentName: 'Maria Santos', studentCode: 'PSB2025013', invoiceNumber: 'INV-2025-0003', amount: 3000, taxAmount: 210, total: 3210, businessApproval: 'Pending', financeApproval: 'Pending', status: 'Pending Approval' },
  { id: id(), creditNoteNumber: 'CN-2025-004', date: date(5), studentName: 'Rahul Mehta', studentCode: 'PSB2025012', invoiceNumber: 'INV-2025-0011', amount: 2000, taxAmount: 140, total: 2140, businessApproval: 'Approved', financeApproval: 'Approved', status: 'Finance Approved' },
  { id: id(), creditNoteNumber: 'CN-2025-005', date: date(2), studentName: 'Ahmad Bin Hassan', studentCode: 'PSB2025018', invoiceNumber: 'INV-2025-0004', amount: 5333, taxAmount: 373, total: 5706, businessApproval: 'Rejected', financeApproval: 'N/A', status: 'Rejected' },
];

const REFUNDS = [
  { id: id(), adviceNumber: 'REF-2025-001', date: date(18), studentName: 'Maria Santos', studentCode: 'PSB2025013', amount: 6000, status: 'Processed', paymentMethod: 'Telegraphic Transfer', bankBranch: 'DBS Marina Bay' },
  { id: id(), adviceNumber: 'REF-2025-002', date: date(12), studentName: 'Ahmad Bin Hassan', studentCode: 'PSB2025018', amount: 5333, status: 'Pending', paymentMethod: 'CHEQUE', bankBranch: 'OCBC Orchard' },
  { id: id(), adviceNumber: 'REF-2025-003', date: date(8), studentName: 'Tan Jia Hui', studentCode: 'PSB2025006', amount: 1000, status: 'Approved', paymentMethod: 'iBanking', bankBranch: 'UOB Main' },
  { id: id(), adviceNumber: 'REF-2025-004', date: date(3), studentName: 'Yoko Yamamoto', studentCode: 'PSB2025020', amount: 2000, status: 'Pending', paymentMethod: 'Telegraphic Transfer', bankBranch: 'DBS Toa Payoh' },
  { id: id(), adviceNumber: 'REF-2025-005', date: date(1), studentName: 'Nguyen Thi Mai', studentCode: 'PSB2025003', amount: 500, status: 'Rejected', paymentMethod: 'CASH', bankBranch: '' },
];

const TICKETS = [
  { id: id(), identifier: 'TKT-001', type: 'Academic', raisedBy: 'Arun Kumar', studentCode: 'PSB2025001', moduleName: 'Data Structures & Algorithms', moduleCode: 'CS201', remarks: 'Request for grade review', status: 'Open', date: date(5) },
  { id: id(), identifier: 'TKT-002', type: 'Financial', raisedBy: 'Li Wei', studentCode: 'PSB2025002', moduleName: '', moduleCode: '', remarks: 'Payment not reflected in account', status: 'In Progress', date: date(3) },
  { id: id(), identifier: 'TKT-003', type: 'Administrative', raisedBy: 'Nguyen Thi Mai', studentCode: 'PSB2025003', moduleName: '', moduleCode: '', remarks: 'Name correction on student pass', status: 'Resolved', date: date(10) },
  { id: id(), identifier: 'TKT-004', type: 'Technical', raisedBy: 'Muhammad Rizky', studentCode: 'PSB2025004', moduleName: 'Web Development', moduleCode: 'IT201', remarks: 'Cannot access online learning portal', status: 'Open', date: date(1) },
  { id: id(), identifier: 'TKT-005', type: 'Academic', raisedBy: 'Priya Sharma', studentCode: 'PSB2025005', moduleName: 'Strategic Management', moduleCode: 'MBA501', remarks: 'Request for module appeal', status: 'In Progress', date: date(7) },
  { id: id(), identifier: 'TKT-006', type: 'General', raisedBy: 'Kim Soo Jin', studentCode: 'PSB2025007', moduleName: '', moduleCode: '', remarks: 'Facilities complaint - aircon in room 302', status: 'Closed', date: date(15) },
  { id: id(), identifier: 'TKT-007', type: 'Financial', raisedBy: 'Siti Nurhaliza', studentCode: 'PSB2025008', moduleName: '', moduleCode: '', remarks: 'Request for installment plan modification', status: 'Open', date: date(2) },
  { id: id(), identifier: 'TKT-008', type: 'Academic', raisedBy: 'David Rodrigues', studentCode: 'PSB2025010', moduleName: 'Database Management Systems', moduleCode: 'CS301', remarks: 'Request for supplementary exam', status: 'In Progress', date: date(4) },
  { id: id(), identifier: 'TKT-009', type: 'Administrative', raisedBy: 'Chen Xiao Ming', studentCode: 'PSB2025011', moduleName: '', moduleCode: '', remarks: 'Student pass renewal assistance', status: 'Resolved', date: date(20) },
  { id: id(), identifier: 'TKT-010', type: 'Academic', raisedBy: 'Rahul Mehta', studentCode: 'PSB2025012', moduleName: 'Introduction to Programming', moduleCode: 'CS101', remarks: 'Plagiarism allegation - requesting review', status: 'Open', date: date(6) },
];

const AGENTS = [
  { id: id(), name: 'John Smith', company: 'Global Education Pte Ltd', country: 'Singapore', email: 'john@globaledu.sg', mobile: '+65 9200 0001', status: 'Active', contractStatus: 'Active', commission: 10, countries: ['Singapore', 'India', 'Bangladesh'] },
  { id: id(), name: 'Maria Garcia', company: 'Asia Pacific Recruitment', country: 'Malaysia', email: 'maria@aprecruitment.my', mobile: '+60 1234 5678', status: 'Active', contractStatus: 'Active', commission: 12, countries: ['Malaysia', 'Indonesia', 'Philippines'] },
  { id: id(), name: 'Yuki Tanaka', company: 'Japan Student Services', country: 'Japan', email: 'yuki@jss.co.jp', mobile: '+81 90 1234 5678', status: 'Active', contractStatus: 'Active', commission: 8, countries: ['Japan', 'South Korea'] },
  { id: id(), name: 'Park Min Ji', company: 'Korea Education Agency', country: 'South Korea', email: 'minji@kea.kr', mobile: '+82 10 1234 5678', status: 'Active', contractStatus: 'Active', commission: 9, countries: ['South Korea'] },
  { id: id(), name: 'Raj Kumar', company: 'India Study Abroad', country: 'India', email: 'raj@istudy.in', mobile: '+91 98765 43210', status: 'Pending Approval', contractStatus: 'Draft', commission: 11, countries: ['India', 'Nepal', 'Sri Lanka'] },
];

const TESTS = [
  { id: id(), testId: 'TEST-001', name: 'CS101 Mid-Term Exam', program: 'BSC-CS', module: 'CS101', moduleName: 'Introduction to Programming', category: 'Mid-Term', type: 'Mixed', date: date(30), duration: 120, maxMarks: 100, passMarks: 50, status: 'Published', year: '2025' },
  { id: id(), testId: 'TEST-002', name: 'CS201 Final Exam', program: 'BSC-CS', module: 'CS201', moduleName: 'Data Structures & Algorithms', category: 'Final', type: 'Essay', date: date(15), duration: 180, maxMarks: 100, passMarks: 50, status: 'Published', year: '2025' },
  { id: id(), testId: 'TEST-003', name: 'BA101 Quiz 1', program: 'DIP-BA', module: 'BA101', moduleName: 'Business Communication', category: 'Quiz', type: 'MCQ', date: date(20), duration: 30, maxMarks: 50, passMarks: 25, status: 'Published', year: '2025' },
  { id: id(), testId: 'TEST-004', name: 'MBA501 Assignment', program: 'MBA', module: 'MBA501', moduleName: 'Strategic Management', category: 'Assignment', type: 'Essay', date: date(10), duration: 0, maxMarks: 100, passMarks: 50, status: 'Published', year: '2025' },
  { id: id(), testId: 'TEST-005', name: 'IT201 Practical Exam', program: 'DIP-IT', module: 'IT201', moduleName: 'Web Development', category: 'Practical', type: 'Practical', date: date(5), duration: 120, maxMarks: 100, passMarks: 50, status: 'Draft', year: '2025' },
];

const USERS = [
  { id: id(), name: 'Manoj', username: 'manoj', role: 'Admin', userType: 'Staff', status: 'Active' },
  { id: id(), name: 'Dr. Tan Wei Lin', username: 'tanwl', role: 'Academic Staff', userType: 'Instructor', status: 'Active' },
  { id: id(), name: 'Ms. Amy Lim', username: 'lima', role: 'Admissions Staff', userType: 'Staff', status: 'Active' },
  { id: id(), name: 'Mr. John Tan', username: 'tanj', role: 'Finance Staff', userType: 'Staff', status: 'Active' },
  { id: id(), name: 'Ms. Linda Ho', username: 'hol', role: 'Admin', userType: 'Management', status: 'Active' },
];

const MESSAGE_TEMPLATES = [
  { id: id(), name: 'Welcome Email', channel: 'Email', subject: 'Welcome to PSB Academy', body: 'Dear {studentName}, Welcome to PSB Academy...' },
  { id: id(), name: 'Payment Reminder', channel: 'Email', subject: 'Payment Reminder - PSB Academy', body: 'Dear {studentName}, This is a reminder that your payment of ${amount} is due on {dueDate}...' },
  { id: id(), name: 'Class Schedule Update', channel: 'SMS', subject: '', body: 'PSB Academy: Your class schedule has been updated. Please check the portal for details.' },
];

const MESSAGES = [
  { id: id(), from: 'System', to: 'Arun Kumar', mobile: '+65 9123 4567', email: 'arun.kumar@email.com', channel: 'Email', status: 'Delivered', user: 'manoj', content: 'Welcome to PSB Academy...', date: date(30), gatewayResponse: 'OK' },
  { id: id(), from: 'System', to: 'Li Wei', mobile: '+65 8234 5678', email: 'li.wei@email.com', channel: 'Email', status: 'Delivered', user: 'manoj', content: 'Payment reminder...', date: date(25), gatewayResponse: 'OK' },
  { id: id(), from: 'System', to: 'Nguyen Thi Mai', mobile: '+65 9345 6789', email: 'mai.nguyen@email.com', channel: 'SMS', status: 'Failed', user: 'lima', content: 'Class schedule update...', date: date(20), gatewayResponse: 'UNDELIVERABLE' },
  { id: id(), from: 'System', to: 'Muhammad Rizky', mobile: '+65 8456 7890', email: 'rizky.m@email.com', channel: 'Email', status: 'Sent', user: 'manoj', content: 'Document submission reminder...', date: date(15), gatewayResponse: 'QUEUED' },
  { id: id(), from: 'System', to: 'Priya Sharma', mobile: '+65 9567 8901', email: 'priya.sharma@email.com', channel: 'Email', status: 'Delivered', user: 'hol', content: 'Offer letter attached...', date: date(10), gatewayResponse: 'OK' },
];

const HOLIDAYS = [
  { id: id(), name: "New Year's Day", date: '2025-01-01', type: 'Public Holiday' },
  { id: id(), name: 'Chinese New Year', date: '2025-01-29', type: 'Public Holiday' },
  { id: id(), name: 'Chinese New Year (2nd Day)', date: '2025-01-30', type: 'Public Holiday' },
  { id: id(), name: 'Good Friday', date: '2025-04-18', type: 'Public Holiday' },
  { id: id(), name: 'Labour Day', date: '2025-05-01', type: 'Public Holiday' },
  { id: id(), name: 'Vesak Day', date: '2025-05-12', type: 'Public Holiday' },
  { id: id(), name: 'Hari Raya Haji', date: '2025-06-07', type: 'Public Holiday' },
  { id: id(), name: 'National Day', date: '2025-08-09', type: 'Public Holiday' },
  { id: id(), name: 'Deepavali', date: '2025-10-20', type: 'Public Holiday' },
  { id: id(), name: 'Christmas Day', date: '2025-12-25', type: 'Public Holiday' },
];

const INSTALLMENT_TEMPLATES = [
  { id: id(), templateId: 'IT-001', name: 'BSC Standard 4-Term', program: 'BSC-CS', year: '2025', installments: 4, totalAmount: 32000, status: 'Active' },
  { id: id(), templateId: 'IT-002', name: 'Diploma 3-Term', program: 'DIP-BA', year: '2025', installments: 3, totalAmount: 18000, status: 'Active' },
  { id: id(), templateId: 'IT-003', name: 'MBA 4-Term', program: 'MBA', year: '2025', installments: 4, totalAmount: 45000, status: 'Active' },
  { id: id(), templateId: 'IT-004', name: 'Certificate Full Payment', program: 'CERT-DM', year: '2025', installments: 1, totalAmount: 8000, status: 'Active' },
];

const STUDY_RESOURCES = [
  { id: id(), name: 'CS101 Lecture Notes', type: 'PDF', module: 'CS101', size: '2.5 MB', uploadDate: date(60), status: 'Published' },
  { id: id(), name: 'Data Structures Video Series', type: 'Video', module: 'CS201', size: '500 MB', uploadDate: date(45), status: 'Published' },
  { id: id(), name: 'Business Communication Handbook', type: 'PDF', module: 'BA101', size: '5 MB', uploadDate: date(90), status: 'Published' },
  { id: id(), name: 'Marketing Case Studies', type: 'Document', module: 'BA201', size: '3 MB', uploadDate: date(30), status: 'Draft' },
  { id: id(), name: 'SQL Practice Database', type: 'Link', module: 'CS301', size: '', uploadDate: date(20), status: 'Published' },
];

const INVOICE_RUNS = [
  { id: id(), runId: 'RUN-2025-001', runDate: date(30), dueFrom: date(45), dueTo: date(30), startInvoice: 'INV-2025-0001', endInvoice: 'INV-2025-0005', runBy: 'manoj', status: 'Completed', type: 'Regular' },
  { id: id(), runId: 'RUN-2025-002', runDate: date(15), dueFrom: date(30), dueTo: date(15), startInvoice: 'INV-2025-0006', endInvoice: 'INV-2025-0010', runBy: 'tanj', status: 'Completed', type: 'Regular' },
  { id: id(), runId: 'RUN-2025-003', runDate: date(1), dueFrom: date(15), dueTo: date(1), startInvoice: 'INV-2025-0011', endInvoice: 'INV-2025-0015', runBy: 'manoj', status: 'Completed', type: 'Regular' },
];

const TIMETABLE = [
  { id: id(), module: 'CS101', moduleName: 'Introduction to Programming', cohort: 'BSC-CS-JAN25', day: 'Monday', time: '09:00 - 12:00', room: 'Lab 301', instructor: 'Dr. Tan Wei Lin' },
  { id: id(), module: 'CS201', moduleName: 'Data Structures & Algorithms', cohort: 'BSC-CS-JAN25', day: 'Tuesday', time: '14:00 - 17:00', room: 'LT-201', instructor: 'Dr. Lim Kah Seng' },
  { id: id(), module: 'CS301', moduleName: 'Database Management Systems', cohort: 'BSC-CS-JAN25', day: 'Wednesday', time: '09:00 - 12:00', room: 'Lab 302', instructor: 'Dr. Tan Wei Lin' },
  { id: id(), module: 'BA101', moduleName: 'Business Communication', cohort: 'DIP-BA-MAR25', day: 'Monday', time: '14:00 - 17:00', room: 'SR-101', instructor: 'Ms. Sarah Chen' },
  { id: id(), module: 'BA201', moduleName: 'Principles of Marketing', cohort: 'DIP-BA-MAR25', day: 'Thursday', time: '09:00 - 12:00', room: 'SR-102', instructor: 'Mr. James Wong' },
  { id: id(), module: 'MBA501', moduleName: 'Strategic Management', cohort: 'MBA-SEP25', day: 'Friday', time: '18:00 - 21:00', room: 'SR-201', instructor: 'Prof. David Lee' },
  { id: id(), module: 'IT201', moduleName: 'Web Development', cohort: 'DIP-IT-JAN25', day: 'Wednesday', time: '14:00 - 17:00', room: 'Lab 303', instructor: 'Mr. Kevin Ng' },
];

const STICKY_NOTES = [
  { id: id(), text: 'Follow up on MBA admissions', pos_x: 50, pos_y: 30, width: 200, height: 150, color: '#FFEB3B' },
  { id: id(), text: 'Invoice run scheduled for Friday', pos_x: 300, pos_y: 50, width: 200, height: 150, color: '#81D4FA' },
  { id: id(), text: 'Review agent contracts expiring this month', pos_x: 550, pos_y: 30, width: 200, height: 150, color: '#A5D6A7' },
];

const DOCUMENTS = [
  { id: id(), studentCode: 'PSB2025001', studentName: 'Arun Kumar', documentType: 'Passport', status: 'Verified', expiryDate: '2028-05-15', uploadDate: date(170) },
  { id: id(), studentCode: 'PSB2025001', studentName: 'Arun Kumar', documentType: 'Degree Certificate', status: 'Verified', expiryDate: '', uploadDate: date(170) },
  { id: id(), studentCode: 'PSB2025002', studentName: 'Li Wei', documentType: 'Passport', status: 'Verified', expiryDate: '2029-08-22', uploadDate: date(165) },
  { id: id(), studentCode: 'PSB2025003', studentName: 'Nguyen Thi Mai', documentType: 'English Proficiency', status: 'Pending', expiryDate: '2026-12-03', uploadDate: date(190) },
  { id: id(), studentCode: 'PSB2025004', studentName: 'Muhammad Rizky', documentType: 'Transcript', status: 'Received', expiryDate: '', uploadDate: date(155) },
  { id: id(), studentCode: 'PSB2025009', studentName: 'Tanaka Yuki', documentType: 'Passport', status: 'Pending', expiryDate: '2027-11-28', uploadDate: date(55) },
  { id: id(), studentCode: 'PSB2025009', studentName: 'Tanaka Yuki', documentType: 'SOP', status: 'Pending', expiryDate: '', uploadDate: date(55) },
];

const DISCOUNTS = [
  { id: id(), discountId: 'DISC-001', name: 'Early Bird Discount', headName: 'Tuition Fee', headType: 'Percentage', amount: 10, status: 'Active' },
  { id: id(), discountId: 'DISC-002', name: 'Alumni Referral', headName: 'Tuition Fee', headType: 'Fixed', amount: 500, status: 'Active' },
  { id: id(), discountId: 'DISC-003', name: 'Merit Scholarship', headName: 'Tuition Fee', headType: 'Percentage', amount: 25, status: 'Active' },
];

const PROMOCODES = [
  { id: id(), code: 'EARLY2025', name: 'Early Bird 2025', discount: 10, type: 'Percentage', validFrom: '2025-01-01', validTo: '2025-03-31', status: 'Expired', usageCount: 45 },
  { id: id(), code: 'REFER500', name: 'Referral Bonus', discount: 500, type: 'Fixed', validFrom: '2025-01-01', validTo: '2025-12-31', status: 'Active', usageCount: 23 },
  { id: id(), code: 'SUMMER2025', name: 'Summer Intake Special', discount: 15, type: 'Percentage', validFrom: '2025-05-01', validTo: '2025-07-31', status: 'Active', usageCount: 12 },
];

const INTAKES = [
  { id: id(), year: '2025', term: 'Term 1', startDate: '2025-01-15', endDate: '2025-04-30', status: 'Active' },
  { id: id(), year: '2025', term: 'Term 2', startDate: '2025-05-01', endDate: '2025-08-31', status: 'Active' },
  { id: id(), year: '2025', term: 'Term 3', startDate: '2025-09-01', endDate: '2025-12-31', status: 'Upcoming' },
  { id: id(), year: '2026', term: 'Term 1', startDate: '2026-01-15', endDate: '2026-04-30', status: 'Upcoming' },
];

const COUNTRIES_DATA = [
  { id: id(), name: 'Singapore', code: 'SG', region: 'Southeast Asia' },
  { id: id(), name: 'Malaysia', code: 'MY', region: 'Southeast Asia' },
  { id: id(), name: 'Indonesia', code: 'ID', region: 'Southeast Asia' },
  { id: id(), name: 'India', code: 'IN', region: 'South Asia' },
  { id: id(), name: 'China', code: 'CN', region: 'East Asia' },
  { id: id(), name: 'Vietnam', code: 'VN', region: 'Southeast Asia' },
  { id: id(), name: 'Japan', code: 'JP', region: 'East Asia' },
  { id: id(), name: 'South Korea', code: 'KR', region: 'East Asia' },
  { id: id(), name: 'Philippines', code: 'PH', region: 'Southeast Asia' },
  { id: id(), name: 'Thailand', code: 'TH', region: 'Southeast Asia' },
  { id: id(), name: 'Myanmar', code: 'MM', region: 'Southeast Asia' },
  { id: id(), name: 'Australia', code: 'AU', region: 'Oceania' },
  { id: id(), name: 'United Kingdom', code: 'GB', region: 'Europe' },
  { id: id(), name: 'United States', code: 'US', region: 'North America' },
  { id: id(), name: 'Bangladesh', code: 'BD', region: 'South Asia' },
  { id: id(), name: 'Sri Lanka', code: 'LK', region: 'South Asia' },
  { id: id(), name: 'Nepal', code: 'NP', region: 'South Asia' },
  { id: id(), name: 'Cambodia', code: 'KH', region: 'Southeast Asia' },
  { id: id(), name: 'Brunei', code: 'BN', region: 'Southeast Asia' },
  { id: id(), name: 'Kazakhstan', code: 'KZ', region: 'Central Asia' },
];

const AUDIT_TRAIL = [
  { id: id(), action: 'Login', user: 'manoj', userType: 'Admin', target: 'System', details: 'User logged in', timestamp: date(0) + ' 09:00:00', ipAddress: '192.168.1.100' },
  { id: id(), action: 'Update', user: 'manoj', userType: 'Admin', target: 'Student PSB2025001', details: 'Status changed from Pending to Active', timestamp: date(1) + ' 10:30:00', ipAddress: '192.168.1.100' },
  { id: id(), action: 'Create', user: 'lima', userType: 'Staff', target: 'Invoice INV-2025-0015', details: 'New invoice generated', timestamp: date(1) + ' 14:00:00', ipAddress: '192.168.1.101' },
  { id: id(), action: 'Delete', user: 'manoj', userType: 'Admin', target: 'Message Template', details: 'Deleted obsolete template', timestamp: date(2) + ' 11:00:00', ipAddress: '192.168.1.100' },
  { id: id(), action: 'Update', user: 'tanj', userType: 'Staff', target: 'Refund REF-2025-003', details: 'Refund approved', timestamp: date(3) + ' 16:00:00', ipAddress: '192.168.1.102' },
];

const PRODUCTS = [
  { id: id(), name: 'BSC Computer Science', code: 'PROD-BSC-CS', type: 'Degree', program: 'BSC-CS', price: 32000, status: 'Active' },
  { id: id(), name: 'Diploma Business Admin', code: 'PROD-DIP-BA', type: 'Diploma', program: 'DIP-BA', price: 18000, status: 'Active' },
  { id: id(), name: 'MBA Program', code: 'PROD-MBA', type: 'Degree', program: 'MBA', price: 45000, status: 'Active' },
  { id: id(), name: 'Certificate Digital Marketing', code: 'PROD-CERT-DM', type: 'Certificate', program: 'CERT-DM', price: 8000, status: 'Active' },
  { id: id(), name: 'Diploma IT', code: 'PROD-DIP-IT', type: 'Diploma', program: 'DIP-IT', price: 16000, status: 'Active' },
];

const SECTIONS = [
  { id: id(), name: 'CS101-S1', cohort: 'BSC-CS-JAN25', module: 'CS101', instructor: 'Dr. Tan Wei Lin', capacity: 40, enrolled: 35, room: 'Lab 301', day: 'Monday', time: '09:00-12:00', status: 'Active' },
  { id: id(), name: 'CS201-S1', cohort: 'BSC-CS-JAN25', module: 'CS201', instructor: 'Dr. Lim Kah Seng', capacity: 40, enrolled: 35, room: 'LT-201', day: 'Tuesday', time: '14:00-17:00', status: 'Active' },
  { id: id(), name: 'BA101-S1', cohort: 'DIP-BA-MAR25', module: 'BA101', instructor: 'Ms. Sarah Chen', capacity: 50, enrolled: 42, room: 'SR-101', day: 'Monday', time: '14:00-17:00', status: 'Active' },
  { id: id(), name: 'MBA501-S1', cohort: 'MBA-SEP25', module: 'MBA501', instructor: 'Prof. David Lee', capacity: 30, enrolled: 18, room: 'SR-201', day: 'Friday', time: '18:00-21:00', status: 'Active' },
  { id: id(), name: 'IT201-S1', cohort: 'DIP-IT-JAN25', module: 'IT201', instructor: 'Mr. Kevin Ng', capacity: 45, enrolled: 40, room: 'Lab 303', day: 'Wednesday', time: '14:00-17:00', status: 'Active' },
];

const TERMS = [
  { id: id(), name: 'Term 1 2025', year: '2025', term: 'Term 1', startDate: '2025-01-15', endDate: '2025-04-30', isCurrent: true, status: 'Active' },
  { id: id(), name: 'Term 2 2025', year: '2025', term: 'Term 2', startDate: '2025-05-01', endDate: '2025-08-31', isCurrent: false, status: 'Active' },
  { id: id(), name: 'Term 3 2025', year: '2025', term: 'Term 3', startDate: '2025-09-01', endDate: '2025-12-31', isCurrent: false, status: 'Upcoming' },
  { id: id(), name: 'Term 1 2026', year: '2026', term: 'Term 1', startDate: '2026-01-15', endDate: '2026-04-30', isCurrent: false, status: 'Upcoming' },
];

const PRICING_MATRIX = [
  { id: id(), program: 'BSC-CS', nationality: 'Singapore', feeHead: 'Tuition Fee', amount: 28000, gst: 9, total: 30520, status: 'Active' },
  { id: id(), program: 'BSC-CS', nationality: 'International', feeHead: 'Tuition Fee', amount: 32000, gst: 9, total: 34880, status: 'Active' },
  { id: id(), program: 'DIP-BA', nationality: 'Singapore', feeHead: 'Tuition Fee', amount: 15000, gst: 9, total: 16350, status: 'Active' },
  { id: id(), program: 'DIP-BA', nationality: 'International', feeHead: 'Tuition Fee', amount: 18000, gst: 9, total: 19620, status: 'Active' },
  { id: id(), program: 'MBA', nationality: 'International', feeHead: 'Tuition Fee', amount: 45000, gst: 9, total: 49050, status: 'Active' },
  { id: id(), program: 'BSC-CS', nationality: 'International', feeHead: 'Registration Fee', amount: 500, gst: 9, total: 545, status: 'Active' },
  { id: id(), program: 'DIP-BA', nationality: 'International', feeHead: 'Registration Fee', amount: 400, gst: 9, total: 436, status: 'Active' },
];

const FEE_HEAD_RULES = [
  { id: id(), feeHead: 'Tuition Fee', ruleType: 'Mandatory', value: 100, applicableTo: 'All Programs', status: 'Active' },
  { id: id(), feeHead: 'Registration Fee', ruleType: 'One-Time', value: 500, applicableTo: 'New Students', status: 'Active' },
  { id: id(), feeHead: 'Exam Fee', ruleType: 'Per-Term', value: 200, applicableTo: 'All Programs', status: 'Active' },
  { id: id(), feeHead: 'Lab Fee', ruleType: 'Per-Term', value: 150, applicableTo: 'STEM Programs', status: 'Active' },
  { id: id(), feeHead: 'Late Payment Penalty', ruleType: 'Conditional', value: 50, applicableTo: 'Overdue Invoices', status: 'Active' },
];

const STUDENT_CREDITS = [
  { id: id(), studentCode: 'PSB2025003', studentName: 'Nguyen Thi Mai', creditBalance: 1070, lastUpdated: date(20), source: 'Credit Note CN-2025-001' },
  { id: id(), studentCode: 'PSB2025012', studentName: 'Rahul Mehta', creditBalance: 2140, lastUpdated: date(5), source: 'Credit Note CN-2025-004' },
  { id: id(), studentCode: 'PSB2025006', studentName: 'Tan Jia Hui', creditBalance: 500, lastUpdated: date(15), source: 'Overpayment Adjustment' },
];

const TERM_COURSE_MAPPING = [
  { id: id(), studentCode: 'PSB2025001', studentName: 'Arun Kumar', term: 'Term 1 2025', module: 'CS101', moduleName: 'Introduction to Programming', status: 'Enrolled' },
  { id: id(), studentCode: 'PSB2025001', studentName: 'Arun Kumar', term: 'Term 1 2025', module: 'CS201', moduleName: 'Data Structures & Algorithms', status: 'Enrolled' },
  { id: id(), studentCode: 'PSB2025002', studentName: 'Li Wei', term: 'Term 1 2025', module: 'CS101', moduleName: 'Introduction to Programming', status: 'Enrolled' },
  { id: id(), studentCode: 'PSB2025003', studentName: 'Nguyen Thi Mai', term: 'Term 1 2025', module: 'BA101', moduleName: 'Business Communication', status: 'Enrolled' },
  { id: id(), studentCode: 'PSB2025004', studentName: 'Muhammad Rizky', term: 'Term 1 2025', module: 'IT201', moduleName: 'Web Development', status: 'Enrolled' },
];

const LEADS = [
  { id: id(), name: 'Alex Johnson', email: 'alex.j@email.com', phone: '+65 9111 0001', program: 'BSC-CS', source: 'Web', notes: 'Interested in Jan 2026 intake', date: date(5), status: 'New' },
  { id: id(), name: 'Mei Ling', email: 'meiling@email.com', phone: '+65 8222 0002', program: 'MBA', source: 'Event', notes: 'Met at education fair', date: date(10), status: 'Contacted' },
  { id: id(), name: 'Ravi Patel', email: 'ravi.p@email.com', phone: '+91 98765 00003', program: 'DIP-IT', source: 'Agent', notes: 'Referred by Global Education', date: date(3), status: 'New' },
  { id: id(), name: 'Sarah Lee', email: 'sarah.lee@email.com', phone: '+65 9333 0004', program: 'CERT-DM', source: 'Walk-in', notes: 'Visited campus for info', date: date(7), status: 'Converted' },
  { id: id(), name: 'Kenji Tanaka', email: 'kenji.t@email.com', phone: '+81 90 0005', program: 'BENG', source: 'Referral', notes: 'Friend of existing student', date: date(2), status: 'New' },
];

const ENQUIRIES = [
  { id: id(), name: 'Lisa Wong', email: 'lisa.w@email.com', phone: '+65 9100 5001', program: 'CERT-DM', enquiryType: 'General', message: 'Looking for weekend classes', type: 'Certificate', status: 'New', date: date(3) },
  { id: id(), name: 'David Kim', email: 'david.k@email.com', phone: '+82 10 5002', program: 'CERT-PM', enquiryType: 'Fees', message: 'Need fee structure details', type: 'Certificate', status: 'Replied', date: date(8) },
  { id: id(), name: 'Rina Das', email: 'rina.d@email.com', phone: '+91 98765 5003', program: 'CERT-DA', enquiryType: 'Admission', message: 'Eligibility requirements?', type: 'Certificate', status: 'New', date: date(1) },
];

const APPLICATIONS = [
  { id: id(), name: 'Amit Verma', email: 'amit.v@email.com', mobile: '+91 98765 6001', program: 'MBA', intake: 'Sep 2026', nationality: 'India', workExp: '5', type: 'SBM', status: 'Submitted', date: date(5) },
  { id: id(), name: 'Chen Li', email: 'chen.li@email.com', mobile: '+86 138 6002', program: 'DIP-BA', intake: 'Jan 2026', nationality: 'China', workExp: '2', type: 'SBM', status: 'Under Review', date: date(10) },
  { id: id(), name: 'Yuki Sato', email: 'yuki.s@email.com', mobile: '+81 90 6003', program: 'BENG', intake: 'May 2026', nationality: 'Japan', workExp: '0', type: 'SET', status: 'Submitted', date: date(3) },
  { id: id(), name: 'Priya Nair', email: 'priya.n@email.com', mobile: '+91 98765 6004', program: 'BSC-CS', intake: 'Jan 2026', nationality: 'India', workExp: '1', type: 'SET', status: 'Approved', date: date(15) },
];

const TEST_CATEGORIES = [
  { id: id(), name: 'Mid-Term Examination', code: 'MID', weightage: 30, status: 'Active' },
  { id: id(), name: 'Final Examination', code: 'FINAL', weightage: 40, status: 'Active' },
  { id: id(), name: 'Quiz', code: 'QUIZ', weightage: 10, status: 'Active' },
  { id: id(), name: 'Assignment', code: 'ASSIGN', weightage: 15, status: 'Active' },
  { id: id(), name: 'Practical', code: 'PRAC', weightage: 20, status: 'Active' },
  { id: id(), name: 'Project', code: 'PROJ', weightage: 25, status: 'Active' },
];

const GRADE_BOUNDARIES = [
  { id: id(), grade: 'A+', minMarks: 90, maxMarks: 100, gpa: 5.0, program: 'All', status: 'Active' },
  { id: id(), grade: 'A', minMarks: 80, maxMarks: 89, gpa: 5.0, program: 'All', status: 'Active' },
  { id: id(), grade: 'B+', minMarks: 75, maxMarks: 79, gpa: 4.5, program: 'All', status: 'Active' },
  { id: id(), grade: 'B', minMarks: 70, maxMarks: 74, gpa: 4.0, program: 'All', status: 'Active' },
  { id: id(), grade: 'C+', minMarks: 65, maxMarks: 69, gpa: 3.5, program: 'All', status: 'Active' },
  { id: id(), grade: 'C', minMarks: 60, maxMarks: 64, gpa: 3.0, program: 'All', status: 'Active' },
  { id: id(), grade: 'D+', minMarks: 55, maxMarks: 59, gpa: 2.5, program: 'All', status: 'Active' },
  { id: id(), grade: 'D', minMarks: 50, maxMarks: 54, gpa: 2.0, program: 'All', status: 'Active' },
  { id: id(), grade: 'F', minMarks: 0, maxMarks: 49, gpa: 0.0, program: 'All', status: 'Active' },
];

const ATTENDANCE = [
  { id: id(), studentCode: 'PSB2025001', studentName: 'Arun Kumar', module: 'CS101', date: date(1), status: 'Present', section: 'CS101-S1', markedBy: 'Dr. Tan Wei Lin' },
  { id: id(), studentCode: 'PSB2025001', studentName: 'Arun Kumar', module: 'CS201', date: date(2), status: 'Present', section: 'CS201-S1', markedBy: 'Dr. Lim Kah Seng' },
  { id: id(), studentCode: 'PSB2025002', studentName: 'Li Wei', module: 'CS101', date: date(1), status: 'Absent', section: 'CS101-S1', markedBy: 'Dr. Tan Wei Lin' },
  { id: id(), studentCode: 'PSB2025003', studentName: 'Nguyen Thi Mai', module: 'BA101', date: date(1), status: 'Present', section: 'BA101-S1', markedBy: 'Ms. Sarah Chen' },
  { id: id(), studentCode: 'PSB2025004', studentName: 'Muhammad Rizky', module: 'IT201', date: date(3), status: 'Late', section: 'IT201-S1', markedBy: 'Mr. Kevin Ng' },
  { id: id(), studentCode: 'PSB2025001', studentName: 'Arun Kumar', module: 'CS101', date: date(8), status: 'Present', section: 'CS101-S1', markedBy: 'Dr. Tan Wei Lin' },
  { id: id(), studentCode: 'PSB2025002', studentName: 'Li Wei', module: 'CS101', date: date(8), status: 'Present', section: 'CS101-S1', markedBy: 'Dr. Tan Wei Lin' },
  { id: id(), studentCode: 'PSB2025005', studentName: 'Priya Sharma', module: 'MBA501', date: date(5), status: 'Present', section: 'MBA501-S1', markedBy: 'Prof. David Lee' },
];

const ACTIVITY_SLOTS = [
  { id: id(), name: 'Morning Slot', startTime: '09:00', endTime: '12:00', type: 'Lecture', status: 'Active' },
  { id: id(), name: 'Afternoon Slot', startTime: '14:00', endTime: '17:00', type: 'Lecture', status: 'Active' },
  { id: id(), name: 'Evening Slot', startTime: '18:00', endTime: '21:00', type: 'Lecture', status: 'Active' },
  { id: id(), name: 'Lab Morning', startTime: '09:00', endTime: '12:00', type: 'Lab', status: 'Active' },
  { id: id(), name: 'Lab Afternoon', startTime: '14:00', endTime: '17:00', type: 'Lab', status: 'Active' },
];

const STUDENT_LEAVES = [
  { id: id(), studentCode: 'PSB2025002', studentName: 'Li Wei', leaveType: 'Medical', fromDate: date(5), toDate: date(3), reason: 'Medical appointment', status: 'Approved', approvedBy: 'Dr. Tan Wei Lin' },
  { id: id(), studentCode: 'PSB2025004', studentName: 'Muhammad Rizky', leaveType: 'Personal', fromDate: date(10), toDate: date(8), reason: 'Family emergency', status: 'Approved', approvedBy: 'Mr. Kevin Ng' },
  { id: id(), studentCode: 'PSB2025007', studentName: 'Kim Soo Jin', leaveType: 'Medical', fromDate: date(2), toDate: date(1), reason: 'Not feeling well', status: 'Pending', approvedBy: '' },
];

const QUESTIONS = [
  { id: id(), questionId: 'Q-001', text: 'What is the time complexity of binary search?', type: 'MCQ', module: 'CS201', difficulty: 'Medium', marks: 2, status: 'Active' },
  { id: id(), questionId: 'Q-002', text: 'Explain the concept of normalization in databases.', type: 'Essay', module: 'CS301', difficulty: 'Hard', marks: 10, status: 'Active' },
  { id: id(), questionId: 'Q-003', text: 'Write a function to reverse a linked list.', type: 'Coding', module: 'CS201', difficulty: 'Hard', marks: 15, status: 'Active' },
  { id: id(), questionId: 'Q-004', text: 'What is the 4Ps of marketing?', type: 'MCQ', module: 'BA201', difficulty: 'Easy', marks: 2, status: 'Active' },
  { id: id(), questionId: 'Q-005', text: 'Describe effective communication strategies in business.', type: 'Essay', module: 'BA101', difficulty: 'Medium', marks: 10, status: 'Active' },
  { id: id(), questionId: 'Q-006', text: 'What is a primary key in RDBMS?', type: 'MCQ', module: 'CS301', difficulty: 'Easy', marks: 2, status: 'Active' },
];

const TEST_DRAFTS = [
  { id: id(), name: 'CS201 Mid-Term Draft', module: 'CS201', category: 'Mid-Term', totalMarks: 100, questions: 25, status: 'Draft', createdBy: 'Dr. Lim Kah Seng', date: date(10) },
  { id: id(), name: 'BA101 Quiz 2 Draft', module: 'BA101', category: 'Quiz', totalMarks: 50, questions: 20, status: 'Draft', createdBy: 'Ms. Sarah Chen', date: date(5) },
  { id: id(), name: 'CS301 Final Draft', module: 'CS301', category: 'Final', totalMarks: 100, questions: 30, status: 'Under Review', createdBy: 'Dr. Tan Wei Lin', date: date(3) },
];

const COMPANIES = [
  { id: id(), name: 'TechCorp Singapore', industry: 'Technology', contactPerson: 'Jason Lee', email: 'jason@techcorp.sg', phone: '+65 6100 0001', status: 'Active', studentsPlaced: 5 },
  { id: id(), name: 'FinServe Asia', industry: 'Finance', contactPerson: 'Amanda Tan', email: 'amanda@finserve.sg', phone: '+65 6100 0002', status: 'Active', studentsPlaced: 3 },
  { id: id(), name: 'MediaWorks Pte Ltd', industry: 'Media', contactPerson: 'Wei Ming', email: 'weiming@mediaworks.sg', phone: '+65 6100 0003', status: 'Active', studentsPlaced: 2 },
  { id: id(), name: 'GreenEnergy Solutions', industry: 'Engineering', contactPerson: 'Raj Menon', email: 'raj@greenenergy.sg', phone: '+65 6100 0004', status: 'Inactive', studentsPlaced: 1 },
];

const CONTRACTS = [
  { id: id(), contractId: 'CON-001', agentName: 'Global Education Pte Ltd', startDate: '2024-01-01', endDate: '2025-12-31', commission: 10, status: 'Active', programs: ['BSC-CS', 'DIP-BA', 'MBA'] },
  { id: id(), contractId: 'CON-002', agentName: 'Asia Pacific Recruitment', startDate: '2024-06-01', endDate: '2025-12-31', commission: 12, status: 'Active', programs: ['DIP-BA', 'DIP-IT', 'BENG'] },
  { id: id(), contractId: 'CON-003', agentName: 'Japan Student Services', startDate: '2024-01-01', endDate: '2025-06-30', commission: 8, status: 'Expired', programs: ['BSC-CS', 'CERT-DM'] },
  { id: id(), contractId: 'CON-004', agentName: 'Korea Education Agency', startDate: '2025-01-01', endDate: '2026-12-31', commission: 9, status: 'Active', programs: ['BA-COMM', 'MBA'] },
  { id: id(), contractId: 'CON-005', agentName: 'India Study Abroad', startDate: '2025-03-01', endDate: '2026-02-28', commission: 11, status: 'Draft', programs: ['BSC-CS', 'DIP-IT', 'MBA'] },
];

const FEEDBACK_QUESTIONS = [
  { id: id(), text: 'How would you rate the overall teaching quality?', type: 'Rating', category: 'Teaching', status: 'Active' },
  { id: id(), text: 'Was the course material well organized?', type: 'Rating', category: 'Content', status: 'Active' },
  { id: id(), text: 'How effective were the practical sessions?', type: 'Rating', category: 'Practical', status: 'Active' },
  { id: id(), text: 'Would you recommend this module to other students?', type: 'Yes/No', category: 'General', status: 'Active' },
  { id: id(), text: 'Any suggestions for improvement?', type: 'Text', category: 'General', status: 'Active' },
];

const FEEDBACK_FORMS = [
  { id: id(), name: 'CS101 Mid-Term Feedback', module: 'CS101', term: 'Term 1 2025', status: 'Published', responses: 30, date: date(15) },
  { id: id(), name: 'BA101 End-Term Feedback', module: 'BA101', term: 'Term 1 2025', status: 'Published', responses: 38, date: date(10) },
  { id: id(), name: 'CS201 Mid-Term Feedback', module: 'CS201', term: 'Term 1 2025', status: 'Draft', responses: 0, date: date(5) },
];

const APPRAISALS = [
  { id: id(), employeeName: 'Dr. Tan Wei Lin', employeeCode: 'EMP001', period: 'H1 2025', rating: 4.5, status: 'Completed', reviewer: 'Prof. David Lee', date: date(30) },
  { id: id(), employeeName: 'Ms. Sarah Chen', employeeCode: 'EMP003', period: 'H1 2025', rating: 4.2, status: 'Completed', reviewer: 'Prof. David Lee', date: date(28) },
  { id: id(), employeeName: 'Mr. Kevin Ng', employeeCode: 'EMP007', period: 'H1 2025', rating: 0, status: 'Pending', reviewer: 'Dr. Lim Kah Seng', date: date(5) },
];

const PEER_FEEDBACK = [
  { id: id(), fromEmployee: 'Ms. Sarah Chen', toEmployee: 'Dr. Tan Wei Lin', period: 'H1 2025', rating: 4.8, comments: 'Excellent collaboration on curriculum design', status: 'Submitted', date: date(25) },
  { id: id(), fromEmployee: 'Mr. Kevin Ng', toEmployee: 'Dr. Lim Kah Seng', period: 'H1 2025', rating: 4.5, comments: 'Very helpful mentor', status: 'Submitted', date: date(23) },
  { id: id(), fromEmployee: 'Dr. Tan Wei Lin', toEmployee: 'Ms. Sarah Chen', period: 'H1 2025', rating: 4.3, comments: 'Great team player', status: 'Submitted', date: date(22) },
];

const ALUMNI = [
  { id: id(), name: 'Tan Jia Hui', studentCode: 'PSB2025006', program: 'CERT-DM', graduationDate: '2025-11-30', email: 'jiahui.tan@email.com', employer: 'MediaWorks Pte Ltd', status: 'Active' },
  { id: id(), name: 'Yoko Yamamoto', studentCode: 'PSB2025020', program: 'CERT-DM', graduationDate: '2025-11-30', email: 'yoko.y@email.com', employer: 'TechCorp Singapore', status: 'Active' },
  { id: id(), name: 'James Liu', studentCode: 'PSB2024001', program: 'BSC-CS', graduationDate: '2024-12-15', email: 'james.liu@email.com', employer: 'FinServe Asia', status: 'Active' },
];

const LESSON_PLANS = [
  { id: id(), name: 'CS101 Week 1-4 Plan', module: 'CS101', instructor: 'Dr. Tan Wei Lin', term: 'Term 1 2025', weeks: 4, topics: 8, status: 'Approved', completionRate: 100 },
  { id: id(), name: 'CS201 Week 1-4 Plan', module: 'CS201', instructor: 'Dr. Lim Kah Seng', term: 'Term 1 2025', weeks: 4, topics: 10, status: 'Approved', completionRate: 75 },
  { id: id(), name: 'BA101 Week 1-6 Plan', module: 'BA101', instructor: 'Ms. Sarah Chen', term: 'Term 1 2025', weeks: 6, topics: 12, status: 'In Progress', completionRate: 50 },
  { id: id(), name: 'MBA501 Week 1-4 Plan', module: 'MBA501', instructor: 'Prof. David Lee', term: 'Term 1 2025', weeks: 4, topics: 8, status: 'Draft', completionRate: 0 },
];

const BLACKLISTED_EMAILS = [
  { id: id(), email: 'spam@test.com', reason: 'Spam submissions', addedBy: 'manoj', date: date(30) },
  { id: id(), email: 'fake@fake.com', reason: 'Fraudulent applications', addedBy: 'manoj', date: date(20) },
  { id: id(), email: 'blocked@domain.com', reason: 'Repeated abuse', addedBy: 'hol', date: date(10) },
];

const SETTINGS = [
  { id: id(), key: 'default_currency', value: 'SGD', category: 'Finance', description: 'Default currency for all transactions' },
  { id: id(), key: 'gst_rate', value: '9', category: 'Finance', description: 'GST percentage rate' },
  { id: id(), key: 'attendance_threshold', value: '75', category: 'Academics', description: 'Minimum attendance percentage required' },
  { id: id(), key: 'max_file_upload_size', value: '10', category: 'System', description: 'Max file upload size in MB' },
  { id: id(), key: 'email_sender', value: 'noreply@psb-academy.edu.sg', category: 'Messages', description: 'Default sender email address' },
  { id: id(), key: 'academic_year', value: '2025', category: 'Academics', description: 'Current academic year' },
];

const PAYMENTS = [
  { id: id(), paymentId: 'PAY-2025-001', date: date(28), studentCode: 'PSB2025001', studentName: 'Arun Kumar', invoiceNumber: 'INV-2025-0001', amount: 8560, method: 'Bank Transfer', reference: 'DBS-TXN-001', status: 'Confirmed' },
  { id: id(), paymentId: 'PAY-2025-002', date: date(26), studentCode: 'PSB2025002', studentName: 'Li Wei', invoiceNumber: 'INV-2025-0002', amount: 8560, method: 'Credit Card', reference: 'VISA-TXN-002', status: 'Confirmed' },
  { id: id(), paymentId: 'PAY-2025-003', date: date(23), studentCode: 'PSB2025003', studentName: 'Nguyen Thi Mai', invoiceNumber: 'INV-2025-0003', amount: 3000, method: 'Bank Transfer', reference: 'OCBC-TXN-003', status: 'Confirmed' },
  { id: id(), paymentId: 'PAY-2025-004', date: date(55), studentCode: 'PSB2025006', studentName: 'Tan Jia Hui', invoiceNumber: 'INV-2025-0009', amount: 4280, method: 'NETS', reference: 'NETS-TXN-004', status: 'Confirmed' },
  { id: id(), paymentId: 'PAY-2025-005', date: date(50), studentCode: 'PSB2025010', studentName: 'David Rodrigues', invoiceNumber: 'INV-2025-0010', amount: 5706, method: 'Bank Transfer', reference: 'UOB-TXN-005', status: 'Confirmed' },
  { id: id(), paymentId: 'PAY-2025-006', date: date(40), studentCode: 'PSB2025016', studentName: 'Wattana Chai', invoiceNumber: 'INV-2025-0013', amount: 7846, method: 'Telegraphic Transfer', reference: 'TT-TXN-006', status: 'Confirmed' },
  { id: id(), paymentId: 'PAY-2025-007', date: date(35), studentCode: 'PSB2025020', studentName: 'Yoko Yamamoto', invoiceNumber: 'INV-2025-0015', amount: 4280, method: 'Credit Card', reference: 'MC-TXN-007', status: 'Confirmed' },
];

const REVENUE = [
  { id: id(), month: 'Jan 2025', tuitionRevenue: 85000, registrationRevenue: 5000, otherRevenue: 2000, totalRevenue: 92000, reconciled: true },
  { id: id(), month: 'Feb 2025', tuitionRevenue: 72000, registrationRevenue: 3000, otherRevenue: 1500, totalRevenue: 76500, reconciled: true },
  { id: id(), month: 'Mar 2025', tuitionRevenue: 95000, registrationRevenue: 8000, otherRevenue: 3000, totalRevenue: 106000, reconciled: false },
];

export function seedData() {
  if (localStorage.getItem('sms_initialized')) return;

  const datasets = {
    schools: SCHOOLS,
    programs: PROGRAMS,
    modules: MODULES,
    cohorts: COHORTS,
    students: STUDENTS,
    employees: EMPLOYEES,
    invoices: INVOICES,
    creditNotes: CREDIT_NOTES,
    refunds: REFUNDS,
    tickets: TICKETS,
    agents: AGENTS,
    tests: TESTS,
    users: USERS,
    messageTemplates: MESSAGE_TEMPLATES,
    messages: MESSAGES,
    holidays: HOLIDAYS,
    installmentTemplates: INSTALLMENT_TEMPLATES,
    studyResources: STUDY_RESOURCES,
    invoiceRuns: INVOICE_RUNS,
    timetable: TIMETABLE,
    stickyNotes: STICKY_NOTES,
    documents: DOCUMENTS,
    discounts: DISCOUNTS,
    promocodes: PROMOCODES,
    intakes: INTAKES,
    countries: COUNTRIES_DATA,
    auditTrail: AUDIT_TRAIL,
    products: PRODUCTS,
    sections: SECTIONS,
    terms: TERMS,
    pricingMatrix: PRICING_MATRIX,
    feeHeadRules: FEE_HEAD_RULES,
    studentCredits: STUDENT_CREDITS,
    termCourseMapping: TERM_COURSE_MAPPING,
    leads: LEADS,
    enquiries: ENQUIRIES,
    applications: APPLICATIONS,
    testCategories: TEST_CATEGORIES,
    gradeBoundaries: GRADE_BOUNDARIES,
    attendance: ATTENDANCE,
    activitySlots: ACTIVITY_SLOTS,
    studentLeaves: STUDENT_LEAVES,
    questions: QUESTIONS,
    testDrafts: TEST_DRAFTS,
    companies: COMPANIES,
    contracts: CONTRACTS,
    feedbackQuestions: FEEDBACK_QUESTIONS,
    feedbackForms: FEEDBACK_FORMS,
    appraisals: APPRAISALS,
    peerFeedback: PEER_FEEDBACK,
    alumni: ALUMNI,
    lessonPlans: LESSON_PLANS,
    blacklistedEmails: BLACKLISTED_EMAILS,
    settings: SETTINGS,
    payments: PAYMENTS,
    revenue: REVENUE,
  };

  Object.entries(datasets).forEach(([key, data]) => {
    localStorage.setItem(`sms_${key}`, JSON.stringify(data));
  });

  localStorage.setItem('sms_initialized', 'true');
}
