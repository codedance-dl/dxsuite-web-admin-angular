export const strengthLevels = [
  { text: '高', level: 4, empty: 0 },
  { text: '高', level: 3, empty: 0 },
  { text: '中', level: 2, empty: 30 },
  { text: '低', level: 1, empty: 70 },
  { text: '低', level: 0, empty: 70 }
];


export interface PasswordStrengthStats {
  upperCaseCharCount: number;
  lowerCaseCharCount: number;
  numberCount: number;
  symbolCount: number;
  strengthLevel: number;
}