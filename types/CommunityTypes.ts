<<<<<<< HEAD
=======
import { UserInfoType } from './UserTypes';

>>>>>>> feat/productsPage
export interface ReplyType {
  boardType: 'FUNDING' | 'PIECE';
  boardUuid: string;
  createdAt: string;
  memberUuid: string;
  mine: boolean;
  replyContent: string;
  replyUuid: string;
}
