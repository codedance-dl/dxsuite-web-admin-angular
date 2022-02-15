export interface MessageModel {
  id: string;
  bizType: string;
  content: string;
  contentType: string;
  expiresAt: string;
  isRead: boolean;
  readAt: string;
  receiverId: string;
  senderId: string;
  senderType: string;
  targetId: string;
  targetType: string;
  title: string;
  createdAt: string;
  createdBy: string;
}

export const IS_READ_LIST = [
  { value: 'true', text: '已读' },
  { value: 'false', text: '未读' },
];

export enum MessageStatus {
  true = 'true',
  false = 'false'
}

export const MessageStatusMap = {
  true: '已读',
  false: '未读'
};

export const MessageStatusColorMap = {
  true: 'success',
  false: 'alert'
};
