/**
 * Role-Based Access Control (RBAC) Configuration
 *
 * Roles:
 *   - student: Student (application form, own profile)
 *   - sales_cm: Sales - Country Manager
 *   - sales_pe: Sales - Program Executive
 *   - sales_planner: Sales - Planner
 *   - admission: Admission
 *   - admission_acads: Admission - Acads
 *   - exam: Exam
 *   - finance: Finance
 *   - admin_it: Admin - IT
 *   - admin_user: Admin - User
 *   - root: Root (full access)
 */

export const ROLES = {
  STUDENT: 'student',
  SALES_CM: 'sales_cm',
  SALES_PE: 'sales_pe',
  SALES_PLANNER: 'sales_planner',
  ADMISSION: 'admission',
  ADMISSION_ACADS: 'admission_acads',
  EXAM: 'exam',
  FINANCE: 'finance',
  ADMIN_IT: 'admin_it',
  ADMIN_USER: 'admin_user',
  ROOT: 'root',
};

export const ROLE_LABELS = {
  [ROLES.STUDENT]: 'Student',
  [ROLES.SALES_CM]: 'Sales - Country Manager',
  [ROLES.SALES_PE]: 'Sales - Program Executive',
  [ROLES.SALES_PLANNER]: 'Sales - Planner',
  [ROLES.ADMISSION]: 'Admission',
  [ROLES.ADMISSION_ACADS]: 'Admission - Acads',
  [ROLES.EXAM]: 'Exam',
  [ROLES.FINANCE]: 'Finance',
  [ROLES.ADMIN_IT]: 'Admin - IT',
  [ROLES.ADMIN_USER]: 'Admin - User',
  [ROLES.ROOT]: 'Root',
};

export const ROLE_GROUPS = {
  'Sales': [ROLES.SALES_CM, ROLES.SALES_PE, ROLES.SALES_PLANNER],
  'Admission': [ROLES.ADMISSION, ROLES.ADMISSION_ACADS],
  'Admin': [ROLES.ADMIN_IT, ROLES.ADMIN_USER],
};

/**
 * Menu module access per role.
 * Each key is a menu module id from menuConfig.js.
 * Values are arrays of roles that can access that module.
 * Root always has access to everything (handled in code).
 */
export const MODULE_ACCESS = {
  masters: [
    ROLES.SALES_CM, ROLES.SALES_PE, ROLES.SALES_PLANNER,
    ROLES.ADMISSION, ROLES.ADMISSION_ACADS,
    ROLES.ADMIN_IT, ROLES.ADMIN_USER,
  ],
  finance: [
    ROLES.FINANCE,
    ROLES.ADMIN_IT,
  ],
  student: [
    ROLES.STUDENT,
    ROLES.SALES_CM, ROLES.SALES_PE, ROLES.SALES_PLANNER,
    ROLES.ADMISSION, ROLES.ADMISSION_ACADS,
    ROLES.ADMIN_IT, ROLES.ADMIN_USER,
  ],
  reports: [
    ROLES.SALES_CM, ROLES.SALES_PE, ROLES.SALES_PLANNER,
    ROLES.ADMISSION, ROLES.ADMISSION_ACADS,
    ROLES.EXAM,
    ROLES.FINANCE,
    ROLES.ADMIN_IT, ROLES.ADMIN_USER,
  ],
  academics: [
    ROLES.ADMISSION_ACADS,
    ROLES.EXAM,
    ROLES.ADMIN_IT, ROLES.ADMIN_USER,
  ],
  agents: [
    ROLES.SALES_CM, ROLES.SALES_PE, ROLES.SALES_PLANNER,
    ROLES.ADMISSION, ROLES.ADMISSION_ACADS,
    ROLES.ADMIN_IT, ROLES.ADMIN_USER,
  ],
  system: [
    ROLES.ADMIN_IT, ROLES.ADMIN_USER,
  ],
};

/**
 * Path-level access overrides.
 * More granular than module-level — restricts specific paths to specific roles.
 * If a path is listed here, ONLY these roles (plus root) can access it.
 * If a path is NOT listed here, module-level access applies.
 */
