import * as moment from 'moment';
import { NzI18nService } from 'ng-zorro-antd/i18n';

import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AntLanguageMap } from '../assets/i18n';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  isCollapsed = false;

  title: string | undefined;

  langMap = AntLanguageMap;

  constructor(
    public translateService: TranslateService,
    private i18n: NzI18nService
  ) {
    const lang = localStorage.getItem('language') || 'zh-cn';
    this.i18n.setLocale(this.langMap[lang]);
    moment.locale(lang);
  }

  ngOnInit() {
    this.translateService.addLangs(['zh', 'en', 'jp']);
    const browserLang = localStorage.getItem('language') || 'zh-cn';
    this.translateService.use(browserLang);
  }

}