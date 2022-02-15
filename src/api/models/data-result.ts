// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequestQueryParams<T = { [key: string]: any }> = T;

/**
 * @description
 * HTTP 接口错误信息
 */
export interface DataServiceError {
  code: string;
  message: string;
  status?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  suppressed?: any;
}

/**
 * @description
 * 列表请求的元数据
 */
export interface DataServiceMetadata {
  count: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  isFirstPage?: boolean;
  isLastPage?: boolean;
  pageNo: number;
  pageSize: number;
  pages?: number;
}

/**
 * @description
 * HTTP 接口响应标准数据格式
 */
export interface DataServiceResult {
  accessToken?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  error?: DataServiceError;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  links?: any;
  meta?: DataServiceMetadata;
  status?: number;
  success: boolean;
  revision?: number;
}
