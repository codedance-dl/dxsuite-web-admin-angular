import { of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

import { DataService } from './data-service';
import { BaseQuery, User } from './models';

export interface IAuthorizations{
  username: string;
  captcha?: string;
  emailVerificationCode?: string;
  password?: string;
  smsVerificationCode?: string;
}

export interface IVerifications {
  captcha: {
    encryptedData?: string;
    imageData?: string;
    validUntil?: number;
  };
  keyType?: string;
  key?: string;
  purpose: string;
}

export interface CredentialQuery {
  pageNo?: number;
  pageSize?: number;
  sortBy?: [string];
  type?: 'USERNAME' | 'EMAIL' | 'MOBILE';
}


@Injectable({ providedIn: 'root' })
export class UserAuthService extends DataService {

  // 取得用户信息
  getUser() {
    let user: User;
    return this.http.get(`/user`).pipe(
      switchMap(({ data }) => {
        user = data;
        return this.http.get(`/users/${data.id}/password`);
      }),
      switchMap(({ data }) => {
        const { expired, initial } = data;
        user.passwordStatus = { expired, initial };
        return this.http.get(`/user/invitations` + this.queryParse({
          approval: 'PENDING'
        }));
      }),
      switchMap(({ data }) => {

        const invitation = data.find(item => item.tenant.id === environment.orgId);

        if (invitation) {
          return this.http.post(`/tenants/${invitation.tenant.id}/employee-invitations/${invitation.id}/accept`, {
            code: invitation.invitationCode
          }).pipe(
            switchMap(() => this.http.get(`/users/${user.id}/tenants`))
          );
        } else {
          return this.http.get(`/users/${user.id}/tenants`);
        }
      }),
      switchMap(({ data }) => {
        const authorities = [];
        if (user.type === 'SUPER') {
          authorities.push('all');
          user.authorities = authorities;
          return of(user);
        }
        const company = data.find(item => item.tenant.id === environment.orgId && !item.deleted);
        if (company) {
          (company.privileges || []).forEach(item => {
            item.authorities.forEach(authority => {
              authorities.push(authority);
            });
          });
          user.authorities = authorities;
          user.roles = company.roles.map(role => ({ id: role.id }));
          return of(user);
        } else {
          return throwError({
            error: { message: '成员信息不存在' }
          });
        }
      }));
  }

  // 根据信息查询用户
  getUsers(query?: BaseQuery) {
    return this.http.get(`/users` + this.queryParse(query));
  }

  // 验证登录凭证，生成访问令牌
  signIn(data: IAuthorizations) {
    return this.http.post(`/authorizations`, data);
  }

  // 销毁访问令牌
  signOut(accessToken: string) {
    return this.http.delete(`/authorizations/${accessToken}`);
  }

  // 发送电子邮箱验证码或手机号验证短信
  sendVerification(data: IVerifications) {
    return this.http.post(`/verifications`, data);
  }

  // 获取人机验证凭证
  getCaptcha(query?: {
    credential: string;
  }) {
    return this.http.get(`/captcha` + this.queryParse(query));
  }

  // 校验人机验证识别结果
  validateCaptcha(data: {
    encryptedData: string;
    text: string;
  }) {
    return this.http.post(`/validate-captcha`, data);
  }

  // 查询用户的登录凭证
  getCredentials(userId: string, query?: CredentialQuery ) {
    return this.http.get(`/users/${userId}/credentials` + this.queryParse(query));
  }

  // 检查当前客户端是否需要进行人机验证
  captchaRequired(query: { credential: string; scope?: string }) {
    return this.http.get(`/captcha/required` + this.queryParse(query));
  }

  // 微信登录认证
  wechatAuthorization(code: string) {
    return this.http.post(`/wechat-authorizations`, { code });
  }

  // 微信绑定用户
  wechatCertificate(userId: string, code: string) {
    return this.http.post(`/users/${userId}/wechatIds`, { code });
  }
}
