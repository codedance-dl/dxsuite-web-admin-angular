import * as qs from 'qs';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';

import { DataServiceResult } from './models';

export const HTTP_HOST = new InjectionToken<string>('http-host');
export const HTTP_REVISION = new InjectionToken<string>('http-revision');

/**
 * @description
 * HttpClinet 服务封装类
 */
export class HttpService {

  constructor(
    private http: HttpClient,
    private host: string) { }

  // request<T = DataServiceResult>(method: string, url: string, options?: any): Observable<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request<T = DataServiceResult>(method: string, url: string, options?: any) {
    return this.http.request<T>(method, this.host + url, options) as unknown as Observable<T>;
  }

  // delete<T = DataServiceResult>(url: string, body?: any, options?: any): Observable<T>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete<T = DataServiceResult>(url: string, options?: any) {
    return this.http.request<T>('DELETE', this.host + url, { ...options }) as unknown as Observable<T>;
  }

  // get<T = DataServiceResult>(url: string, options?: any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get<T = DataServiceResult>(url: string, options?: any) {
    return this.http.get<T>(this.host + url, options) as unknown as Observable<T>;
  }

  // post<T = DataServiceResult>(url: string, body: any, options?: any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post<T = DataServiceResult>(url: string, body: any, options?: any) {
    return this.http.post<T>(this.host + url, body, options) as unknown as Observable<T>;
  }

  // put<T = DataServiceResult>(url: string, body: any, options?: any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  put<T = DataServiceResult>(url: string, body?: any, options?: any) {
    return this.http.put<T>(this.host + url, body, options) as unknown as Observable<T>;
  }

  // patch<T = DataServiceResult>(url: string, body?, options?: any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  patch<T = DataServiceResult>(url: string, body?: any, options?: any) {
    return this.http.patch<T>(this.host + url, body, options) as unknown as Observable<T>;
  }
}

/**
 * @description
 * API 服务基类，
 */
@Injectable()
export abstract class DataService {

  http: HttpService;

  constructor(
    @Inject(HttpClient) http: HttpClient,
    @Inject(HTTP_HOST) host: string,
    @Inject(HTTP_REVISION) revision: string,
  ) {
    this.http = new HttpService(http, `${host}/api/v${revision}`);
  }

  protected queryParse(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: { [key: string]: any },
    options: qs.IStringifyOptions = {
      arrayFormat: 'repeat',
      addQueryPrefix: true,
      skipNulls: true
    }): string {

    if (typeof query === 'object' && query.sort) {
      delete query.sort;
    }

    return qs.stringify(query, options);
  }
}
