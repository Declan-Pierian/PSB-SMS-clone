import { lazy, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

const Loader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
    <CircularProgress sx={{ color: '#b30537' }} />
  </Box>
);

const wrap = (Component) => (
  <Suspense fallback={<Loader />}>
    <Component />
  </Suspense>
);

// Dashboard
const Home = lazy(() => import('./pages/dashboard/Home'));

// Masters - Partners
const SearchBU = lazy(() => import('./pages/masters/partners/SearchBU'));
const CenterIngestion = lazy(() => import('./pages/masters/partners/CenterIngestion'));
const Centres = lazy(() => import('./pages/masters/partners/Centres'));

// Masters - Courses
const CourseManagement = lazy(() => import('./pages/masters/courses/CourseManagement'));
const ModuleManagement = lazy(() => import('./pages/masters/courses/ModuleManagement'));
const CohortManagement = lazy(() => import('./pages/masters/courses/CohortManagement'));
const IntakeManagement = lazy(() => import('./pages/masters/courses/IntakeManagement'));
const CourseTagHierarchy = lazy(() => import('./pages/masters/courses/CourseTagHierarchy'));
const PathwayManagement = lazy(() => import('./pages/masters/courses/PathwayManagement'));
const TimeCraftSearch = lazy(() => import('./pages/masters/courses/TimeCraftSearch'));
const ProgramView = lazy(() => import('./pages/masters/courses/ProgramView'));
const ProductManagement = lazy(() => import('./pages/masters/courses/ProductManagement'));
const SectionManagement = lazy(() => import('./pages/masters/courses/SectionManagement'));
const SectionIngestor = lazy(() => import('./pages/masters/courses/SectionIngestor'));
const CurrentTerms = lazy(() => import('./pages/masters/courses/CurrentTerms'));

// Masters - Payments
const InstallmentTemplate = lazy(() => import('./pages/masters/payments/InstallmentTemplate'));
const InstallmentStructure = lazy(() => import('./pages/masters/payments/InstallmentStructure'));
const InstallmentIngestion = lazy(() => import('./pages/masters/payments/InstallmentIngestion'));
const PromocodeSearch = lazy(() => import('./pages/masters/payments/PromocodeSearch'));
const DiscountsManagement = lazy(() => import('./pages/masters/payments/DiscountsManagement'));
const PricingMatrix = lazy(() => import('./pages/masters/payments/PricingMatrix'));
const FeeHeadRule = lazy(() => import('./pages/masters/payments/FeeHeadRule'));

// Masters - Others
const CountrySearch = lazy(() => import('./pages/masters/others/CountrySearch'));

// HR
const EmployeeSearch = lazy(() => import('./pages/hr/EmployeeSearch'));
const EmployeeIngestor = lazy(() => import('./pages/hr/EmployeeIngestor'));
const HolidayList = lazy(() => import('./pages/hr/HolidayList'));
const EmployeeBulkOperation = lazy(() => import('./pages/hr/EmployeeBulkOperation'));
const LeaveDashboard = lazy(() => import('./pages/hr/LeaveDashboard'));

// Finance
const PaymentConsole = lazy(() => import('./pages/finance/PaymentConsole'));
const AppPaymentConsole = lazy(() => import('./pages/finance/AppPaymentConsole'));
const InvoiceRun = lazy(() => import('./pages/finance/InvoiceRun'));
const InvoiceSearch = lazy(() => import('./pages/finance/InvoiceSearch'));
const CreditNoteSearch = lazy(() => import('./pages/finance/CreditNoteSearch'));
const RevenueReconcile = lazy(() => import('./pages/finance/RevenueReconcile'));
const RevenueSearch = lazy(() => import('./pages/finance/RevenueSearch'));
const RefundAdvice = lazy(() => import('./pages/finance/RefundAdvice'));
const FinanceGridReport = lazy(() => import('./pages/finance/FinanceGridReport'));
const DailyCollections = lazy(() => import('./pages/finance/DailyCollections'));
const DefaultersReport = lazy(() => import('./pages/finance/DefaultersReport'));
const PaymentIngestion = lazy(() => import('./pages/finance/PaymentIngestion'));
const PaymentVsInstallment = lazy(() => import('./pages/finance/PaymentVsInstallment'));

