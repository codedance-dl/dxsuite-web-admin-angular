import { en_US, ja_JP, NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { ApiInterceptor } from 'src/api/api.interceptor';
import { HTTP_HOST, HTTP_REVISION } from 'src/api/data-service';
import { environment } from 'src/environments/environment';

import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import en from '@angular/common/locales/en';
import ja from '@angular/common/locales/ja';
import zh from '@angular/common/locales/zh';
import locale from '@angular/common/locales/zh-Hans';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PrivilegeService } from '@store/security/privilege.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { AppStateModule } from './state';
import { SecurityModule } from './store';

registerLocaleData(locale);
registerLocaleData(en);
registerLocaleData(zh);
registerLocaleData(ja);
export function createTranslateHttpLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    AppStateModule,
    NzMessageModule,
    SecurityModule.forRoot(PrivilegeService),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateHttpLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: NZ_I18N,
      useFactory: (localId: string) => {
        switch (localId) {
          case 'en':
            return en_US;
          /** 与 angular.json i18n/locales 配置一致 **/
          case 'zh':
            return zh_CN;
          case 'ja':
            return ja_JP;
          default:
            return zh_CN;
        }
      },
      deps: [LOCALE_ID]
    },
    { provide: LOCALE_ID, useValue: locale[0] },
    { provide: HTTP_HOST, useValue: environment.host },
    { provide: HTTP_REVISION, useValue: environment.revision },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
