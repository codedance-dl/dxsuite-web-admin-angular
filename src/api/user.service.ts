import { Injectable } from '@angular/core';
import { UserUpdate } from '@api/models';

import { DataService } from './data-service';
import { BaseQuery } from './models';

export interface IUsers {
  name: string;
  birthDate?: string;
  email?: string;
  emailVerificationCode?: string;
  gender?: 'FEMALE' | 'MALE';
  mobile?: string;
  password: string;
  sendSMS?: boolean;
  smsVerificationCode?: string;
  username?: string;
}

export interface CaptchaModel {
  captcha: {
    captchaData: string;
    encryptedData: string;
    text: string;
  };
}

@Injectable({ providedIn: 'root' })
export class UserService extends DataService {

  // 校验验证码
  validate(keyType: string, key: string, purpose: string, code: string) {
    return this.http.post(`/verifications/${keyType}/${key}/${purpose}/${code}/validate`, null);
  }

  /*
   ** 用户（查询）
   */
  // 查询用户
  getUsers(query?: BaseQuery) {
    return this.http.get(`/users` + this.queryParse(query));
  }

  // 取得用户基本信息
  userDetail(userId: string, query?: BaseQuery) {
    return this.http.get(`/users/${userId}` + this.queryParse(query));
  }

  // 取得用户所在公司
  userCompanies(userId: string, query?: BaseQuery & {
    approval: string;
    name: string;
  }) {
    return this.http.get(`/users/${userId}/companies` + this.queryParse(query));
  }

  // 通过旧密码设置新密码
  updatePassword(userId: string, data: {
    newPassword: string;
    oldPassword?: string;
  }) {
    return this.http.put(`/users/${userId}/password`, data);
  }

  // 通过旧密码设置新密码（管理员权限，可以修改别人密码）
  superUpdatePassword(userId: string, data: {
    newPassword: string;
    oldPassword?: string;
  }) {
    return this.http.put(`/superusers/${userId}/password`, data);
  }

  // 通过电子邮件验证码或手机号码验证码重置登录密码
  resetPassword(userId: string, data: {
    emailVerificationCode?: string;
    password?: string;
    smsVerificationCode?: string;
  }) {
    return this.http.post(`/users/${userId}/reset-password`, data);
  }

  // 评估密码复杂度
  evaluatePassword(password: string) {
    return this.http.post('/evaluate-password', { password });
  }

  /*
   ** 用户注册
   */
  register(data: IUsers) {
    return this.http.post(`/users`, data);
  }

  /**
   * 公司创建用户
   */
  create(companyId: string, data: IUsers) {
    return this.http.post(`/companies/${companyId}/users`, data);
  }

  // 邀请一个用户加入加入公司
  joinCompany(companyId: string, userId: string) {
    return this.http.patch(`/companies/${companyId}/employee/${userId}`);
  }

  // 更新用户基本信息
  modifyOneUser(userId: string, revision: number, data: UserUpdate) {
    return this.http.patch(`/users/${userId}` + this.queryParse({ revision }), data);
  }

  /*
   ** 认证凭证（命令）
   */
  // 新建电子邮箱地址登录凭证
  emails(userId: string, data: {
    email: string;
    emailVerificationCode: string;
  }) {
    return this.http.post(`/users/${userId}/emails`, data);
  }

  // 删除电子邮箱地址登录凭证（电子邮箱解绑）
  deleteEmail(userId: string, data: {
    email: string;
    emailVerificationCode: string;
  }) {
    return this.http.delete(`/users/${userId}/emails`, {
      body: data
    });
  }

  // 新建手机号码登录凭证
  mobiles(userId: string, data: {
    mobile: string;
    smsVerificationCode: string;
  }) {
    return this.http.post(`/users/${userId}/mobiles`, data);
  }

  // 删除手机号码登录凭证（手机号解绑）
  deleteMobile(userId: string, data: {
    mobile: string;
    smsVerificationCode: string;
  }) {
    return this.http.delete(`/users/${userId}/mobiles`, {
      body: data
    });
  }

  // 设置登录用户名
  username(userId: string, data: {
    username: string;
  }) {
    return this.http.put(`/users/${userId}/username`, data);
  }

  // 检查认证凭证是否可用于注册
  available(credential: string) {
    return this.http.get(`/user-credentials/${credential}/available`);
  }

  reset(credential: string, data: {
    emailVerificationCode?: string;
    password?: string;
    smsVerificationCode?: string;
  }) {
    return this.http.post(`/users/${credential}/reset-password`, data);
  }

  getByUserId(userId: string, studentId: string, courseId: string) {
    return this.http.get(`/users/${userId}/course-registration` + this.queryParse({ studentId, courseId }));
  }

  // 注册用户
  userRegister(data: IUsers) {
    return this.http.post('/users', data);
  }

  me() {
    return this.http.get(`/user`);
  }

  // 导出用户列表
  exportUsers(data: CaptchaModel, query?: BaseQuery) {
    return this.http.post(`/users/export`+ this.queryParse(query), data, {
      responseType: 'blob'
    });
  }
}

