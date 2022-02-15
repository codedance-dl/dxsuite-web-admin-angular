import { Injectable } from '@angular/core';
import { DataService } from './data-service';

export interface ISmsConfiguration {
  name: string;
  password: string;
  provider: string;
  signName: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class SmsConfigurationService extends DataService {
  getConfig(query?: {
    name?: string;
    pageNo?: number;
    pageSize?: number;
    sortBy?: string[];
    username?: string;
  }) {
    return this.http.get(`/sms-configurations` + this.queryParse(query));
  }

  create(body: Partial<ISmsConfiguration>) {
    return this.http.post(`/sms-configurations`, body);
  }

  update(
    configurationId: string,
    revision: string,
    body: Partial<ISmsConfiguration>
  ) {
    return this.http.patch(
      `/sms-configurations/${configurationId}` +
        this.queryParse({ revision }),
      body
    );
  }

  setAsDefault(configurationId: string, query: {
    revision: string;
  }) {
    return this.http.post(
      `/sms-configurations/${configurationId}/set-as-default` +
        this.queryParse(query),
      {}
    );
  }
}
