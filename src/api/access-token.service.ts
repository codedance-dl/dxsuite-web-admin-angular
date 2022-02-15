import { Injectable } from '@angular/core';

import { DataService } from './data-service';

import { Query } from '@api/models';

@Injectable({ providedIn: 'root' })
export class AccessTokenService extends DataService {

  // 查询用户访问令牌
  searchAccessTokens(userId: string, query?: Partial<Query>) {
    return this.http.get(`/users/${userId}/authorizations` + this.queryParse(query));
  }

  // 撤销用户的所有的访问令牌
  deleteAccessTokens(userId: string) {
    return this.http.delete(`/users/${userId}/authorizations`);
  }

  // 撤销用户的指定的访问令牌
  deleteOneAccessTokens(userId: string, accessTokenIDs: string) {
    return this.http.delete(`/users/${userId}/authorizations/${accessTokenIDs}`);
  }
}
