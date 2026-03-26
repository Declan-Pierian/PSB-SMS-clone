const menuConfig = [
  {
    id: 'masters',
    label: 'Masters',
    icon: 'Folder',
    groups: [
      {
        title: 'Partners',
        items: [
          { label: 'Search BU', path: '/masters/search-bu' },
          { label: 'Center Ingestion', path: '/masters/center-ingestion' },
          { label: 'Centres', path: '/masters/centres' },
        ],
      },
      {
        title: 'Courses/Batches',
        items: [
          { label: 'Course Management', path: '/masters/courses' },
          { label: 'Module Management', path: '/masters/modules' },
          { label: 'Cohort Management', path: '/masters/cohorts' },
          { label: 'Intake Management', path: '/masters/intakes' },
          { label: 'Course Tag Hierarchy', path: '/masters/course-tags' },
          { label: 'Pathway Management', path: '/masters/pathways' },
          { label: 'TimeCraft Search', path: '/masters/timecraft' },
          { label: 'Program View', path: '/masters/program-view' },
          { label: 'Product Management', path: '/masters/products' },
          { label: 'Section Management', path: '/masters/sections' },
          { label: 'Section Ingestor', path: '/masters/section-ingestor' },
          { label: 'Current Terms', path: '/masters/current-terms' },
        ],
      },
      {
        title: 'Payments',
        items: [
          { label: 'Installment Template', path: '/masters/installment-templates' },
          { label: 'Installment Structure', path: '/masters/installment-structure' },
          { label: 'Installment Template Ingestion', path: '/masters/installment-ingestion' },
          { label: 'Promocode Search', path: '/masters/promocodes' },
          { label: 'Discounts Management', path: '/masters/discounts' },
          { label: 'Pricing Matrix', path: '/masters/pricing-matrix' },
          { label: 'Fee Head Rule', path: '/masters/fee-head-rule' },
        ],
      },
      {
        title: 'Others',
        items: [
          { label: 'Country Search', path: '/masters/countries' },
        ],
      },
    ],
  },
  {
    id: 'hr',
    label: 'Human Resources',
    icon: 'People',
    groups: [
      {
        title: 'Employee Management',
        items: [
          { label: 'Employee Search', path: '/hr/employees' },
          { label: 'Employee Ingestor', path: '/hr/employee-ingestor' },
          { label: 'Holiday List', path: '/hr/holidays' },
          { label: 'Employee Bulk Operation', path: '/hr/bulk-operations' },
          { label: 'Employees Leaves Dashboard', path: '/hr/leaves' },
        ],
      },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: 'AttachMoney',
    groups: [
      {
        title: 'Finance',
        items: [
          { label: 'Payment Console', path: '/finance/payment-console' },
          { label: 'Application Payment Console', path: '/finance/app-payment-console' },
          { label: 'Invoice Run', path: '/finance/invoice-run' },
          { label: 'Invoice Search', path: '/finance/invoices' },
          { label: 'Credit Note Search', path: '/finance/credit-notes' },
          { label: 'Revenue Reconcile', path: '/finance/revenue-reconcile' },
          { label: 'Revenue Search', path: '/finance/revenue-search' },
          { label: 'Refund Advice Search', path: '/finance/refunds' },
          { label: 'Payment Ingestion', path: '/finance/payment-ingestion' },
        ],
      },
      {
        title: 'Finance Reports',
        items: [
          { label: 'Grid Report', path: '/finance/grid-report' },
          { label: 'Daily Collections', path: '/finance/daily-collections' },
          { label: 'Defaulters Report', path: '/finance/defaulters' },
          { label: 'Student Payment Vs Installment', path: '/finance/payment-vs-installment' },
        ],
      },
    ],
  },
  {
    id: 'student',
    label: 'Student',
    icon: 'School',
    groups: [
      {
        title: 'Registration',
        items: [
          { label: 'Online Application', path: '/students/application' },
          { label: 'New Student', path: '/students/new' },
          { label: 'Student Search', path: '/students/search' },
          { label: 'Document Search', path: '/students/documents' },
          { label: 'Bulk Operations', path: '/students/bulk-operations' },
          { label: 'Enquiry Import', path: '/students/enquiry-import' },
          { label: 'Student Photo Upload', path: '/students/photo-upload' },
          { label: 'Ticket Search', path: '/students/tickets' },
          { label: 'Document Lifecycle Management', path: '/students/document-lifecycle' },
        ],
      },
      {
        title: 'Student Operations',
        items: [
          { label: 'Credit Note Import', path: '/students/credit-note-import' },
          { label: 'Credit Management', path: '/students/credit-management' },
          { label: 'Student Term Course Mapping', path: '/students/term-course-mapping' },
          { label: 'Ingestion', path: '/students/ingestion' },
          { label: 'Refund Advice Search', path: '/students/refund-advice' },
          { label: 'Grade Card Reports', path: '/students/grade-card' },
        ],
      },
      {
        title: 'Applications',
        items: [
          { label: 'Application for SET', path: '/students/application-set' },
          { label: 'Certificate Program Enquiry', path: '/students/cert-enquiry' },
          { label: 'Application for SBM', path: '/students/application-sbm' },
          { label: 'Simple Leads Form', path: '/students/simple-leads' },
        ],
      },
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'BarChart',
    groups: [
      {
        title: 'General Reports',
        items: [
          { label: 'Cohort Reports', path: '/reports/cohort' },
          { label: 'Canned Report', path: '/reports/canned' },
          { label: 'Grid Report', path: '/reports/grid' },
          { label: 'Daily Reports', path: '/reports/daily' },
          { label: 'My Dashboards', path: '/reports/dashboards' },
          { label: 'Section Reports', path: '/reports/section' },
          { label: 'Section Transfers', path: '/reports/section-transfers' },
        ],
      },
      {
        title: 'Test Reports',
        items: [
          { label: 'Test Spread Report', path: '/reports/test-spread' },
          { label: 'Test Report', path: '/reports/test-report' },
          { label: 'Sectionwise Report', path: '/reports/sectionwise' },
          { label: 'Cumulative Test Report', path: '/reports/cumulative-test' },
          { label: 'Category-wise Test Report', path: '/reports/category-test' },
          { label: 'Audit Trail', path: '/reports/audit-trail' },
          { label: 'Test Data Entry Monitoring', path: '/reports/test-monitoring' },
          { label: 'Overwrite Test Time', path: '/reports/overwrite-test-time' },
          { label: 'Academic Misconduct Report', path: '/reports/academic-misconduct' },
          { label: 'Module Appeal Report', path: '/reports/module-appeal' },
          { label: 'MAB Updates Report', path: '/reports/mab-updates' },
        ],
      },
      {
        title: 'Attendance Reports',
        items: [
          { label: 'Date Wise Attendance Report', path: '/reports/datewise-attendance' },
          { label: 'Instructor Attendance Report', path: '/reports/instructor-attendance' },
          { label: 'Attendance Slot Report', path: '/reports/attendance-slot' },
          { label: 'Non Conducted Classes Report', path: '/reports/non-conducted' },
          { label: 'Cumulative Attendance Report', path: '/reports/cumulative-attendance' },
          { label: 'Daily Consolidated Attendance', path: '/reports/daily-consolidated' },
          { label: 'EOD Summary Report', path: '/reports/eod-summary' },
        ],
      },
      {
        title: 'Other Reports',
        items: [
          { label: 'Video Stream Logs', path: '/reports/video-stream' },
          { label: 'Instructor Feedback Report', path: '/reports/instructor-feedback' },
          { label: 'Trainings Dashboard', path: '/reports/trainings-dashboard' },
        ],
      },
    ],
  },
  {
    id: 'academics',
    label: 'Academics',
    icon: 'MenuBook',
    groups: [
      {
        title: 'Tests',
        items: [
          { label: 'Graduation Run', path: '/academics/graduation' },
          { label: 'Test Search', path: '/academics/tests' },
          { label: 'Test Creation', path: '/academics/test-creation' },
          { label: 'Test Structure', path: '/academics/test-structure' },
          { label: 'Test Statistics Report', path: '/academics/test-statistics' },
          { label: 'Excel 2 Stage Marks Import', path: '/academics/marks-import' },
          { label: 'Marks Ingestor', path: '/academics/marks-ingestor' },
          { label: 'Graduation Boundaries Pre Set', path: '/academics/grade-boundaries' },
          { label: 'Passing Rate Report', path: '/academics/passing-rate' },
          { label: 'Assign Second Evaluator', path: '/academics/second-evaluator' },
          { label: 'Evaluated Student Test Search', path: '/academics/evaluated-tests' },
          { label: 'Freeze Test', path: '/academics/freeze-test' },
          { label: 'Test Papers Download', path: '/academics/test-papers' },
          { label: 'Supplementary Test Data Entry', path: '/academics/supplementary-test' },
          { label: 'Exam Dashboard', path: '/academics/exam-dashboard' },
          { label: 'Failed Percentage Report', path: '/academics/failed-percentage' },
          { label: 'Poor Performance Report', path: '/academics/poor-performance' },
          { label: 'Test Category Search', path: '/academics/test-categories' },
          { label: 'Backlog Students Report', path: '/academics/backlog-students' },
          { label: 'Inline Test Data Entry', path: '/academics/inline-test-entry' },
          { label: 'Test Usage Report', path: '/academics/test-usage' },
          { label: 'External Test Data Entry', path: '/academics/external-test-entry' },
          { label: 'External Supplementary Test Data Entry', path: '/academics/external-supplementary' },
          { label: 'Test Import', path: '/academics/test-import' },
        ],
      },
      {
        title: 'Attendance',
        items: [
          { label: 'Attendance Dashboard', path: '/academics/attendance-dashboard' },
          { label: 'Time Table Search', path: '/academics/timetable' },
          { label: 'Time Table Ingestion', path: '/academics/timetable-ingestion' },
          { label: 'Attendance Ingestor', path: '/academics/attendance-ingestor' },
          { label: 'Student Attendance', path: '/academics/student-attendance' },
          { label: 'Sync Attendance', path: '/academics/sync-attendance' },
          { label: 'Activity Slots', path: '/academics/activity-slots' },
          { label: 'Exam Schedule Attendance', path: '/academics/exam-attendance' },
          { label: 'Student Leave Management', path: '/academics/student-leave' },
          { label: 'Absentees Report', path: '/academics/absentees' },
          { label: 'Attendance Comparison Report', path: '/academics/attendance-comparison' },
        ],
      },
      {
        title: 'Study Resource',
        items: [
          { label: 'Feedback Form', path: '/academics/feedback-form' },
          { label: 'Study Resource Creation', path: '/academics/resource-create' },
          { label: 'Study Resource Search', path: '/academics/resources' },
          { label: 'Learning Module', path: '/academics/learning-module' },
          { label: 'Discussion Board', path: '/academics/discussion' },
          { label: 'Bulk StudyResource Upload', path: '/academics/resource-bulk-upload' },
          { label: 'StudyResourceIssueSearch', path: '/academics/resource-issues' },
          { label: 'Study Resource Ingestion', path: '/academics/resource-ingestion' },
        ],
      },
      {
        title: 'Question Bank',
        items: [
          { label: 'Question Ingestor', path: '/academics/question-ingestor' },
          { label: 'Question Search', path: '/academics/question-search' },
          { label: 'Paper Maker', path: '/academics/paper-maker' },
          { label: 'New Question', path: '/academics/new-question' },
          { label: 'Class Test Question Import', path: '/academics/question-import' },
          { label: 'Test Draft Search', path: '/academics/test-drafts' },
        ],
      },
      {
        title: 'Placement Management',
        items: [
          { label: 'Company Management', path: '/academics/companies' },
          { label: 'Placement Report', path: '/academics/placement-report' },
        ],
      },
    ],
  },
  {
    id: 'agents',
    label: 'Agent Management',
    icon: 'Settings',
    groups: [
      {
        title: 'Agent',
        items: [
          { label: 'Application Search', path: '/agents/search' },
          { label: 'Contract', path: '/agents/contract' },
          { label: 'Contract Search', path: '/agents/contracts' },
          { label: 'DCF Change Request', path: '/agents/dcf-requests' },
          { label: 'Renewal Recommendation', path: '/agents/renewal-recommendation' },
          { label: 'Renewal Approval', path: '/agents/renewal-approval' },
        ],
      },
      {
        title: 'Feedback Management',
        items: [
          { label: 'Feedback Questions', path: '/agents/feedback-questions' },
          { label: 'Add Feedback Form', path: '/agents/add-feedback-form' },
          { label: 'Feedback Form Report', path: '/agents/feedback-report' },
          { label: 'Appraisal Section', path: '/agents/appraisal' },
          { label: 'Peer To Peer Feedback Form', path: '/agents/peer-feedback' },
          { label: 'Feedback Dashboard', path: '/agents/feedback-dashboard' },
          { label: 'Feedback Form Entry', path: '/agents/feedback-entry' },
        ],
      },
      {
        title: 'Alumni Management',
        items: [
          { label: 'Alumni Management', path: '/agents/alumni' },
          { label: 'Alumni Approvals', path: '/agents/alumni-approvals' },
        ],
      },
      {
        title: 'Lesson Plan Management',
        items: [
          { label: 'LessonPlan Dashboard', path: '/agents/lessonplan-dashboard' },
          { label: 'LessonPlan', path: '/agents/lessonplan' },
          { label: 'LessonPlan Status', path: '/agents/lessonplan-status' },
          { label: 'LessonPlan Coverage Report', path: '/agents/lessonplan-coverage' },
          { label: 'LessonPlan Teachers Report', path: '/agents/lessonplan-teachers' },
          { label: 'Instructor Time Table', path: '/agents/instructor-timetable' },
        ],
      },
    ],
  },
  {
    id: 'system',
    label: 'System',
    icon: 'Settings',
    groups: [
      {
        title: 'User',
        items: [
          { label: 'User Management', path: '/system/users' },
        ],
      },
      {
        title: 'Messages',
        items: [
          { label: 'Message Templates', path: '/system/message-templates' },
          { label: 'Message Outbox', path: '/system/message-outbox' },
        ],
      },
      {
        title: 'Logs',
        items: [
          { label: 'Uploaded Docs Log', path: '/system/uploaded-docs-log' },
          { label: 'System Usage Logs', path: '/system/usage-logs' },
          { label: 'Black Listed Emails', path: '/system/blacklisted-emails' },
        ],
      },
      {
        title: 'ConceptWaves',
        items: [
          { label: 'Build Tree', path: '/system/build-tree' },
          { label: 'Invalidate Resource Cache', path: '/system/invalidate-cache' },
          { label: 'Usage Report', path: '/system/cw-usage-report' },
        ],
      },
      {
        title: 'Settings',
        items: [
          { label: 'Custom Settings', path: '/system/custom-settings' },
        ],
      },
    ],
  },
];

export default menuConfig;