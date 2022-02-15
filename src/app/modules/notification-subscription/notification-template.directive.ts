import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const notificationTemplateRequiredValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const config = control.get('config');
  const notificationTemplate = control.get('notificationTemplateId');
  return config
  && notificationTemplate
  && control.get('config').value !== 'onlyDisabled'
  && !notificationTemplate.value ? { requiredTemplate: true } : null;
};

export const subscriptionGroupRequiredValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const group = control.get('groupId');
  return group && !group.value ? { requiredGroupName: true } : null;
};
