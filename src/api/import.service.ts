import { Injectable } from '@angular/core';
import { DataService } from './data-service';

@Injectable({ providedIn: 'root' })
export class ImportService extends DataService {
  // 下载导入标准数据包模板
  downloadParamsTemplate(companyId: string) {
    return this.http.request('GET', `/companies/${companyId}/employees-template`, {
      responseType: 'blob'
    });
  }

  // 批量导入职员
  importEmployees(companyId: string, data: FormData) {
    return this.http.post(`/companies/${companyId}/import-employees`, data);
  }
}
