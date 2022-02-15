import { Injectable } from '@angular/core';

import { DataService } from './data-service';

@Injectable({ providedIn: 'root' })
export class ParametersService extends DataService {

  // 取得所有应用业务参数
  getAllParameters() {
    return this.http.get('/parameters');
  }

  // 获取特定参数设置详情
  getParameter(parameterName: string) {
    return this.http.get(`/parameters/${parameterName}`);
  }

  // 设置参数详情
  setParameter(parameterName: string, body : {
    description: string;
    value: string;
  }, revision?: string){
    return this.http.put(`/parameters/${parameterName}` + this.queryParse({ revision }), body);
  }

  // 删除业务参数
  deleteParameter(parameterName: string, revision?: string ) {
    return this.http.delete(`/parameters/${parameterName}` + this.queryParse({ revision }), {});
  }

}
