export interface EmployeesModel {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
  id?: string;
  user?: {
    id: string;
    name: string;
    mobile?: string;
    email?: string;
  };
  employee?: {
    id: string;
    approvedAt: string;
  };
}

export interface CreateEmployeeDataModal {
  roleIDs: string[];
  account?: string;
  name: string;
  email?: string;
  mobile?: string;
  userCredential?: string;
  password?: string;
}

export const EmployeesStatusMap = {
  PENDING: '邀请中',
  APPROVED: '已接受'
};

export type ValidateStatus = 'success' | 'warning' | 'error' | 'validating';
