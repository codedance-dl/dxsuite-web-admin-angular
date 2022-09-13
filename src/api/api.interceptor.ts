/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, throwError } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export const clearToken = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('accessTokenExpiresTime');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('refreshTokenExpiresTime');
};

export const ERROR_CODES = [
  'error.access-token-expired',
  'error.access-token-invalid'
];

type AnyProperties = {
  [key: string]: any;
};

// 全局 API 请求拦截器
@Injectable({
  providedIn: 'root'
})
export class ApiInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const accessToken = localStorage.getItem('accessToken');
    const accessTokenExpiresTime = parseInt(localStorage.getItem('accessTokenExpiresTime'));
    const refreshToken = localStorage.getItem('refreshToken');
    const refreshTokenExpiresTime = parseInt(localStorage.getItem('refreshTokenExpiresTime'));

    // 10s即将过期
    const maxExpiresAt = Date.now() + 10000;

    if (refreshTokenExpiresTime < maxExpiresAt) {
      // 清空token，重新登录
      this.router.navigate(['/login']);
    }

    if (accessTokenExpiresTime < maxExpiresAt) {
      const newRequest = request.clone({
        url: `${environment.host}/api/v${environment.revision}/authorization/refresh-all`,
        method: 'POST',
        responseType: 'json',
        setHeaders: {
          'Authorization': `Bearer ${refreshToken}`,
          'Accept-Language': localStorage.getItem('language')
        }
      });
      return next.handle(newRequest).pipe(
        filter((item: any) => item.body?.data?.accessToken),
        switchMap((res: any) => {
          localStorage.setItem('accessToken', res.body?.data?.accessToken);
          localStorage.setItem('accessTokenExpiresTime', res.body?.data?.accessTokenExpiresAt);
          localStorage.setItem('refreshToken', res.body?.data?.refreshToken);
          localStorage.setItem('refreshTokenExpiresTime', res.body?.data?.refreshTokenExpiresAt);
          request = request.clone({
            setHeaders: { Authorization: `Bearer ${res.body?.data?.accessToken}` }
          });
          return next.handle(request).pipe(
            catchError(event => this._errorHandler(event)),
            map(event => this._requestHandler(event))
          );
        })
      );

    } else {
      if (accessToken) {
        request = request.clone({
          setHeaders: { Authorization: `Bearer ${accessToken}` }
        });
      }
      return next.handle(request).pipe(
        catchError(event => this._errorHandler(event)),
        map(event => this._requestHandler(event))
      );
    }
  }

  /**
   * 解析数据对象。
   */
  resolveContext(context, included) {
    if (!context) {
      return;
    }

    // 当为数组时解析每一个元素
    if (Array.isArray(context)) {
      context.forEach(item => {
        this.resolveContext(item, included);
      });
      return;
    }

    // 若不为对象或已解析则不做处理
    if (!this.isObject(context) || context.$resolved) {
      return;
    }

    // 将对象标记为已解析
    Object.defineProperty(context, '$resolved', { value: true });
    this._resolveObjectKeys(context, included);
  }

  isObject(value: any) {
    return Object.prototype.toString.call(value) === '[object Object]';
  }

  /**
   * 请求事件处理
   */
  private _requestHandler(event: HttpEvent<any>) {

    if (event instanceof HttpResponse) {
      const body = event.body;
      if (body?.data?.accessToken) {
        localStorage.setItem('accessToken', body.data.accessToken);
        localStorage.setItem('accessTokenExpiresTime', body.data.accessTokenExpiresAt);
        localStorage.setItem('refreshToken', body.data.refreshToken);
        localStorage.setItem('refreshTokenExpiresTime', body.data.refreshTokenExpiresAt);
      }

      if (body.data && this.isObject(body.included)) {
        this.resolveContext(body.data, body.included);
      }
    }
    return event;
  }

  /**
   * 请求错误处理
   */
  private _errorHandler(event: HttpEvent<unknown>) {
    if (event instanceof HttpErrorResponse) {
      if (event.status >= 400 && event.status < 500) {
        if (event.status === 401 && ERROR_CODES.indexOf(event.error.error.code) > -1) {
          clearToken();
          location.href = '/';
        }
        return throwError(event.error);
      } else if (event.status === 500 && event.error.error.type === 'org.springframework.security.access.AccessDeniedException') {
        return throwError({ error: { message: '你的帐号没有操作权限，如有疑问，请联系管理员' } });
      } else if (event.status >= 500) {
        return throwError({ error: { message: 'Internal Server Error' } });
      }
    }
    return throwError(event);
  }

  /**
   * 解析对象属性
   */
  private _resolveObjectKeys(context: AnyProperties, included: AnyProperties) {
    Object.keys(context).forEach(propertyName => {
      const property = context[propertyName];
      if (!property) {
        return;
      }

      let entity;

      // 若为实体 ID 则合并对象属性
      if (propertyName === '$ref'
        && typeof property === 'string'
        && (entity = included[property])) {
        delete context.$ref;
        Object.defineProperty(context, '$ref', { value: property });
        Object.keys(entity).forEach(newPropertyName => {
          if (context[newPropertyName] !== null
            && typeof context[newPropertyName] !== 'undefined') {
            return;
          }

          // 防止对象属性引用自己，形成无限引用
          if (context !== entity[newPropertyName]) {
            context[newPropertyName] = entity[newPropertyName];
          }
          this.resolveContext(context[newPropertyName], included);
        });
        // 否则解析属性
      } else {
        this.resolveContext(property, included);
      }
    });
  }
}
