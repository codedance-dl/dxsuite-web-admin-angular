import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

// eslint-disable-next-line max-len
const secondRegex = /(^(\*)$|^(\d|[1-5]\d)$|^((\d|[1-5]\d)|\*)(\-|\/){1}(\d|[1-5]\d)$|^((\d|[1-5]\d)\,)*(\d|[1-5]\d)$)/;
// eslint-disable-next-line max-len
const hourRegex = /(^(\*)$|^(\d|1\d|2[0-3])$|^((\d|1\d|2[0-3])|\*)(\-|\/){1}(\d|1\d|2[0-3])$|^((\d|1\d|2[0-3])\,)*(\d|1\d|2[0-3])$)/;
// eslint-disable-next-line max-len
const dayRegex = /(^(\*)$|^(\d|[12]\d|3[01])$|^(((\d|[12]\d|3[01])|\*)(\-|\/){1}(\d|[12]\d|3[01]))$|^((\d|[12]\d|3[01])\,)*((\d|[12]\d|3[01]))$|^(\?)$)/;
const monthRegex = /(^(\*)$|^(\d|1[0-1])$|^((\d|1[0-1])|\*)(\-|\/){1}(\d|1[0-1])$|^((\d|1[0-1])\,)*(\d|1[0-1])$)/;
const weekRegex = /(^(\*)$|^[0-6]$|^(([0-6]|\*)(\-|\/){1}[0-6])$|^([0-6]\,)*([0-6])$|^(\?)$)/;
const regexMap = {
  seconds: secondRegex,
  minutes: secondRegex,
  hours: hourRegex,
  dayOfMonth: dayRegex,
  months: monthRegex,
  dayOfWeek: weekRegex
};

export const cronExecuteRuleValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const controls = Object.keys(control.controls);
  const result = {};
  controls.forEach((ctrl) => control.controls[ctrl].value && !control.controls[ctrl].value.match(regexMap[ctrl]) && (result[ctrl] = true));
  return result;
};
