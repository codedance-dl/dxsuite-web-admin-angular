

import { PasswordStrengthStats, strengthLevels } from '@api/models';

/* eslint-disable @typescript-eslint/no-explicit-any */
function arrayFormatObject(key: string, array: any[]) {
  const obj = {};
  for (const item of array) {
    obj[item.id] = item[key];
  }
  return obj;
}

function passwordIsValid(stats: PasswordStrengthStats) {
  return stats.symbolCount + stats.numberCount + stats.upperCaseCharCount + stats.lowerCaseCharCount
    >= 8
    && stats.upperCaseCharCount > 0
    && stats.lowerCaseCharCount > 0;
}

function getStrengthLength(password:string,stats: PasswordStrengthStats): { level: number; text: string; empty: number } {
  if (!password) { return { level: 0, text: '', empty: 100 }; }
  return strengthLevels.find(levelItem => levelItem.level === stats.strengthLevel);
}

export { arrayFormatObject, passwordIsValid, getStrengthLength };