import { NzFormControlComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { filter } from 'rxjs/operators';

/* eslint-disable */
import {
  AfterContentInit,
  ChangeDetectorRef,
  ContentChild,
  Directive,
  ElementRef,
  Input,
  Optional
} from '@angular/core';
import {
  FormControlDirective,
  FormControlName,
  FormGroupDirective,
  NgControl,
  NgForm
} from '@angular/forms';

export const DEFAULT_TEMPLATES = {
  required: '请输入{0}',
  email: '{0}不是邮箱格式',
  min: '{0}必须输入大于{1}的数字',
  max: '{0}必须输入小于{1}的数字',
  pattern: '{0}不是合法的数据',
  maxlength: '{0}长度为最大{1}',
  minlength: '{0}长度为最小{1}',
  equalTo: '两次输入不一致',
  unequalTo: '{0}必须和{1}不相同',
};


@Directive({
  selector: '[autoErrorTip]',
})
export class AutoErrorTipDirective implements AfterContentInit {

  @ContentChild(NgControl, { static: false }) ngControl: FormControlName | FormControlDirective;
  @ContentChild(NzFormLabelComponent, { static: false, read: ElementRef }) nzFormLabel: ElementRef;
  @ContentChild(NzFormControlComponent, { static: false }) nzFormControl: NzFormControlComponent;

  @Input() messages: {[key: string]: string};

  private _ngForm: NgForm | FormGroupDirective | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective,
  ) {
    this._ngForm = parentForm || parentFormGroup;
  }

  ngAfterContentInit() {
    // 验证
    if (this.nzFormControl && this.ngControl && this._ngForm) {
      this.ngControl.statusChanges.pipe(filter(status => status === 'INVALID')).subscribe(() => this._validate());
      this._ngForm.ngSubmit.subscribe(() => { this._validate();})
    }
  }

  protected _format(template: string, ...args: any[]) {
    return template.replace(/\{(\d+)\}/g, (match: any, num: number) =>  typeof args[num] !== 'undefined' ? args[num] : match);
  }

  private _validate() {

    const label = this.nzFormLabel.nativeElement.innerText;
    const errors = this.ngControl.errors || {};
    const templates = { ...DEFAULT_TEMPLATES, ...this.messages };

    let nzErrorTip = '';
    if (errors.hasOwnProperty('required')) {
      nzErrorTip = this._format(templates['required'], label);
    } else if (errors.hasOwnProperty('email')) {
      nzErrorTip = this._format(templates['email'], label);
    } else if (errors.hasOwnProperty('min')) {
      nzErrorTip = this._format(templates['min'], label, errors.min.min);
    } else if (errors.hasOwnProperty('max')) {
      nzErrorTip = this._format(templates['max'], label, errors.max.max);
    } else if (errors.hasOwnProperty('minlength')) {
      nzErrorTip = this._format(templates['minlength'], label, errors.minlength.requiredLength);
    } else if (errors.hasOwnProperty('maxlength')) {
      nzErrorTip = this._format(templates['maxlength'], label, errors.maxlength.requiredLength);
    } else if (errors.hasOwnProperty('pattern')) {
      nzErrorTip = this._format(templates['pattern'], label);
    } else if (errors.hasOwnProperty('equalTo')) {
      nzErrorTip = this._format(templates['equalTo'], label, errors.equalLabel);
    } else if (errors.hasOwnProperty('unequalTo')) {
      nzErrorTip = this._format(templates['unequalTo'], label, errors.unequalLabel);
    }
    // 展示信息
    this.nzFormControl.nzErrorTip = nzErrorTip;
    this.ngControl.control.markAsDirty();
    this.nzFormControl.nzValidateStatus = this.ngControl.control;
    this.cdr.markForCheck();
  }
}
