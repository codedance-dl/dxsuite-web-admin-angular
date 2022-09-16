export type PwInputType = 'password' | 'text';

export const pw: PwInputType = 'password';
export const text: PwInputType = 'text';

export interface User {
  createdAt?: string;
  createdBy: { $ref: string };
  deleted?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  namePinyin?: string;
  revision?: string;
  type?: string;
}

export interface LogsModel {
  id: string;
  biz: string;
  comment: string;
  domain: string;
  createdAt: Date;
  success: boolean;
  user?: User;
}

export interface ResponseLogsModel {
  id: string;
  biz: string;
  className?: string;
  comment: string;
  domain: string;
  createdAt: Date;
  success: boolean | string;
  contentLength?: number;
  errorMessage?: string;
  method?: string;
  methodName?: string;
  org?: string;
  params?: string;
  query?: string;
  remoteAddr?: string;
  responsibility?: string;
  serverAddrPort?: string;
  statusCode?: number;
  time?: string | Date;
  timeCost?: number;
  url?: string;
  userAgent?: string;
  userName?: string;
  userCredentials?: string;
  user?: User;
}

export interface Method {
  name?: string;
  description?: string;
}
export interface ControllerMethods{
  name?: string;
  domain?: string;
  entity?: string;
  methods?: Method[];
  responsibility?: string;
}

export interface AuditsQuery {
  orgId?: string;
  pageNo?: number;
  pageSize?: number;
  sortBy?: string[];
  userId?: string;
}
