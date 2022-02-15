module.exports = {
  root: true,
  overrides: [
    {
      files: [
        '*.ts'
      ],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        project: [
          "tsconfig.app.json",
        ],
        createDefaultProgram: true
      },
      plugins: ["@typescript-eslint"],
      rules: {
        // '@typescript-eslint/no-namespace': 'error',
        '@typescript-eslint/no-explicit-any': ['warn'],
        '@typescript-eslint/dot-notation': 'error', // 强制尽可能地使用点号
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/member-ordering': 'error', // 标准化类声明，类表达式，接口和类型文字的结构化和排序方式
        '@typescript-eslint/semi': 'error', // 强制使用一致的分号
        '@typescript-eslint/no-extra-semi': 'error', // 禁止不必要的分号
        '@typescript-eslint/no-inferrable-types': 'error', // 禁止声明显示类型
        '@typescript-eslint/member-delimiter-style': 'error', // 成员分隔符样式
        '@typescript-eslint/no-unused-expressions': ['error', {
          'allowShortCircuit': true,
          'allowTernary': true,
          'allowTaggedTemplates': true
        }],
        // '@typescript-eslint/naming-convention': 'error',
        '@typescript-eslint/no-empty-function': 'error',
        'no-extra-boolean-cast': 'error', // 禁止不必要的布尔类型转换
        'prefer-const': 'error', // 要求使用 const 声明那些声明后不再被修改的变量
        'no-empty': 'error', // 禁止出现空语句块
        'eqeqeq': 'error', // 要求使用 === 和 !==
        'object-shorthand': 'error', // 要求或禁止对象字面量中方法和属性使用简写语法
        'no-shadow': 'off',
        'prefer-arrow-callback': 'error', // 单行箭头函数
        'guard-for-in': 'error',
        'no-extra-parens': 'error',
        'no-underscore-dangle': ['error', { allowAfterThis: true, allowAfterSuper: true }],
      }
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {}
    }
  ]
};
