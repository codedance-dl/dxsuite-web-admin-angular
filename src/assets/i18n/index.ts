import { en_GB, ja_JP, zh_CN } from 'ng-zorro-antd/i18n';

// import en from '@angular/common/locales/en';
// import zh from '@angular/common/locales/zh';
// import ja from '@angular/common/locales/ja';

export const AntLanguageMap = {
  'zh-cn': zh_CN,
  'en-gb': en_GB,
  'ja-jp': ja_JP,
};

export const LanguageNameMap = {
  'zh-cn': '简体中文',
  'en-gb': 'English',
  'ja-jp': '日本語'
};

export const LanguageMap = {
  'zh': '简体中文',
  'en': 'English',
  'ja': '日本語'
};

export const DefaultLanguage = 'zh-cn';

/**
 * numberFormatsOptions
 * style?: 'decimal' | 'currency' | 'percent'   样式
 * currency?: string, // ISO 4217 currency code   货币
 * currencyDisplay?: 'symbol' | 'code' | 'name'   货币显示
 * useGrouping?: boolean   使用分组
 * minimumIntegerDigits?: number   最小整数位数
 * minimumFractionDigits?: number   最小分数位数
 * maximumFractionDigits?: number   最大分数位数
 * minimumSignificantDigits?: number   最低有效位数
 * maximumSignificantDigits?: number   最大有效位数
 * localeMatcher?: 'lookup' | 'best fit'   语言环境匹配
 * formatMatcher?: 'basic' | 'best fit   格式匹配
 * 使用方式: {{ $n(100, 'currency') }}
 */
const numberFormats = {
  'zh-cn': {
    currency: {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 2
    }
  },
  'ja-jp': {
    currency: {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 2
    }
  },
  'en-gb': {
    currency: {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }
  }
};

const datetimeFormats = {
  'zh-cn': {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    },
    long: {
      year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric',second: 'numeric', hour12: false
    }
  },
  'ja-jp': {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    }
  },
  'en-gb': {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    },
    long: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    }
  }
};

//注册i8n实例并引入语言文件

// export const i18n = createI18n({
//   numberFormats,
//   datetimeFormats,
//   locale: localStorage.getItem('language') || DefaultLanguage,		//默认显示的语言
//   fallbackLocale: DefaultLanguage, // 缺省时默认语言
//   messages: {
//     'zh-cn': zh,
//     'ja-jp': ja,
//     'en-gb': en
//   },
// });