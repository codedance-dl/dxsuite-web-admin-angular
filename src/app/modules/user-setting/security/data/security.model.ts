export interface CredentialsModel {
  id: string;
  userId: string;
  credential: string;
  type: 'USERNAME' | 'EMAIL' | 'MOBILE' | 'WECHAT';
  revision: number;
}
