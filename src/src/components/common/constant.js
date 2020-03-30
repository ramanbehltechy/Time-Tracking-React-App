export default {
  API_ROOT: 'http://localhost:3002',  // FOR LOCAL
  //API_ROOT:'http://103.231.77.115:3002',  // FOR PRODUCTION
  API_HEADER: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  SETTINGS_TABS: {
    'Banks': 0,
    'Designations': 1,
    'Departments': 2,
    'DefaultColumns': 3,
    'Shifts': 4,
  },
  VALIDATE_USER: '/User/ValidateUser',
  GET_USERS: '/User/GetEmployees',
  GET_Employees_Status: '/User/GetEmployeesStatus',
  GET_EMPLOYEE_DETAILS: '/User/GetEmployeeDetails',
  GET_EMPLOYEE_REPORT: '/Report/GetEmployeeReport',
  GET_TIMING_DATA: '/User/GetTimingData',
  GET_ALL_LIST_DATA: '/User/GetAllListData',
  ADD_EMPLOYEE: '/User/AddEmployee',
  DELETE_EMPLOYEE: '/User/DeleteEmployee',
  GET_EMPLOYEE_SCREENS: '/User/GetEmployeeScreens',
  GET_EMPLOYEE_BASE64_IMAGE: '/User/GetEmployeeImageBase64',
  CHECK_EMAIL_EXIST: '/User/CheckEmailExist',

  //Bank
  GET_BANKS: '/Bank/GetBanks',
  GET_BANK_DETAILS: '/Bank/GetBankDetails',
  GET_BANK_MASTER_DATA: '/Bank/GetMasterData',
  ADD_BANK: '/Bank/AddBank',

  //Designation
  GET_DESIGNATIONS: '/Designation/GetDesignations',
  GET_DESIGNATION_DETAILS: '/Designation/GetDesignationDetails',
  GET_DESIGNATION_MASTER_DATA: '/Designation/GetMasterData',
  ADD_DESIGNATION: '/Designation/AddDesignation',

  //Department
  GET_DEPARTMENTS: '/Department/GetDepartments',
  GET_DEPARTMENT_DETAILS: '/Department/GetDepartmentDetails',
  GET_DEPARTMENT_MASTER_DATA: '/Department/GetMasterData',
  ADD_DEPARTMENT: '/Department/AddDepartment',

  //Default Columns 
  GET_DEFAULT_COLUMN_MASTER: '/DefaultColumn/GetMasterData',
  SAVE_DEFAULT_COLUMNS: '/DefaultColumn/SaveDefaultColumn',

  //Shift
  GET_SHIFTS: '/Shift/GetShifts',
  GET_SHIFT_DETAILS: '/Shift/GetShiftDetails',
  GET_SHIFT_MASTER_DATA: '/Shift/GetMasterData',
  ADD_SHIFT: '/Shift/AddShift',
} 
