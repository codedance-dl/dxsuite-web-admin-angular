import { Injectable } from '@angular/core';

import { DataService } from './data-service';

export interface IMailConfiguration {
  id?: string;
  name: string;
  connectionTimeout: number;
  host: number;
  password: string;
  port: number;
  protocol: string;
  readTimeout: number;
  senderName: string;
  startTlsEnabled: boolean;
  startTlsRequired: boolean;
  username: string;
  writeTimeout: number;
  revision?: number;
}

@Injectable({ providedIn: 'root' })
export class MailConfigurationService extends DataService {

  getConfig(query?: {
    name?: string;
    pageNo?: number;
    pageSize?: number;
    sortBy?: string[];
    username?: string;
  }) {
    return this.http.get(`/mail-configurations` + this.queryParse(query));
  }

  create(body: Partial<IMailConfiguration>) {
    return this.http.post(`/mail-configurations`, body);
  }

  setAsDefault(configurationId: string, query?: {
    revision: string;
  } ) {
    return this.http.post(`/mail-configurations/${configurationId}/set-as-default` + this.queryParse(query), {});
  }

  update(configurationId: string, revision: number, body: Partial<IMailConfiguration>) {
    return this.http.patch(`/mail-configurations/${configurationId}` + this.queryParse({ revision }), body);
  }

}
