import { Injectable } from '@angular/core';

import { DataService } from './data-service';

@Injectable({ providedIn: 'root' })
export class NotificationTemplateService extends DataService {

  getAll(query?: {
    name?: string;
    disabled?: boolean;
    pageNo?: number;
    pageSize?: number;
    sortBy?: [string];
  }) {
    return this.http.get(`/notification-templates` + this.queryParse(query));
  }

  getOne(templateId: string, languageCode?: string) {
    return this.http.get(`/notification-templates/${templateId}${languageCode ? '/languages/' + languageCode : ''}`);
  }

  checkUp(templateId: string, disabled?: boolean) {
    return this.http.get(`/notification-templates/${templateId}/exists` + this.queryParse({ disabled }));
  }

  create(body: {
    name: string;
    description?: string;
    configurationId?: string;
    tagList?: string[];
    contents?: [{
      content?: string;
      contentType?: string;
      languageCode?: string;
      subject?: string;
    }];
  }) {
    return this.http.post(`/notification-templates`, body);
  }

  update(templateId: string, query: {
    revision: string;
  }, body: {
    name?: string;
    description?: string;
    configurationId?: string;
    tagList?: string[];
    contents?: [{
      content?: string;
      contentType?: string;
      languageCode?: string;
      subject?: string;
    }];
  }) {
    return this.http.patch(`/notification-templates/${templateId}` + this.queryParse(query), body);
  }

  delete(templateId: string, query: {
    revision: string;
  }) {
    return this.http.delete(`/notification-templates/${templateId}` + this.queryParse(query));
  }

  disable(templateId: string, query: {
    revision: string;
  }) {
    return this.http.post(`/notification-templates/${templateId}/disable` + this.queryParse(query), {});
  }

  enable(templateId: string, query: {
    revision: string;
  }) {
    return this.http.post(`/notification-templates/${templateId}/enable` + this.queryParse(query), {});
  }

}
