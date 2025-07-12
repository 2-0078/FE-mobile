'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { CommentList } from './CommentList';
import CommentForm from './CommentForm';
import { revalidateRepliesCache } from '@/action/reply-service';
import { useModal } from '@/stores/modal-store';

interface CommentSectionProps {
  type: 'FUNDING' | 'PIECE';
  productUuid: string;
  commentPage?: string;
}

export function CommentSection({
  type,
  productUuid,
  commentPage = '1',
}: CommentSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const searchParams = useSearchParams();
  const { openModal } = useModal();
  const [, startTransition] = useTransition();

  const handleCommentAdded = () => {
    // Trigger a refresh of the comment list
    setRefreshKey((prev) => prev + 1);
  };

  // openComments 파라미터 감지하여 댓글 모달 자동 열기
  useEffect(() => {
    const openComments = searchParams.get('openComments');
    if (openComments === 'true') {
      openModal('comments');
    }
  }, [searchParams, openModal]);

  // 커스텀 이벤트 리스너 추가 (디바운싱 적용)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleCommentUpdated = async () => {
      // 디바운싱으로 연속된 이벤트 방지
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        startTransition(async () => {
          try {
            // 캐시를 무효화하고 최신 데이터를 가져옴
            await revalidateRepliesCache({
              boardType: type,
              boardUuid: productUuid,
            });
            setRefreshKey((prev) => prev + 1);
          } catch (error) {
            console.error('Failed to refresh comments:', error);
          }
        });
      }, 100);
    };

    window.addEventListener('commentUpdated', handleCommentUpdated);

    return () => {
      window.removeEventListener('commentUpdated', handleCommentUpdated);
      clearTimeout(timeoutId);
    };
  }, [type, productUuid]);

  return (
    <div className="space-y-4">
      <CommentList
        key={refreshKey}
        type={type}
        productUuid={productUuid}
        commentPage={commentPage}
      />
      <CommentForm
        boardType={type}
        boardUuid={productUuid}
        onCommentAdded={handleCommentAdded}
      />
    </div>
  );
}