// Student - Registration
const OnlineApplication = lazy(() => import('./pages/students/OnlineApplication'));
const NewStudent = lazy(() => import('./pages/students/NewStudent'));
const StudentSearch = lazy(() => import('./pages/students/StudentSearch'));
const DocumentSearch = lazy(() => import('./pages/students/DocumentSearch'));
const BulkOperations = lazy(() => import('./pages/students/BulkOperations'));
const EnquiryImport = lazy(() => import('./pages/students/EnquiryImport'));
const StudentPhotoUpload = lazy(() => import('./pages/students/StudentPhotoUpload'));
const TicketSearch = lazy(() => import('./pages/students/TicketSearch'));
const DocumentLifecycle = lazy(() => import('./pages/students/DocumentLifecycle'));

// Student - Operations
const CreditNoteImport = lazy(() => import('./pages/students/CreditNoteImport'));
const CreditManagement = lazy(() => import('./pages/students/CreditManagement'));
const StudentTermCourseMapping = lazy(() => import('./pages/students/StudentTermCourseMapping'));
const StudentIngestion = lazy(() => import('./pages/students/StudentIngestion'));
const RefundAdviceSearch = lazy(() => import('./pages/students/RefundAdviceSearch'));
const GradeCardReports = lazy(() => import('./pages/students/GradeCardReports'));

// Student - Applications
const ApplicationSET = lazy(() => import('./pages/students/ApplicationSET'));
const CertificateEnquiry = lazy(() => import('./pages/students/CertificateEnquiry'));
const ApplicationSBM = lazy(() => import('./pages/students/ApplicationSBM'));
const SimpleLeadsForm = lazy(() => import('./pages/students/SimpleLeadsForm'));

// Reports - General
const CohortReports = lazy(() => import('./pages/reports/CohortReports'));
const CannedReport = lazy(() => import('./pages/reports/CannedReport'));
const GridReport = lazy(() => import('./pages/reports/GridReport'));
const DailyReports = lazy(() => import('./pages/reports/DailyReports'));
const MyDashboards = lazy(() => import('./pages/reports/MyDashboards'));
const SectionReports = lazy(() => import('./pages/reports/SectionReports'));
const SectionTransfers = lazy(() => import('./pages/reports/SectionTransfers'));

// Reports - Test
const TestSpreadReport = lazy(() => import('./pages/reports/TestSpreadReport'));
const TestReport = lazy(() => import('./pages/reports/TestReport'));
const SectionwiseReport = lazy(() => import('./pages/reports/SectionwiseReport'));
const CumulativeTestReport = lazy(() => import('./pages/reports/CumulativeTestReport'));
const CategoryTestReport = lazy(() => import('./pages/reports/CategoryTestReport'));
const AuditTrail = lazy(() => import('./pages/reports/AuditTrail'));
const TestDataEntryMonitoring = lazy(() => import('./pages/reports/TestDataEntryMonitoring'));
const OverwriteTestTime = lazy(() => import('./pages/reports/OverwriteTestTime'));
const AcademicMisconductReport = lazy(() => import('./pages/reports/AcademicMisconductReport'));
const ModuleAppealReport = lazy(() => import('./pages/reports/ModuleAppealReport'));
const MABUpdatesReport = lazy(() => import('./pages/reports/MABUpdatesReport'));

// Reports - Attendance
const DatewiseAttendanceReport = lazy(() => import('./pages/reports/DatewiseAttendanceReport'));
const InstructorAttendanceReport = lazy(() => import('./pages/reports/InstructorAttendanceReport'));
const AttendanceSlotReport = lazy(() => import('./pages/reports/AttendanceSlotReport'));
const NonConductedClasses = lazy(() => import('./pages/reports/NonConductedClasses'));
const CumulativeAttendanceReport = lazy(() => import('./pages/reports/CumulativeAttendanceReport'));
const DailyConsolidatedAttendance = lazy(() => import('./pages/reports/DailyConsolidatedAttendance'));
const EODSummaryReport = lazy(() => import('./pages/reports/EODSummaryReport'));

// Reports - Other
const VideoStreamLogs = lazy(() => import('./pages/reports/VideoStreamLogs'));
const InstructorFeedbackReport = lazy(() => import('./pages/reports/InstructorFeedbackReport'));
const TrainingsDashboard = lazy(() => import('./pages/reports/TrainingsDashboard'));

