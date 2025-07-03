import { UserInfoType } from './UserTypes';

export interface ReplyType {
  boardType: 'FUNDING' | 'PIECE';
  boardUuid: string;
  createdAt: string;
  memberUuid: string;
  mine: boolean;
  replyContent: string;
  replyUuid: string;
}

export interface ReplyTypeWithPeople extends ReplyType {
  replyUserInfo: UserInfoType;
}
