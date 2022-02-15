import { User } from '@api/models/users';

export class FileEntry {
  id: string; //	字符串	实体 ID
  name: string; //	字符串	文件名称
  bizType: string; //	字符串	文件类型
  bucketName: string; //	字符串	Bucket 名
  expiredAt?: number; //	整数	过期时间
  isDirectory: boolean; //	布尔	是否为文件夹
  mimeType?: string; //	字符串	内容类型
  orgId: string; //	字符串	组织ID
  parentId: string; //	字符串	上级文件夹ID
  size?: number; //	整数	大小（字节）
  uniqueKey: string; //	字符串	唯一键
  uploadedAt: string; //	字符串	上传时间
  uploadedBy: User; //	字符串	上传者
  url: string; //	字符串	文件URL
  path: string; //	字符串	文件URL
}

export interface FilesQuery {
  name?: string;
  isDirectory?: boolean;
  sortBy?: string[] | string;
  keyword?: string;
  directory?: string;
}

export interface FilesSetOwnerData {
  ownerId: string;
  ownerType: string;
  permission: 'REVIEW' | 'DOWNLOAD' | 'UPLOAD' | 'UPLOAD_DOWNLOAD' | 'ADMINISTRATOR' | 'OWNER';
}

