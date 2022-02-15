/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataServiceResult } from '@api/models';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { filter, map } from 'rxjs/operators';
import { UploadEvent, UploadRef, UploadResponse, UploadStatus } from './upload.models';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class UploadHandler {

  constructor(private http: HttpClient) {
  }

  upload(url: string, uploadRef: UploadRef): Observable<UploadEvent> {
    if (/^(http|https|\/\/)/.test(url) === false) {
      url = `${environment.host}${url}?name=${uploadRef.name}`;
    }

    const data = this.getRequestData(uploadRef.file);

    return this.http.request<any>(new HttpRequest('POST', url, data, { reportProgress: true }))
      .pipe(
        map(event => this.progress(event, uploadRef)),
        filter(event => event.type === HttpEventType.Response),
        map((event: HttpResponse<any>) =>
          new UploadResponse(this.getResponseData(event.body))
        )
      );
  }

  getRequestData(file: File | Blob) {
    return file;
  }

  getResponseData(body: DataServiceResult): any {
    return body.data;
  }

  getErrorMessage(error: HttpErrorResponse) {
    return error.statusText;
  }

  /**
   * 处理上传任务的进度
   * @param event 上传事件
   * @param uploadRef 上传任务
   */
  private progress(event: HttpEvent<any>, uploadRef: UploadRef) {

    if (event.type === HttpEventType.Sent) {
      /** 开始 */
      uploadRef.status = UploadStatus.BEGIN;
    } else if (event.type === HttpEventType.UploadProgress && (event.total && event.total > 0)) {
      /** 进度更新 */
      uploadRef.progress = Math.round(event.loaded / event.total * 100);
    } else if (event.type === HttpEventType.Response) {
      /** 结束 */
      uploadRef.status = UploadStatus.UPLOADED;
    }

    return event;
  }
}

