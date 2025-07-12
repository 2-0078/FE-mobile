'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ReplyType } from '@/types/CommunityTypes';
import { getMemberProfile } from '@/action/member-service';
import {
  createChildReply,
  updateReply,
  deleteReply,
  getChildReplies,
} from '@/action/reply-service';
import { useAlert } from '@/hooks/useAlert';
import { Button } from '@/components/ui/button';
import {
  Send,
  MessageCircle,
  Reply,
  Edit,
  Trash2,
  X,
  Check,
} from 'lucide-react';
import { ChildReplyItem } from '@/components/common/ChildReplyItem';

export function CommentItem({
  replyUuid,
  createdAt,
  memberUuid,
  mine,
  replyContent,
  childReplies = [],
  deleted = false,
  boardType,
  boardUuid,
}: ReplyType & {
  boardType?: 'FUNDING' | 'PIECE';
  boardUuid?: string;
}) {
  // 삭제된 댓글의 경우 childReplies를 빈 배열로 처리
  const effectiveChildReplies = deleted ? [] : childReplies;
  const [localChildReplies, setLocalChildReplies] = useState(
    effectiveChildReplies
  );
  const { data: session } = useSession();
  const router = useRouter();
  const [avatar, setAvatar] = useState<string>('/next.svg');
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChildReplies, setShowChildReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [childReplyContent, setChildReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(replyContent);
  const [isDeleting, setIsDeleting] = useState(false);
  const { success, error: showError } = useAlert();
  const [isPending, startTransition] = useTransition();

  // 로그인 상태 확인 및 로그인 페이지로 이동
  const checkLoginAndRedirect = () => {
    if (!session?.user) {
      showError('로그인이 필요합니다.');
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
      return false;
    }
    return true;
  };

  useEffect(() => {
    // 삭제된 댓글의 경우 아예 fetch하지 않음
    if (deleted) {
      setLoading(false);
      setUsername('알 수 없음');
      setAvatar('/next.svg');
      return;
    }

    const fetchMemberProfile = async () => {
      try {
        setLoading(true);
        const memberProfile = await getMemberProfile(memberUuid);
        setAvatar(memberProfile.profileImageUrl || '/next.svg');
        setUsername(memberProfile.nickname);
      } catch (error) {
        console.error('Failed to fetch member profile:', error);
        setUsername('사용자');
      } finally {
        setLoading(false);
      }
    };

    // 삭제되지 않은 댓글만 상세조회
    if (!deleted && memberUuid) {
      fetchMemberProfile();
    }
  }, [memberUuid, deleted]);

  // childReplies props가 변경될 때 local state 업데이트
  useEffect(() => {
    const newEffectiveChildReplies = deleted ? [] : childReplies;
    setLocalChildReplies(newEffectiveChildReplies);
  }, [childReplies, deleted]);

  // 대댓글 업데이트 콜백 함수
  const handleChildReplyUpdated = async () => {
    try {
      const updatedChildReplies = await getChildReplies(replyUuid);
      setLocalChildReplies(updatedChildReplies || []);
    } catch (error) {
      console.error('Failed to refresh child replies:', error);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 로그인 상태 확인
    if (!checkLoginAndRedirect()) {
      return;
    }

    if (!childReplyContent.trim()) {
      showError('대댓글 내용을 입력해주세요.');
      return;
    }

    if (childReplyContent.length > 500) {
      showError('대댓글은 500자 이내로 작성해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      if (!boardType || !boardUuid) {
        throw new Error('게시판 정보가 필요합니다.');
      }
      await createChildReply({
        parentReplyUuid: replyUuid,
        replyContent: childReplyContent.trim(),
        boardType,
        boardUuid,
      });

      setChildReplyContent('');
      setShowReplyForm(false);
      success('대댓글이 작성되었습니다.');

      // 대댓글 작성 후 해당 댓글의 대댓글 리스트만 다시 호출
      // 전체 댓글 목록 새로고침은 하지 않음 (무한반복 방지)
      startTransition(async () => {
        try {
          const updatedChildReplies = await getChildReplies(replyUuid);
          setLocalChildReplies(updatedChildReplies || []);
        } catch (error) {
          console.error('Failed to refresh child replies:', error);
        }
      });
    } catch (err) {
      console.error('Failed to create child reply:', err);
      showError('대댓글 작성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    // 로그인 상태 확인
    if (!checkLoginAndRedirect()) {
      return;
    }

    if (!editContent.trim()) {
      showError('댓글 내용을 입력해주세요.');
      return;
    }

    if (editContent.length > 500) {
      showError('댓글은 500자 이내로 작성해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      if (!boardType || !boardUuid) {
        throw new Error('게시판 정보가 필요합니다.');
      }
      await updateReply({
        replyUuid,
        replyContent: editContent.trim(),
        boardType,
        boardUuid,
      });

      setIsEditing(false);
      success('댓글이 수정되었습니다.');
      // 커스텀 이벤트를 발생시켜 댓글 목록을 새로고침
      startTransition(() => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('commentUpdated'));
        }
      });
    } catch (err) {
      console.error('Failed to update reply:', err);
      showError('댓글 수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    // 로그인 상태 확인
    if (!checkLoginAndRedirect()) {
      return;
    }

    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    setIsDeleting(true);
    try {
      if (!boardType || !boardUuid) {
        throw new Error('게시판 정보가 필요합니다.');
      }
      await deleteReply({
        replyUuid,
        boardType,
        boardUuid,
      });
      success('댓글이 삭제되었습니다.');
      // 커스텀 이벤트를 발생시켜 댓글 목록을 새로고침
      startTransition(() => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('commentUpdated'));
        }
      });
    } catch (err) {
      console.error('Failed to delete reply:', err);
      showError('댓글 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleChildReplies = () => {
    setShowChildReplies(!showChildReplies);
  };

  const startEdit = () => {
    setEditContent(replyContent);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditContent(replyContent);
    setIsEditing(false);
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return '방금 전';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}시간 전`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  return (
    <div className="border-b border-gray-700 last:border-b-0">
      {/* 부모 댓글 */}
      <div className="flex items-start gap-3 py-5">
        {deleted ? (
          // 삭제된 댓글은 간단한 표시
          <>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-600">
              <div className="w-9 h-9 bg-gray-600 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-xs text-gray-400">알수없음</p>
              </div>
              <div className="mb-2">
                <p className="text-gray-500 text-xs italic">
                  삭제된 댓글입니다
                </p>
              </div>
            </div>
          </>
        ) : (
          // 정상 댓글은 기존 UI 표시
          <>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-700">
              {loading ? (
                <div className="w-9 h-9 bg-gray-600 rounded-full animate-pulse" />
              ) : (
                <Image
                  src={avatar}
                  alt="avatar"
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                  onError={() => setAvatar('/next.svg')}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-sm text-white">
                  {loading ? '로딩 중...' : username}
                </p>
                {mine && (
                  <span className="px-2 py-0.5 text-xs bg-green-900 text-green-400 rounded-full font-medium">
                    나
                  </span>
                )}
              </div>

              {/* 댓글 내용 표시 */}
              {isEditing ? (
                <div className="mb-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-3 border border-gray-600 text-white text-sm rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-800 placeholder-gray-400"
                    rows={3}
                    maxLength={500}
                    disabled={submitting}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">
                      {editContent.length}/500
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEdit}
                        disabled={submitting}
                        className="px-3 py-1 text-xs"
                      >
                        <X size={14} />
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleEditSubmit}
                        disabled={submitting || !editContent.trim()}
                        className="px-3 py-1 text-xs bg-green-600 text-white"
                      >
                        <Check size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-200 text-sm leading-relaxed break-words mb-2">
                  {replyContent}
                </p>
              )}

              <div className="flex items-center gap-4">
                <p className="text-gray-400 text-xs">{formatDate(createdAt)}</p>
                <button
                  onClick={() => {
                    if (!checkLoginAndRedirect()) {
                      return;
                    }
                    setShowReplyForm(!showReplyForm);
                  }}
                  className="text-gray-400 text-xs hover:text-green-600 flex items-center gap-1"
                >
                  <MessageCircle size={12} />
                  답글
                </button>
                {mine && (
                  <>
                    <button
                      onClick={() => {
                        if (!checkLoginAndRedirect()) {
                          return;
                        }
                        startEdit();
                      }}
                      disabled={isPending}
                      className="text-gray-400 text-xs hover:text-green-600 flex items-center gap-1 disabled:opacity-50"
                    >
                      <Edit size={12} />
                      수정
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting || isPending}
                      className="text-gray-400 text-xs hover:text-red-600 flex items-center gap-1 disabled:opacity-50"
                    >
                      <Trash2 size={12} />
                      삭제
                    </button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 대댓글 작성 폼 - 삭제된 댓글에는 표시하지 않음 */}
      {showReplyForm && !deleted && (
        <div className="ml-12 mb-4 bg-gray-800 rounded-lg p-3">
          <form onSubmit={handleReplySubmit} className="flex gap-2">
            <textarea
              value={childReplyContent}
              onChange={(e) => setChildReplyContent(e.target.value)}
              placeholder="대댓글을 입력하세요..."
              className="flex-1 p-2 border border-gray-600 text-white text-sm rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-700 placeholder-gray-400"
              rows={2}
              maxLength={500}
              disabled={submitting}
            />
            <Button
              type="submit"
              disabled={submitting || !childReplyContent.trim()}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={14} />
            </Button>
          </form>
        </div>
      )}

      {/* 대댓글 목록 - 삭제된 댓글에는 표시하지 않음 */}
      {localChildReplies && localChildReplies.length > 0 && (
        <div className="ml-12">
          <button
            onClick={toggleChildReplies}
            className="text-gray-400 text-xs hover:text-green-600 mb-3 flex items-center gap-1"
          >
            <Reply size={12} />
            {showChildReplies
              ? '대댓글 숨기기'
              : `대댓글 ${localChildReplies.length}개 보기`}
          </button>
          {showChildReplies && (
            <div className="space-y-3 border-l-2 border-gray-600 pl-4">
              {localChildReplies.map((childReply: ReplyType) => (
                <ChildReplyItem
                  key={childReply.replyUuid}
                  childReply={childReply}
                  onChildReplyUpdated={handleChildReplyUpdated}
                  boardType={boardType}
                  boardUuid={boardUuid}
                  parentReplyUuid={replyUuid}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
