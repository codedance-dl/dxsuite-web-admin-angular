export const MOBILE_REGEXP = /(^1[3456789]\d{9}$)/;

//供应商编号整数
export const SUPPLIER_CODE = /^\d{6}$/;

export const PASSWORD_STRENGTH = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,}$/;

export const ACCOUNT_REGEXP = /^((1[3456789]\d{9})|(\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}))$/;
