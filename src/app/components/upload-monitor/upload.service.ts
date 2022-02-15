/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, Subject } from 'rxjs';
import { filter, map, switchMap, take, takeUntil } from 'rxjs/operators';

import { Injectable, OnDestroy } from '@angular/core';
import { FileEntry } from '@api/models/files';

import { UploadHandler } from './upload.handler';
import { UploadJob, UploadRequest, UploadStatus } from './upload.models';

@Injectable({ providedIn: 'root' })
export class UploadService implements OnDestroy {

  private destroy = new Subject();

  /** 已完成的 Jobs */
  private completedJobs: UploadJob[] = [];

  /** 等待执行的 Jobs */
  private waitingJobs: UploadJob[] = [];

  /** 正在执行的 Jobs */
  private workingJobs: UploadJob[] = [];

  get workingCount() {
    return this.workingJobs.length;
  }

  /** 队列需要变更时触发 */
  private change = new Subject();

  /** 队列流 */
  readonly queue: Observable<UploadJob[]> = this.change.pipe(
    map(() => this.completedJobs.concat(this.workingJobs, this.waitingJobs))
  );

  private _done = new Subject<FileEntry>();

  get done() { return this._done.asObservable(); }

  /** 当任意状态发生变更时触发，用于发送通知更新 UI */
  readonly stateChange = new Subject();

  constructor(private handler: UploadHandler) { }

  ngOnDestroy() {
    this._done.complete();
    this.destroy.next();
    this.destroy.complete();
  }

  upload(requests: UploadRequest[]) {
    for (const request of requests) {
      const job = new UploadJob(request);
      job.subscription = this._subscribeUploadJob(job);
      this.waitingJobs.push(job);
    }
    this._executeNextJobs();
    this.stateChange.next();
  }

  cancel(job: UploadJob) {
    if (job.subscription && !job.subscription.closed) {
      job.subscription.unsubscribe();
    }

    let target;
    switch (job.status) {
      case UploadStatus.BEGIN:
        target = this.waitingJobs;
        break;
      case UploadStatus.SENDING:
        target = this.workingJobs;
        break;
      case UploadStatus.SUCCESS:
      case UploadStatus.ERROR:
        target = this.completedJobs;
        break;
    }
    target.splice(target.indexOf(job), 1);
    this._executeNextJobs();
  }

  cancelAll() {
    this.completedJobs = [];
    this.workingJobs.forEach(item => item.subscription.unsubscribe());
    this.workingJobs = [];
    this.waitingJobs = [];
    this.change.next();
  }

  private success(task: UploadJob, result: any) {
    task.data = result.data;
    task.status = UploadStatus.SUCCESS;
    this._complete(task);
  }
  private error(task: UploadJob, error: any) {
    task.status = UploadStatus.ERROR;

    if (error?.error?.code) {
      task.error = error?.error?.message || error?.error?.code;
    } else {
      task.error = '上传失败';
    }

    this._complete(task);
  }

  private _complete(task: UploadJob) {
    const index = this.workingJobs.indexOf(task);
    this.completedJobs.push(...this.workingJobs.splice(index, 1));
    if (task.status === UploadStatus.SUCCESS) {
      this._done.next(task.data);
    }
    this._executeNextJobs();
  }

  private _executeNextJobs() {
    if (this.workingJobs.length < 5) {
      const count = 5 - this.workingJobs.length;
      this.workingJobs.push(...this.waitingJobs.splice(0, count));
    }
    this.change.next();
  }

  private _subscribeUploadJob (job: UploadJob) {
    return this.change.pipe(
      filter(() => this.workingJobs.includes(job)),
      take(1),
      switchMap(() => this.handler.upload(job.request.url, job)),
      takeUntil(this.destroy)
    ).subscribe(
      result => this.success(job, result),
      error => this.error(job, error),
    );
  }
}
