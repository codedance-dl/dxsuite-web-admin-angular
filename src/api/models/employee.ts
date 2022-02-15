import { BaseQuery } from '.';

export interface Employee {
  id: string;
  mobile: string;
  name: string;
  createdAt?: string;
  employeeName?: string;
}

export interface EmployeeQuery extends BaseQuery{
  approval: 'ALL'|'PENDING'|'APPROVE'|'DREJECTED';
}
