import * as moment from 'moment';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageModel, User } from '@api/models';
import { UIActions, UIState } from '@app/modules/nav/customization';
import { NAV_MENUS } from '@app/modules/nav/nav-token';
import { AntLanguageMap, LanguageNameMap } from '@assets/i18n';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { AuthState, ClearIdentity } from '@store/auth';
import { GUARD_HANDLER } from '@store/security';
import { PrivilegeService } from '@store/security/privilege.service';

import { MessageUnreadActions } from '../notification/message-unread/message-unread.actions';
import { MessageUnreadState } from '../notification/message-unread/message-unread.state';
import { NtNavMenu } from './libs/nav-menu';
import { NtNavigationAdapter } from './libs/nav-menu-adapter';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less']
})
export class AppNavComponent implements OnInit, OnDestroy {

  @Select(AuthState.getIdentity) user$: Observable<User>;

  @Select(UIState.isSidebarCollapsed) isCollapsed$: Observable<boolean>;

  @ViewChild('modalContent') modalContent: TemplateRef<null>;
  @ViewChild('modalFooter') modalFooter: TemplateRef<null>;

  title: string | undefined;

  messages$: Observable<MessageModel[]>;

  visible = false;

  languageMap = Object.keys(LanguageNameMap).map(key => ({key, 'value': LanguageNameMap[key]}));

  langMap = AntLanguageMap;

  lang = localStorage.getItem('language') || 'zh-cn';

  private storageChangeSubscription: Subscription;

  constructor(
    public navAdapter: NtNavigationAdapter,
    private router: Router,
    public store: Store,
    private notifier: NzMessageService,
    private modal: NzModalService,
    private translateService: TranslateService,
    private i18n: NzI18nService,
    @Inject(NAV_MENUS) public menus: NtNavMenu[],
    @Inject(GUARD_HANDLER) private privilegeService: PrivilegeService
  ) {
    this.store.dispatch(new MessageUnreadActions.GetAll());
    this.messages$ = this.store.select(MessageUnreadState.getUnreadByLimit(5));
    this.translateService.onLangChange.subscribe((params) => {
      this.store.dispatch(new UIActions.ChangeLanguage(params.lang));
    });
  }

  filter = menu => {
    return this.privilegeService.hasPrivilege(menu.roles);
  };

  openUserSetting() {
    this.router.navigate(['./', 'user-settings'], { replaceUrl: true });
  }

  signOut() {
    this.modal.confirm({
      nzTitle: '确定要退出系统吗？',
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.store.dispatch(new ClearIdentity());
        this.notifier.success('退出成功');
      },
      nzCancelText: '取消',
    });
  }

  open() {
    this.visible = true;
  }

  close() {
    this.visible = false;
  }

  collapsedChange(event) {
    this.store.dispatch(new UIActions.ChangeSidebarMode(event));
  }

  ngOnInit(): void {
    this.storageChangeSubscription = fromEvent<StorageEvent>(window, 'storage')
      .pipe(filter(e => e.key === 'token_time'), take(1))
      .subscribe(() => this.openAttention());
  }

  ngOnDestroy(): void {
    this.storageChangeSubscription.unsubscribe();
  }

  openAttention() {
    this.modal.create({
      nzTitle: '提示',
      nzClosable: false,
      nzMaskClosable: false,
      nzStyle: {
        width: '420px'
      },
      nzContent: this.modalContent,
      nzFooter: this.modalFooter
    });
  }

  modalFooterClose() {
    location.href = '/';
  }

  setLanguage(language: string) {
    this.lang = language;
    localStorage.setItem('language', language);
    // 切换本地页面语言

    this.translateService.use(language);
    this.store.dispatch(new UIActions.ChangeLanguage(language));
    // 切换组件语言
    this.i18n.setLocale(this.langMap[this.lang]);
    // 切换国家时间
    moment.locale(this.lang);
  }

  translateFn = (key: string) => {
    if (key) {
      this.translateService.get(key);
      console.log(key);
      console.log(this.translateService.get(key));
    }

  };
  // get(['common.message.success'])
}
