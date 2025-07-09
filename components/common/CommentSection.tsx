'use client';

import React, { useState } from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

interface CommentSectionProps {
  boardType: 'FUNDING' | 'PIECE';
  boardUuid: string;
}

export default function CommentSection({
  boardType,
  boardUuid,
}: CommentSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCommentAdded = () => {
    // 댓글이 추가되면 리스트를 새로고침
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">댓글</h3>
        <p className="text-sm text-gray-500 mt-1">
          {boardType === 'FUNDING' ? '펀딩' : '조각'} 상품에 대한 의견을
          공유해보세요
        </p>
      </div>

      <CommentList
        key={refreshKey}
        boardType={boardType}
        boardUuid={boardUuid}
      />

      <CommentForm
        boardType={boardType}
        boardUuid={boardUuid}
        onCommentAdded={handleCommentAdded}
      />
    </div>
  );
}
