'use client';

import React, { useState, useEffect } from 'react';
import { ModalContainer } from '../ModalContainer';
import { ModalHeader } from '../ModalHeader';
import { useModal } from '@/stores/modal-store';
import { CommentSection } from '../common/CommentSection';
import { getRepliesWithChildren } from '@/action/reply-service';
import { ReplyType } from '@/types/CommunityTypes';

interface ModalSectionProps {
  fundingUuid?: string;
  pieceUuid?: string;
  boardType: 'FUNDING' | 'PIECE';
}

export default function ModalSection({
  fundingUuid,
  pieceUuid,
  boardType,
}: ModalSectionProps) {
  const { currentModal, closeModal } = useModal();
  const [replies, setReplies] = useState<ReplyType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReplies = async () => {
    if (!fundingUuid && !pieceUuid) return;

    setLoading(true);
    try {
      const boardUuid = fundingUuid || pieceUuid;
      if (!boardUuid) return;

      const repliesData = await getRepliesWithChildren(
        boardType,
        boardUuid,
        '1'
      );
      setReplies(repliesData || []);
    } catch (error) {
      console.error('Failed to fetch replies:', error);
      setReplies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestProductData = async () => {
    // 최신 상품 데이터를 가져오는 로직
    // 실제 구현에서는 상품 데이터를 새로고침
    console.log('Fetching latest product data...');
  };

  useEffect(() => {
    if (currentModal === 'comments') {
      fetchReplies();
    }
  }, [currentModal, fundingUuid, pieceUuid]);

  useEffect(() => {
    if (currentModal === 'comments') {
      fetchLatestProductData();
    }
  }, [currentModal]);

  if (currentModal === 'comments') {
    return (
      <ModalContainer>
        <ModalHeader title="댓글" onClose={closeModal} />
        <CommentSection
          boardType={boardType}
          boardUuid={fundingUuid || pieceUuid || ''}
          replies={replies}
          loading={loading}
          onRepliesUpdated={fetchReplies}
        />
      </ModalContainer>
    );
  }

  return null;
}
