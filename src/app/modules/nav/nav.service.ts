import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { NzI18nService } from "ng-zorro-antd/i18n";
import { NzMessageService } from "ng-zorro-antd/message";
import { NzModalService } from "ng-zorro-antd/modal";

@Injectable()
export class NavService {
  constructor(
    public notifier: NzMessageService,
    public modal: NzModalService,
    public translate: TranslateService,
    public i18n: NzI18nService,
  ) {}
}
