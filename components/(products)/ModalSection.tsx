'use client';

import React from 'react';
import { ModalContainer } from '../ModalContainer';
import { ModalHeader } from '../ModalHeader';
import { useModal } from '@/stores/modal-store';
import { CommentSection } from '../common/CommentSection';

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
  const { currentModal } = useModal();

  if (currentModal === 'comments') {
    return (
      <ModalContainer isOpen={true}>
        <ModalHeader>댓글</ModalHeader>
        <CommentSection
          type={boardType}
          productUuid={fundingUuid || pieceUuid || ''}
        />
      </ModalContainer>
    );
  }

  return null;
}
