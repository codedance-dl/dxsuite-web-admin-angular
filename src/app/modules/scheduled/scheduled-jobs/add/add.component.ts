import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CronService } from '@api/cron.service';
import { SetScheduleJobBody } from '@api/models';
import { Store } from '@ngxs/store';

import { cronExecuteRuleValidator } from './execute-rule.directive';

@Component({
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})

export class ScheduledAddComponent implements OnInit,OnDestroy {

  loading = false;

  // 业务列表
  jobs = [];

  // 数据版本
  revision: number;

  form: FormGroup;

  dayOfMonth = new FormControl('', Validators.required);

  dayOfWeek = new FormControl('?', Validators.required);

  private destroy = new Subject();

  constructor(
    private message: NzMessageService,
    private formBuilder: FormBuilder,
    private store: Store,
    private modal: NzModalRef,
    private cronService: CronService
  ) {

    this.form = this.formBuilder.group({
      scheduledJobId: ['', Validators.required],
      executeRule: this.formBuilder.group({
        seconds: [null, Validators.required],
        minutes: [null, Validators.required],
        hours: [null, Validators.required],
        dayOfMonth: this.dayOfMonth,
        months: [null, Validators.required],
        dayOfWeek: this.dayOfWeek
      }, { validators: cronExecuteRuleValidator }),
      scheduleTime: [[Date()], [Validators.required]],
      scheduleStartTime: [null],
      scheduleEndTime: [null],
      parametersJSON: ['']
    });

  }

  ngOnInit() {
    this.getSchedules();
  }

  /**
   * 获取所有业务任务
   */
  getSchedules() {

    const params = {
      requireTenantId: false
    };
    this.cronService.getScheduledJobs(params).subscribe(
      response => {
        if (response.success) {
          this.jobs = response.data;
        } else {
          this.message.create('error', `获取业务列表失败，${response.error.message}`);
        }
      },
      error => {
        this.message.create('error', `获取业务列表失败，${error.message || error.error.message}`);
      }
    );
  }

  getErrorStatus(control) {
    return this.form.controls.executeRule.errors && this.form.controls.executeRule.errors[control];
  }

  getErrorMessage() {
    if (this.form.controls.executeRule.errors) {
      if (this.form.controls.executeRule.errors.seconds) {
        return `Seconds(秒):用数字0－59表示（允许的特殊字符： , - * / ），请检查后重新输入`;
      }
      if (this.form.controls.executeRule.errors.minutes) {
        return `Minutes(分):用数字0－59表示（允许的特殊字符： , - * / ），请检查后重新输入`;
      }
      if (this.form.controls.executeRule.errors.hours) {
        return `Hours(时):用数字0－23表示（允许的特殊字符： , - * / ），请检查后重新输入`;
      }
      if (this.form.controls.executeRule.errors.dayOfMonth) {
        return `DayOfMonth(日):用数字1-31表示（允许的特殊字符： , - * / ？），请检查后重新输入`;
      }
      if (this.form.controls.executeRule.errors.months) {
        return `Months(月):用数字0－11表示，其中0代表1月（允许的特殊字符： , - * / ），请检查后重新输入`;
      }
      if (this.form.controls.executeRule.errors.dayOfWeek) {
        return `DayOfWeek(周):用数字0－6表示，其中0代表星期日（允许的特殊字符： , - * / ？），请检查后重新输入`;
      }
    }
  }

  /**
   * 不能选择今天之前的日期
   * @param startValue
   * @returns
   */
  disabledDate = (startValue: Date): boolean => {
    return startValue.getTime() < new Date().getTime() - 86400000;
  };

  /**
   * 日期选择框内容变化
   * @param event
   */
  onDateChange(event: Event) {
    this.form.patchValue({
      scheduleStartTime: event[0],
      scheduleEndTime: event[1]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const value = this.form.value;

    // eslint-disable-next-line max-len
    const cronExpression = `${value.executeRule.seconds} ${value.executeRule.minutes} ${value.executeRule.hours} ${value.executeRule.dayOfMonth} ${value.executeRule.months} ${value.executeRule.dayOfWeek}`;

    const body: SetScheduleJobBody = {
      cronExpression,
      maxConcurrentJobs: 1,
      maxExecutions: 0,
      scheduleStartTime: value.scheduleStartTime
    };
    if (value.scheduleEndTime) {
      body.scheduleEndTime = value.scheduleEndTime;
    }
    if (value.parametersJSON) {
      body.parametersJSON = value.parametersJSON;
    }

    this.cronService.setScheduledJob(value.scheduledJobId, this.revision, body).subscribe(
      response => {
        if (response.success) {
          this.message.create('success', '任务配置成功');
        } else {
          this.message.create('error', `配置任务失败，${response.error.message}`);
        }
        this.loading = false;
        this.modal.destroy(true);
      },
      error => {
        this.loading = false;
        this.message.create('error', `配置任务失败，${error.error.message || error.message}`);
      }
    );
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

}
