export interface UsersModel {
  id: string;
  name: string;
  email: string;
  mobile: string;
  type: string;
  createdAt: Date;
}

export interface UsersQuery {
  keyword?: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string[];
}
