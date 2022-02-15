import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

// eslint-disable-next-line max-len
const secondRegex = /(^(\*)$|^([0-9]|[1-5][0-9])$|^(([0-9]|[1-5][0-9])|\*)(\-|\/){1}([0-9]|[1-5][0-9])$|^(([0-9]|[1-5][0-9])\,)*([0-9]|[1-5][0-9])$)/;
// eslint-disable-next-line max-len
const hourRegex = /(^(\*)$|^([0-9]|1[0-9]|2[0-3])$|^(([0-9]|1[0-9]|2[0-3])|\*)(\-|\/){1}([0-9]|1[0-9]|2[0-3])$|^(([0-9]|1[0-9]|2[0-3])\,)*([0-9]|1[0-9]|2[0-3])$)/;
// eslint-disable-next-line max-len
const dayRegex = /(^(\*)$|^([0-9]|[12][0-9]|3[01])$|^((([0-9]|[12][0-9]|3[01])|\*)(\-|\/){1}([0-9]|[12][0-9]|3[01]))$|^(([0-9]|[12][0-9]|3[01])\,)*(([0-9]|[12][0-9]|3[01]))$|^(\?)$)/;
const monthRegex = /(^(\*)$|^([0-9]|1[0-1])$|^(([0-9]|1[0-1])|\*)(\-|\/){1}([0-9]|1[0-1])$|^(([0-9]|1[0-1])\,)*([0-9]|1[0-1])$)/;
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
