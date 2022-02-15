export const AssetsImportColumns = [
  { name: 'code', label: '资产编码'},
  { name: 'name', label: '资产名称'},
  { name: 'amount', label: '金额', optional: true},
  { name: 'specs', label: '规格型号', optional: true},
  { name: 'unit', label: '计量单位', optional: true},
  { name: 'purchaseDate', label: '购入时间', optional: true},
  { name: 'comment', label: '备注', optional: true},
  { name: 'sn', label: 'SN', optional: true},
  { name: 'validUntil', label: '使用期限', optional: true},
  { name: 'source', label: '来源', optional: true}
];

export const AssetsImportDisplayedColumnName = 'assetsImportColumns';
