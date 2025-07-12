import { ReplyType } from '@/types/CommunityTypes';

/**
 * 댓글을 최신순으로 정렬하는 함수
 * @param comments 정렬할 댓글 배열
 * @returns 최신순으로 정렬된 댓글 배열
 */
export function sortCommentsByLatest(comments: ReplyType[]): ReplyType[] {
  return [...comments].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA; // 내림차순 (최신순)
  });
}