// Academics - Tests
const GraduationRun = lazy(() => import('./pages/academics/GraduationRun'));
const TestSearch = lazy(() => import('./pages/academics/TestSearch'));
const TestCreation = lazy(() => import('./pages/academics/TestCreation'));
const TestStructure = lazy(() => import('./pages/academics/TestStructure'));
const TestStatistics = lazy(() => import('./pages/academics/TestStatistics'));
const MarksImport = lazy(() => import('./pages/academics/MarksImport'));
const MarksIngestor = lazy(() => import('./pages/academics/MarksIngestor'));
const GradeBoundaries = lazy(() => import('./pages/academics/GradeBoundaries'));
const PassingRateReport = lazy(() => import('./pages/academics/PassingRateReport'));
const AssignSecondEvaluator = lazy(() => import('./pages/academics/AssignSecondEvaluator'));
const EvaluatedTestSearch = lazy(() => import('./pages/academics/EvaluatedTestSearch'));
const FreezeTest = lazy(() => import('./pages/academics/FreezeTest'));
const TestPapersDownload = lazy(() => import('./pages/academics/TestPapersDownload'));
const SupplementaryTestEntry = lazy(() => import('./pages/academics/SupplementaryTestEntry'));
const ExamDashboard = lazy(() => import('./pages/academics/ExamDashboard'));
const FailedPercentageReport = lazy(() => import('./pages/academics/FailedPercentageReport'));
const PoorPerformanceReport = lazy(() => import('./pages/academics/PoorPerformanceReport'));
const TestCategorySearch = lazy(() => import('./pages/academics/TestCategorySearch'));
const BacklogStudents = lazy(() => import('./pages/academics/BacklogStudents'));
const InlineTestEntry = lazy(() => import('./pages/academics/InlineTestEntry'));
const TestUsageReport = lazy(() => import('./pages/academics/TestUsageReport'));
const ExternalTestEntry = lazy(() => import('./pages/academics/ExternalTestEntry'));
const ExternalSupplementaryEntry = lazy(() => import('./pages/academics/ExternalSupplementaryEntry'));
const TestImport = lazy(() => import('./pages/academics/TestImport'));

// Academics - Attendance
const AttendanceDashboard = lazy(() => import('./pages/academics/AttendanceDashboard'));
const TimetableSearch = lazy(() => import('./pages/academics/TimetableSearch'));
const TimetableIngestion = lazy(() => import('./pages/academics/TimetableIngestion'));
const AttendanceIngestor = lazy(() => import('./pages/academics/AttendanceIngestor'));
const StudentAttendance = lazy(() => import('./pages/academics/StudentAttendance'));
const SyncAttendance = lazy(() => import('./pages/academics/SyncAttendance'));
const ActivitySlots = lazy(() => import('./pages/academics/ActivitySlots'));
const ExamAttendance = lazy(() => import('./pages/academics/ExamAttendance'));
const StudentLeaveManagement = lazy(() => import('./pages/academics/StudentLeaveManagement'));
const AbsenteesReport = lazy(() => import('./pages/academics/AbsenteesReport'));
const AttendanceComparison = lazy(() => import('./pages/academics/AttendanceComparison'));

// Academics - Study Resource
const FeedbackForm = lazy(() => import('./pages/academics/FeedbackForm'));
const StudyResourceCreate = lazy(() => import('./pages/academics/StudyResourceCreate'));
const StudyResourceSearch = lazy(() => import('./pages/academics/StudyResourceSearch'));
const LearningModule = lazy(() => import('./pages/academics/LearningModule'));
const DiscussionBoard = lazy(() => import('./pages/academics/DiscussionBoard'));
const BulkResourceUpload = lazy(() => import('./pages/academics/BulkResourceUpload'));
const ResourceIssueSearch = lazy(() => import('./pages/academics/ResourceIssueSearch'));
const ResourceIngestion = lazy(() => import('./pages/academics/ResourceIngestion'));

// Academics - Question Bank
const QuestionIngestor = lazy(() => import('./pages/academics/QuestionIngestor'));
const QuestionSearch = lazy(() => import('./pages/academics/QuestionSearch'));
const PaperMaker = lazy(() => import('./pages/academics/PaperMaker'));
const NewQuestion = lazy(() => import('./pages/academics/NewQuestion'));
const QuestionImport = lazy(() => import('./pages/academics/QuestionImport'));
const TestDraftSearch = lazy(() => import('./pages/academics/TestDraftSearch'));