export const PATH_ACCESS = {
  // Student-only paths
  '/students/application': [ROLES.STUDENT, ROLES.SALES_CM, ROLES.SALES_PE, ROLES.SALES_PLANNER, ROLES.ADMISSION, ROLES.ADMIN_IT],
  '/students/search': [ROLES.SALES_CM, ROLES.SALES_PE, ROLES.SALES_PLANNER, ROLES.ADMISSION, ROLES.ADMISSION_ACADS, ROLES.ADMIN_IT, ROLES.ADMIN_USER],
  '/students/documents': [ROLES.SALES_CM, ROLES.SALES_PE, ROLES.SALES_PLANNER, ROLES.ADMISSION, ROLES.ADMISSION_ACADS, ROLES.ADMIN_IT, ROLES.ADMIN_USER],

  // Finance-restricted paths
  '/finance/payment-console': [ROLES.FINANCE, ROLES.ADMIN_IT],
  '/finance/invoices': [ROLES.FINANCE, ROLES.ADMIN_IT],
  '/finance/credit-notes': [ROLES.FINANCE, ROLES.ADMIN_IT],
  '/finance/refunds': [ROLES.FINANCE, ROLES.ADMIN_IT],
  '/finance/revenue-reconcile': [ROLES.FINANCE, ROLES.ADMIN_IT],

  // Exam-related paths
  '/academics/test-creation': [ROLES.EXAM, ROLES.ADMISSION_ACADS, ROLES.ADMIN_IT],
  '/academics/freeze-test': [ROLES.EXAM, ROLES.ADMIN_IT],
  '/academics/graduation': [ROLES.EXAM, ROLES.ADMISSION_ACADS, ROLES.ADMIN_IT],

  // System admin paths
  '/system/users': [ROLES.ADMIN_IT, ROLES.ADMIN_USER],
  '/system/custom-settings': [ROLES.ADMIN_IT],
};

/**
 * Demo user accounts — one per role for testing.
 */
export const DEMO_USERS = [
  { username: 'manoj', password: 'Manoj@PierianSms1', name: 'Manoj Kumar', role: ROLES.ROOT },
  { username: 'admin', password: 'admin123', name: 'Administrator', role: ROLES.ROOT },
  { username: 'student1', password: 'student123', name: 'John Tan', role: ROLES.STUDENT },
  { username: 'sales_cm', password: 'sales123', name: 'Sarah Lee (CM)', role: ROLES.SALES_CM },
  { username: 'sales_pe', password: 'sales123', name: 'Michael Wong (PE)', role: ROLES.SALES_PE },
  { username: 'planner', password: 'planner123', name: 'Lisa Chen', role: ROLES.SALES_PLANNER },
  { username: 'admission', password: 'admission123', name: 'Ravi Sharma', role: ROLES.ADMISSION },
  { username: 'acads', password: 'acads123', name: 'Priya Menon', role: ROLES.ADMISSION_ACADS },
  { username: 'exam', password: 'exam123', name: 'David Lim', role: ROLES.EXAM },
  { username: 'finance', password: 'finance123', name: 'Amy Tan', role: ROLES.FINANCE },
  { username: 'it_admin', password: 'admin123', name: 'James Ho', role: ROLES.ADMIN_IT },
  { username: 'user_admin', password: 'admin123', name: 'Kevin Ng', role: ROLES.ADMIN_USER },
];

/**
 * Check if a role has access to a specific menu module.
 */
export function hasModuleAccess(role, moduleId) {
  if (role === ROLES.ROOT) return true;
  const allowed = MODULE_ACCESS[moduleId];
  return allowed ? allowed.includes(role) : false;
}

/**
 * Check if a role has access to a specific path.
 * Falls back to module-level access if path isn't explicitly restricted.
 */
export function hasPathAccess(role, path) {
  if (role === ROLES.ROOT) return true;

  // Check path-level override first
  const pathRoles = PATH_ACCESS[path];
  if (pathRoles) {
    return pathRoles.includes(role);
  }

  // Fall back to module-level access
  const moduleId = getModuleFromPath(path);
  if (moduleId) {
    return hasModuleAccess(role, moduleId);
  }

  // Dashboard and profile are accessible to everyone
  return true;
}

/**
 * Filter menuConfig based on user role.
 */
export function filterMenuByRole(menuItems, role) {
  if (role === ROLES.ROOT) return menuItems;

  return menuItems
    .filter((module) => hasModuleAccess(role, module.id))
    .map((module) => ({
      ...module,
      groups: module.groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => hasPathAccess(role, item.path)),
        }))
        .filter((group) => group.items.length > 0),
    }))
    .filter((module) => module.groups.length > 0);
}

/**
 * Helper: extract module id from a route path.
 */
function getModuleFromPath(path) {
  if (!path) return null;
  const segment = path.split('/')[1];
  const moduleMap = {
    masters: 'masters',
    finance: 'finance',
    students: 'student',
    reports: 'reports',
    academics: 'academics',
    agents: 'agents',
    hr: 'agents', // HR is under agent management
    system: 'system',
  };
  return moduleMap[segment] || null;
}

/**
 * Check if role belongs to a role group (e.g., 'Sales', 'Admin').
 */
export function isInRoleGroup(role, groupName) {
  const group = ROLE_GROUPS[groupName];
  return group ? group.includes(role) : false;
}

/**
 * Check if user has any of the given roles.
 */
export function hasAnyRole(userRole, roles) {
  if (userRole === ROLES.ROOT) return true;
  return roles.includes(userRole);
}