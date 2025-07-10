import { UserInfoType } from './UserTypes';

export interface ReplyType {
  boardType: 'FUNDING' | 'PIECE';
  boardUuid: string;
  createdAt: string;
  memberUuid: string;
  mine: boolean;
  replyContent: string;
  replyUuid: string;
  childReplies?: ReplyType[];
  deleted?: boolean;
}

export interface ReplyListItemType {
  replyUuid: string;
  deleted: boolean;
}
