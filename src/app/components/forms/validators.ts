/* eslint-disable */
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * 验证是否于目标控件的值相同
 * @param equalControl 比较的目标控件
 * @param equalLabel 目标控件的字段名，可选
 */
export function equalTo (equalControl: AbstractControl, equalLabel: string): ValidatorFn {
  let subscribe: Subscription;

  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!subscribe) {
      subscribe = equalControl.valueChanges
        .pipe(filter(() => control.touched))
        .subscribe(() => {
          control.updateValueAndValidity();
        });
    }

    const controlValue = control.value;
    return equalControl.value == controlValue ? null : { equalTo: true, equalLabel };
  };
}

/**
 * 验证是否于目标控件的值不相同，与 equalTo 相反
 * @param equalControl 比较的目标控件
 * @param unequalLabel 目标控件的字段名，可选
 */
export function unequalTo (equalControl: AbstractControl, unequalLabel?: string): ValidatorFn {
  let subscribe: Subscription;
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!subscribe) {
      subscribe = equalControl.valueChanges
        .pipe(filter(() => control.touched))
        .subscribe(() => {
          control.updateValueAndValidity();
        });
    }

    const controlValue: string = control.value;

    return equalControl.value !== controlValue ? null : { unequalTo: true, unequalLabel };
  };
}

export function interval (intervalLabel?: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      const controlValue: string = control.value.split(/(\(|\)|\[|\]|,)/g);
      return Number(controlValue[2]) < Number(controlValue[4]) ? null : { intervalTo: true, intervalLabel };
    }
    return null;
  };
}

/**
 * 验证控件是否小于目标控件的值
 * @param withControl 比较的目标控件
 * @param ltLabel 目标控件的字段名，可选
 */
export function ltTo (withControl: AbstractControl, ltLabel?: string): ValidatorFn {
  let subscribe: Subscription;
  return (control: AbstractControl): { [key: string]: any } | null => {

    if (!subscribe) {
      subscribe = withControl.valueChanges
        .pipe(filter(() => control.touched))
        .subscribe(() => {
          control.updateValueAndValidity();
        });
    }

    const controlValue: string = control.value;

    if (withControl.value) {
      return Number(controlValue) < Number(withControl.value) ? null : { ltTo: true, ltLabel };
    }
    return null;
  };
}