// Academics - Placement
const CompanyManagement = lazy(() => import('./pages/academics/CompanyManagement'));
const PlacementReport = lazy(() => import('./pages/academics/PlacementReport'));

// Agents
const AgentSearch = lazy(() => import('./pages/agents/AgentSearch'));
const AgentContract = lazy(() => import('./pages/agents/AgentContract'));
const ContractSearch = lazy(() => import('./pages/agents/ContractSearch'));
const DCFChangeRequest = lazy(() => import('./pages/agents/DCFChangeRequest'));
const RenewalRecommendation = lazy(() => import('./pages/agents/RenewalRecommendation'));
const RenewalApproval = lazy(() => import('./pages/agents/RenewalApproval'));

// Agents - Feedback
const FeedbackQuestions = lazy(() => import('./pages/agents/FeedbackQuestions'));
const AddFeedbackForm = lazy(() => import('./pages/agents/AddFeedbackForm'));
const FeedbackFormReport = lazy(() => import('./pages/agents/FeedbackFormReport'));
const AppraisalSection = lazy(() => import('./pages/agents/AppraisalSection'));
const PeerFeedback = lazy(() => import('./pages/agents/PeerFeedback'));
const FeedbackDashboard = lazy(() => import('./pages/agents/FeedbackDashboard'));
const FeedbackEntry = lazy(() => import('./pages/agents/FeedbackEntry'));

// Agents - Alumni
const AlumniManagement = lazy(() => import('./pages/agents/AlumniManagement'));
const AlumniApprovals = lazy(() => import('./pages/agents/AlumniApprovals'));

// Agents - Lesson Plan
const LessonPlanDashboard = lazy(() => import('./pages/agents/LessonPlanDashboard'));
const LessonPlan = lazy(() => import('./pages/agents/LessonPlan'));
const LessonPlanStatus = lazy(() => import('./pages/agents/LessonPlanStatus'));
const LessonPlanCoverage = lazy(() => import('./pages/agents/LessonPlanCoverage'));
const LessonPlanTeachers = lazy(() => import('./pages/agents/LessonPlanTeachers'));
const InstructorTimetable = lazy(() => import('./pages/agents/InstructorTimetable'));

// System
const UserManagement = lazy(() => import('./pages/system/UserManagement'));
const MessageTemplates = lazy(() => import('./pages/system/MessageTemplates'));
const MessageOutbox = lazy(() => import('./pages/system/MessageOutbox'));
const UploadedDocsLog = lazy(() => import('./pages/system/UploadedDocsLog'));
const SystemUsageLogs = lazy(() => import('./pages/system/SystemUsageLogs'));
const BlacklistedEmails = lazy(() => import('./pages/system/BlacklistedEmails'));
const BuildTree = lazy(() => import('./pages/system/BuildTree'));
const InvalidateCache = lazy(() => import('./pages/system/InvalidateCache'));
const CWUsageReport = lazy(() => import('./pages/system/CWUsageReport'));
const CustomSettings = lazy(() => import('./pages/system/CustomSettings'));

// Profile
const MyProfile = lazy(() => import('./pages/profile/MyProfile'));
const ChangePassword = lazy(() => import('./pages/profile/ChangePassword'));
const MyReferences = lazy(() => import('./pages/profile/MyReferences'));

