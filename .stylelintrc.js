module.exports = {
  /** 基本推荐规则继承，继承社区推荐的规则 */
  extends: [
    // stylelint Possible errors 配置
    'stylelint-config-recommended'
  ],

  /**
   * Stylelint 规则
   * 注：因为很多插件的规则中存在特殊符号，因此 rules 下面的所有 key 用单引号来声明
   */
  rules: {

    // 小数点值前面是否必须用 0
    'number-leading-zero': null,

    // 嵌套样式最大层级
    'max-nesting-depth': 5,

    // 屏蔽 id 选择器的引用检查，因为这会在样式文件分离的场景下误报错误
    'selector-max-id': 2,

    // 6位16进制
    "color-hex-length": "long",
    // 小写
    "color-hex-case": "lower",
    // 允许使用的单位
    "unit-allowed-list": ["em", "rem", "%", "vh", "vw", "px", "s", "deg"],

    "property-no-unknown":  [
      true,
      {
        "ignoreProperties": [
          'primary', 'normal', 'success', 'warning', 'error'
        ]
      }
    ],
    "selector-type-no-unknown": [
      true,
      {
        "ignoreTypes": [
          '/^nz-/',
          '/^cdk-/',
          'fa-icon'
        ]
      }
    ]
  }
};
