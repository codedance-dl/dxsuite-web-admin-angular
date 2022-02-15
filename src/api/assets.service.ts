import { Injectable } from '@angular/core';
import { DataService } from './data-service';
import { BaseQuery } from '@api/models';

@Injectable({ providedIn: 'root' })
export class AssetsService extends DataService {

  getAll(orgId: string, query?: BaseQuery) {
    return this.http.get(`/tenants/${orgId}/assets` + this.queryParse(query));
  }

  downloadTemplate(orgId: string) {
    return this.http.request<Blob>('GET', `/tenants/${orgId}/assets-template`, {
      responseType: 'blob'
    });
  }

  importAssets(orgId: string, data: FormData) {
    return this.http.post(`/tenants/${orgId}/import-assets`, data);
  }
}