const routes = [
  // Dashboard
  { path: 'dashboard', element: wrap(Home) },

  // Masters - Partners
  { path: 'masters/search-bu', element: wrap(SearchBU) },
  { path: 'masters/center-ingestion', element: wrap(CenterIngestion) },
  { path: 'masters/centres', element: wrap(Centres) },

  // Masters - Courses
  { path: 'masters/courses', element: wrap(CourseManagement) },
  { path: 'masters/modules', element: wrap(ModuleManagement) },
  { path: 'masters/cohorts', element: wrap(CohortManagement) },
  { path: 'masters/intakes', element: wrap(IntakeManagement) },
  { path: 'masters/course-tags', element: wrap(CourseTagHierarchy) },
  { path: 'masters/pathways', element: wrap(PathwayManagement) },
  { path: 'masters/timecraft', element: wrap(TimeCraftSearch) },
  { path: 'masters/program-view', element: wrap(ProgramView) },
  { path: 'masters/products', element: wrap(ProductManagement) },
  { path: 'masters/sections', element: wrap(SectionManagement) },
  { path: 'masters/section-ingestor', element: wrap(SectionIngestor) },
  { path: 'masters/current-terms', element: wrap(CurrentTerms) },

  // Masters - Payments
  { path: 'masters/installment-templates', element: wrap(InstallmentTemplate) },
  { path: 'masters/installment-structure', element: wrap(InstallmentStructure) },
  { path: 'masters/installment-ingestion', element: wrap(InstallmentIngestion) },
  { path: 'masters/promocodes', element: wrap(PromocodeSearch) },
  { path: 'masters/discounts', element: wrap(DiscountsManagement) },
  { path: 'masters/pricing-matrix', element: wrap(PricingMatrix) },
  { path: 'masters/fee-head-rule', element: wrap(FeeHeadRule) },

  // Masters - Others
  { path: 'masters/countries', element: wrap(CountrySearch) },

  // HR
  { path: 'hr/employees', element: wrap(EmployeeSearch) },
  { path: 'hr/employee-ingestor', element: wrap(EmployeeIngestor) },
  { path: 'hr/holidays', element: wrap(HolidayList) },
  { path: 'hr/bulk-operations', element: wrap(EmployeeBulkOperation) },
  { path: 'hr/leaves', element: wrap(LeaveDashboard) },

  // Finance
  { path: 'finance/payment-console', element: wrap(PaymentConsole) },
  { path: 'finance/app-payment-console', element: wrap(AppPaymentConsole) },
  { path: 'finance/invoice-run', element: wrap(InvoiceRun) },
  { path: 'finance/invoices', element: wrap(InvoiceSearch) },
  { path: 'finance/credit-notes', element: wrap(CreditNoteSearch) },
  { path: 'finance/revenue-reconcile', element: wrap(RevenueReconcile) },
  { path: 'finance/revenue-search', element: wrap(RevenueSearch) },
  { path: 'finance/refunds', element: wrap(RefundAdvice) },
  { path: 'finance/grid-report', element: wrap(FinanceGridReport) },
  { path: 'finance/daily-collections', element: wrap(DailyCollections) },
  { path: 'finance/defaulters', element: wrap(DefaultersReport) },
  { path: 'finance/payment-ingestion', element: wrap(PaymentIngestion) },
  { path: 'finance/payment-vs-installment', element: wrap(PaymentVsInstallment) },

  // Students - Registration
  { path: 'students/application', element: wrap(OnlineApplication) },
  { path: 'students/new', element: wrap(NewStudent) },
  { path: 'students/search', element: wrap(StudentSearch) },
  { path: 'students/documents', element: wrap(DocumentSearch) },
  { path: 'students/bulk-operations', element: wrap(BulkOperations) },
  { path: 'students/enquiry-import', element: wrap(EnquiryImport) },
  { path: 'students/photo-upload', element: wrap(StudentPhotoUpload) },
  { path: 'students/tickets', element: wrap(TicketSearch) },
  { path: 'students/document-lifecycle', element: wrap(DocumentLifecycle) },

  // Students - Operations
  { path: 'students/credit-note-import', element: wrap(CreditNoteImport) },
  { path: 'students/credit-management', element: wrap(CreditManagement) },
  { path: 'students/term-course-mapping', element: wrap(StudentTermCourseMapping) },
  { path: 'students/ingestion', element: wrap(StudentIngestion) },
  { path: 'students/refund-advice', element: wrap(RefundAdviceSearch) },
  { path: 'students/grade-card', element: wrap(GradeCardReports) },

  // Students - Applications
  { path: 'students/application-set', element: wrap(ApplicationSET) },
  { path: 'students/cert-enquiry', element: wrap(CertificateEnquiry) },
  { path: 'students/application-sbm', element: wrap(ApplicationSBM) },
  { path: 'students/simple-leads', element: wrap(SimpleLeadsForm) },

  // Reports - General
  { path: 'reports/cohort', element: wrap(CohortReports) },
  { path: 'reports/canned', element: wrap(CannedReport) },
  { path: 'reports/grid', element: wrap(GridReport) },
  { path: 'reports/daily', element: wrap(DailyReports) },
  { path: 'reports/dashboards', element: wrap(MyDashboards) },
  { path: 'reports/section', element: wrap(SectionReports) },
  { path: 'reports/section-transfers', element: wrap(SectionTransfers) },

  // Reports - Test
  { path: 'reports/test-spread', element: wrap(TestSpreadReport) },
  { path: 'reports/test-report', element: wrap(TestReport) },
  { path: 'reports/sectionwise', element: wrap(SectionwiseReport) },
  { path: 'reports/cumulative-test', element: wrap(CumulativeTestReport) },
  { path: 'reports/category-test', element: wrap(CategoryTestReport) },
  { path: 'reports/audit-trail', element: wrap(AuditTrail) },
  { path: 'reports/test-monitoring', element: wrap(TestDataEntryMonitoring) },
  { path: 'reports/overwrite-test-time', element: wrap(OverwriteTestTime) },
  { path: 'reports/academic-misconduct', element: wrap(AcademicMisconductReport) },
  { path: 'reports/module-appeal', element: wrap(ModuleAppealReport) },
  { path: 'reports/mab-updates', element: wrap(MABUpdatesReport) },

  // Reports - Attendance
  { path: 'reports/datewise-attendance', element: wrap(DatewiseAttendanceReport) },
  { path: 'reports/instructor-attendance', element: wrap(InstructorAttendanceReport) },
  { path: 'reports/attendance-slot', element: wrap(AttendanceSlotReport) },
  { path: 'reports/non-conducted', element: wrap(NonConductedClasses) },
  { path: 'reports/cumulative-attendance', element: wrap(CumulativeAttendanceReport) },
  { path: 'reports/daily-consolidated', element: wrap(DailyConsolidatedAttendance) },
  { path: 'reports/eod-summary', element: wrap(EODSummaryReport) },

  // Reports - Other
  { path: 'reports/video-stream', element: wrap(VideoStreamLogs) },
  { path: 'reports/instructor-feedback', element: wrap(InstructorFeedbackReport) },
  { path: 'reports/trainings-dashboard', element: wrap(TrainingsDashboard) },

  // Academics - Tests
  { path: 'academics/graduation', element: wrap(GraduationRun) },
  { path: 'academics/tests', element: wrap(TestSearch) },
  { path: 'academics/test-creation', element: wrap(TestCreation) },
  { path: 'academics/test-structure', element: wrap(TestStructure) },
  { path: 'academics/test-statistics', element: wrap(TestStatistics) },
  { path: 'academics/marks-import', element: wrap(MarksImport) },
  { path: 'academics/marks-ingestor', element: wrap(MarksIngestor) },
  { path: 'academics/grade-boundaries', element: wrap(GradeBoundaries) },
  { path: 'academics/passing-rate', element: wrap(PassingRateReport) },
  { path: 'academics/second-evaluator', element: wrap(AssignSecondEvaluator) },
  { path: 'academics/evaluated-tests', element: wrap(EvaluatedTestSearch) },
  { path: 'academics/freeze-test', element: wrap(FreezeTest) },
  { path: 'academics/test-papers', element: wrap(TestPapersDownload) },
  { path: 'academics/supplementary-test', element: wrap(SupplementaryTestEntry) },
  { path: 'academics/exam-dashboard', element: wrap(ExamDashboard) },
  { path: 'academics/failed-percentage', element: wrap(FailedPercentageReport) },
  { path: 'academics/poor-performance', element: wrap(PoorPerformanceReport) },
  { path: 'academics/test-categories', element: wrap(TestCategorySearch) },
  { path: 'academics/backlog-students', element: wrap(BacklogStudents) },
  { path: 'academics/inline-test-entry', element: wrap(InlineTestEntry) },
  { path: 'academics/test-usage', element: wrap(TestUsageReport) },
  { path: 'academics/external-test-entry', element: wrap(ExternalTestEntry) },
  { path: 'academics/external-supplementary', element: wrap(ExternalSupplementaryEntry) },
  { path: 'academics/test-import', element: wrap(TestImport) },

  // Academics - Attendance
  { path: 'academics/attendance-dashboard', element: wrap(AttendanceDashboard) },
  { path: 'academics/timetable', element: wrap(TimetableSearch) },
  { path: 'academics/timetable-ingestion', element: wrap(TimetableIngestion) },
  { path: 'academics/attendance-ingestor', element: wrap(AttendanceIngestor) },
  { path: 'academics/student-attendance', element: wrap(StudentAttendance) },
  { path: 'academics/sync-attendance', element: wrap(SyncAttendance) },
  { path: 'academics/activity-slots', element: wrap(ActivitySlots) },
  { path: 'academics/exam-attendance', element: wrap(ExamAttendance) },
  { path: 'academics/student-leave', element: wrap(StudentLeaveManagement) },
  { path: 'academics/absentees', element: wrap(AbsenteesReport) },
  { path: 'academics/attendance-comparison', element: wrap(AttendanceComparison) },

  // Academics - Study Resource
  { path: 'academics/feedback-form', element: wrap(FeedbackForm) },
  { path: 'academics/resource-create', element: wrap(StudyResourceCreate) },
  { path: 'academics/resources', element: wrap(StudyResourceSearch) },
  { path: 'academics/learning-module', element: wrap(LearningModule) },
  { path: 'academics/discussion', element: wrap(DiscussionBoard) },
  { path: 'academics/resource-bulk-upload', element: wrap(BulkResourceUpload) },
  { path: 'academics/resource-issues', element: wrap(ResourceIssueSearch) },
  { path: 'academics/resource-ingestion', element: wrap(ResourceIngestion) },

  // Academics - Question Bank
  { path: 'academics/question-ingestor', element: wrap(QuestionIngestor) },
  { path: 'academics/question-search', element: wrap(QuestionSearch) },
  { path: 'academics/paper-maker', element: wrap(PaperMaker) },
  { path: 'academics/new-question', element: wrap(NewQuestion) },
  { path: 'academics/question-import', element: wrap(QuestionImport) },
  { path: 'academics/test-drafts', element: wrap(TestDraftSearch) },

  // Academics - Placement
  { path: 'academics/companies', element: wrap(CompanyManagement) },
  { path: 'academics/placement-report', element: wrap(PlacementReport) },

  // Agents
  { path: 'agents/search', element: wrap(AgentSearch) },
  { path: 'agents/contract', element: wrap(AgentContract) },
  { path: 'agents/contracts', element: wrap(ContractSearch) },
  { path: 'agents/dcf-requests', element: wrap(DCFChangeRequest) },
  { path: 'agents/renewal-recommendation', element: wrap(RenewalRecommendation) },
  { path: 'agents/renewal-approval', element: wrap(RenewalApproval) },

  // Agents - Feedback
  { path: 'agents/feedback-questions', element: wrap(FeedbackQuestions) },
  { path: 'agents/add-feedback-form', element: wrap(AddFeedbackForm) },
  { path: 'agents/feedback-report', element: wrap(FeedbackFormReport) },
  { path: 'agents/appraisal', element: wrap(AppraisalSection) },
  { path: 'agents/peer-feedback', element: wrap(PeerFeedback) },
  { path: 'agents/feedback-dashboard', element: wrap(FeedbackDashboard) },
  { path: 'agents/feedback-entry', element: wrap(FeedbackEntry) },

  // Agents - Alumni
  { path: 'agents/alumni', element: wrap(AlumniManagement) },
  { path: 'agents/alumni-approvals', element: wrap(AlumniApprovals) },

  // Agents - Lesson Plan
  { path: 'agents/lessonplan-dashboard', element: wrap(LessonPlanDashboard) },
  { path: 'agents/lessonplan', element: wrap(LessonPlan) },
  { path: 'agents/lessonplan-status', element: wrap(LessonPlanStatus) },
  { path: 'agents/lessonplan-coverage', element: wrap(LessonPlanCoverage) },
  { path: 'agents/lessonplan-teachers', element: wrap(LessonPlanTeachers) },
  { path: 'agents/instructor-timetable', element: wrap(InstructorTimetable) },

  // System
  { path: 'system/users', element: wrap(UserManagement) },
  { path: 'system/message-templates', element: wrap(MessageTemplates) },
  { path: 'system/message-outbox', element: wrap(MessageOutbox) },
  { path: 'system/uploaded-docs-log', element: wrap(UploadedDocsLog) },
  { path: 'system/usage-logs', element: wrap(SystemUsageLogs) },
  { path: 'system/blacklisted-emails', element: wrap(BlacklistedEmails) },
  { path: 'system/build-tree', element: wrap(BuildTree) },
  { path: 'system/invalidate-cache', element: wrap(InvalidateCache) },
  { path: 'system/cw-usage-report', element: wrap(CWUsageReport) },
  { path: 'system/custom-settings', element: wrap(CustomSettings) },

  // Profile
  { path: 'profile', element: wrap(MyProfile) },
  { path: 'profile/change-password', element: wrap(ChangePassword) },
  { path: 'profile/references', element: wrap(MyReferences) },
];

export default routes;