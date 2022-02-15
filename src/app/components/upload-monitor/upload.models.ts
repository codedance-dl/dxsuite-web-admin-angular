/* eslint-disable @typescript-eslint/no-explicit-any */
import { Subscription } from 'rxjs';

export declare type UploadEvent = UploadResponse | UploadError;

export enum UploadStatus {
  BEGIN = 0,
  SENDING = 1,
  SUCCESS = 2,
  ERROR = 3,
  UPLOADED = 4
}

export abstract class UploadRef {
  file: File | Blob;
  name: string;
  size: number;
  id?: string;
  type?: string;
  status?: UploadStatus;
  error?: string;
  link?: string;
  data?: any;
  progress?: number;
  subscription?: Subscription;

  constructor(file: File | Blob, name: string, size: number) {
    this.file = file;
    this.name = name;
    this.size = size;
  }
}

export class UploadResponse {
  data: any;

  constructor(data) {
    this.data = data;
  }
}

export class UploadError {
  file: File | Blob;
  error: any;

  constructor(file: File | Blob, error: any) {
    this.file = file;
    this.error = error;
  }
}

export interface UploadRequest {
  url: string;
  file: File;
}

export class UploadJob extends UploadRef {
  constructor(public request: UploadRequest) {
    super(request.file, request.file.name, request.file.size);
  }
}

