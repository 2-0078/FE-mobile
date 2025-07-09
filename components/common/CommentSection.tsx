'use client';

import React, { useState } from 'react';
import { CommentList } from './CommentList';
import CommentForm from './CommentForm';

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

  const handleCommentAdded = () => {
    // Trigger a refresh of the comment list
    setRefreshKey((prev) => prev + 1);
  };

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
