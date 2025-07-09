'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ReplyType } from '@/types/CommunityTypes';
import { getMemberProfile } from '@/action/member-service';
import {
  createChildReply,
  updateReply,
  deleteReply,
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

export function CommentItem({
  replyUuid,
  createdAt,
  memberUuid,
  mine,
  replyContent,
  childReplies = [],
}: ReplyType) {
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

  useEffect(() => {
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
    fetchMemberProfile();
  }, [memberUuid]);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      await createChildReply({
        parentReplyUuid: replyUuid,
        replyContent: childReplyContent.trim(),
      });

      setChildReplyContent('');
      setShowReplyForm(false);
      success('대댓글이 작성되었습니다.');
      // Refresh the page or trigger parent refresh
      window.location.reload();
    } catch (err) {
      console.error('Failed to create child reply:', err);
      showError('대댓글 작성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
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
      await updateReply({
        replyUuid,
        replyContent: editContent.trim(),
      });

      setIsEditing(false);
      success('댓글이 수정되었습니다.');
      // Refresh the page or trigger parent refresh
      window.location.reload();
    } catch (err) {
      console.error('Failed to update reply:', err);
      showError('댓글 수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteReply(replyUuid);
      success('댓글이 삭제되었습니다.');
      // Refresh the page or trigger parent refresh
      window.location.reload();
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
    <div className="border-b border-gray-100 last:border-b-0">
      {/* 부모 댓글 */}
      <div className="flex items-start gap-3 py-5">
        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100">
          {loading ? (
            <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse" />
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
            <p className="font-medium text-sm text-gray-900">
              {loading ? '로딩 중...' : username}
            </p>
            {mine && (
              <span className="px-2 py-0.5 text-xs bg-green-50 text-green-600 rounded-full font-medium">
                나
              </span>
            )}
          </div>

          {/* 수정 모드일 때 텍스트 영역 표시 */}
          {isEditing ? (
            <div className="mb-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 border border-gray-200 text-gray-900 text-sm rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
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
            <p className="text-gray-800 text-sm leading-relaxed break-words mb-2">
              {replyContent}
            </p>
          )}

          <div className="flex items-center gap-4">
            <p className="text-gray-400 text-xs">{formatDate(createdAt)}</p>
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-gray-400 text-xs hover:text-green-600 flex items-center gap-1"
            >
              <MessageCircle size={12} />
              답글
            </button>
            {mine && (
              <>
                <button
                  onClick={startEdit}
                  className="text-gray-400 text-xs hover:text-green-600 flex items-center gap-1"
                >
                  <Edit size={12} />
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-gray-400 text-xs hover:text-red-600 flex items-center gap-1 disabled:opacity-50"
                >
                  <Trash2 size={12} />
                  삭제
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 대댓글 작성 폼 */}
      {showReplyForm && (
        <div className="ml-12 mb-4 bg-gray-50 rounded-lg p-3">
          <form onSubmit={handleReplySubmit} className="flex gap-2">
            <textarea
              value={childReplyContent}
              onChange={(e) => setChildReplyContent(e.target.value)}
              placeholder="대댓글을 입력하세요..."
              className="flex-1 p-2 border border-gray-200 text-gray-900 text-sm rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
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

      {/* 대댓글 목록 */}
      {childReplies && childReplies.length > 0 && (
        <div className="ml-12">
          <button
            onClick={toggleChildReplies}
            className="text-gray-500 text-xs hover:text-green-600 mb-3 flex items-center gap-1"
          >
            <Reply size={12} />
            {showChildReplies
              ? '대댓글 숨기기'
              : `대댓글 ${childReplies.length}개 보기`}
          </button>
          {showChildReplies && (
            <div className="space-y-3 border-l-2 border-gray-200 pl-4">
              {childReplies.map((childReply: ReplyType) => (
                <div
                  key={childReply.replyUuid}
                  className="flex items-start gap-3 py-3 bg-gray-50 rounded-lg p-3"
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-white border border-gray-200">
                    <Image
                      src="/next.svg"
                      alt="avatar"
                      width={28}
                      height={28}
                      className="rounded-full object-cover"
                      onError={() => {}}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-xs text-gray-900">
                        사용자
                      </p>
                      {childReply.mine && (
                        <span className="px-1.5 py-0.5 text-xs bg-blue-50 text-green-600 rounded-full font-medium">
                          나
                        </span>
                      )}
                    </div>
                    <p className="text-gray-800 text-xs leading-relaxed break-words mb-1">
                      {childReply.replyContent}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {formatDate(childReply.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
