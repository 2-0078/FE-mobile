'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { ReplyType } from '@/types/CommunityTypes';
import { getMemberProfile } from '@/action/member-service';
import { updateChildReply, deleteChildReply } from '@/action/reply-service';
import { useAlert } from '@/hooks/useAlert';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, X, Check } from 'lucide-react';

interface ChildReplyItemProps {
  childReply: ReplyType;
  onChildReplyUpdated: () => void;
  boardType?: 'FUNDING' | 'PIECE';
  boardUuid?: string;
  parentReplyUuid?: string;
}

export function ChildReplyItem({
  childReply,
  onChildReplyUpdated,
  boardType,
  boardUuid,
  parentReplyUuid,
}: ChildReplyItemProps) {
  const [avatar, setAvatar] = useState<string>('/next.svg');
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(childReply.replyContent);
  const [submitting, setSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { success, error: showError } = useAlert();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // 삭제된 대댓글의 경우 아예 fetch하지 않음
    if (childReply.deleted) {
      setLoading(false);
      setUsername('알 수 없음');
      setAvatar('/next.svg');
      return;
    }

    const fetchMemberProfile = async () => {
      try {
        setLoading(true);
        const memberProfile = await getMemberProfile(childReply.memberUuid);
        setAvatar(memberProfile.profileImageUrl || '/next.svg');
        setUsername(memberProfile.nickname);
      } catch (error) {
        console.error('Failed to fetch child reply member profile:', error);
        setUsername('사용자');
      } finally {
        setLoading(false);
      }
    };

    // 삭제되지 않은 대댓글만 상세조회
    if (!childReply.deleted && childReply.memberUuid) {
      fetchMemberProfile();
    }
  }, [childReply.memberUuid, childReply.deleted]);

  const handleEditSubmit = async () => {
    if (!editContent.trim()) {
      showError('대댓글 내용을 입력해주세요.');
      return;
    }

    if (editContent.length > 500) {
      showError('대댓글은 500자 이내로 작성해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      if (!parentReplyUuid || !boardType || !boardUuid) {
        throw new Error('게시판 정보가 필요합니다.');
      }
      await updateChildReply({
        replyUuid: childReply.replyUuid,
        replyContent: editContent.trim(),
        parentReplyUuid,
        boardType,
        boardUuid,
      });

      setIsEditing(false);
      success('대댓글이 수정되었습니다.');
      startTransition(() => {
        onChildReplyUpdated();
      });
    } catch (err) {
      console.error('Failed to update child reply:', err);
      showError('대댓글 수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('정말로 이 대댓글을 삭제하시겠습니까?')) {
      return;
    }

    setIsDeleting(true);
    try {
      if (!parentReplyUuid || !boardType || !boardUuid) {
        throw new Error('게시판 정보가 필요합니다.');
      }
      await deleteChildReply({
        replyUuid: childReply.replyUuid,
        parentReplyUuid,
        boardType,
        boardUuid,
      });
      success('대댓글이 삭제되었습니다.');
      startTransition(() => {
        onChildReplyUpdated();
      });
    } catch (err) {
      console.error('Failed to delete child reply:', err);
      showError('대댓글 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const startEdit = () => {
    setEditContent(childReply.replyContent);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setEditContent(childReply.replyContent);
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
    <div className="flex items-start gap-3 py-3 bg-gray-800 rounded-lg p-3">
      {childReply.deleted ? (
        // 삭제된 대댓글은 회색 배경 아바타
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-600">
          <div className="w-7 h-7 bg-gray-600 rounded-full" />
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-700 border border-gray-600">
          {loading ? (
            <div className="w-7 h-7 bg-gray-600 rounded-full animate-pulse" />
          ) : (
            <Image
              src={avatar}
              alt="avatar"
              width={28}
              height={28}
              className="rounded-full object-cover"
              onError={() => setAvatar('/next.svg')}
            />
          )}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-xs text-white">
            {loading ? '로딩 중...' : username}
          </p>
          {childReply.mine && !childReply.deleted && (
            <span className="px-1.5 py-0.5 text-xs bg-green-900 text-green-400 rounded-full font-medium">
              나
            </span>
          )}
        </div>
        {childReply.deleted ? (
          <p className="text-gray-500 text-xs italic">삭제된 댓글입니다</p>
        ) : isEditing ? (
          <div className="mb-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border border-gray-600 text-white text-xs rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-700 placeholder-gray-400"
              rows={2}
              maxLength={500}
              disabled={submitting}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-400">
                {editContent.length}/500
              </span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={cancelEdit}
                  disabled={submitting}
                  className="px-2 py-1 text-xs"
                >
                  <X size={12} />
                </Button>
                <Button
                  size="sm"
                  onClick={handleEditSubmit}
                  disabled={submitting || !editContent.trim()}
                  className="px-2 py-1 text-xs bg-green-600 text-white"
                >
                  <Check size={12} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-200 text-xs leading-relaxed break-words mb-1">
            {childReply.replyContent}
          </p>
        )}
        <div className="flex items-center gap-3">
          <p className="text-gray-400 text-xs">
            {formatDate(childReply.createdAt)}
          </p>
          {!childReply.deleted && childReply.mine && (
            <>
              <button
                onClick={startEdit}
                disabled={isPending}
                className="text-gray-400 text-xs hover:text-green-600 flex items-center gap-1 disabled:opacity-50"
              >
                <Edit size={10} />
                수정
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting || isPending}
                className="text-gray-400 text-xs hover:text-red-600 flex items-center gap-1 disabled:opacity-50"
              >
                <Trash2 size={10} />
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
