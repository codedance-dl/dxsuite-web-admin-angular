export interface Query {
  pageNo?: number;
  pageSize?: number;
  sortBy?: string[];
  userId?: string;
}

export interface AccessToken {
  id: string;
  appId: string;
  client: string;
  refreshedAt: string;
  remoteAddr: string;
  userAgent: string;
}
