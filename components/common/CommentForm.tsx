'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { createReply } from '@/action/reply-service';
import { useAlert } from '@/hooks/useAlert';

interface CommentFormProps {
  boardType: 'FUNDING' | 'PIECE';
  boardUuid: string;
  onCommentAdded: () => void;
}

export default function CommentForm({
  boardType,
  boardUuid,
  onCommentAdded,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { success, error: showError } = useAlert();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      showError('댓글 내용을 입력해주세요.');
      return;
    }

    if (content.length > 500) {
      showError('댓글은 500자 이내로 작성해주세요.');
      return;
    }

    setLoading(true);
    try {
      await createReply({
        boardType,
        boardUuid: boardUuid,
        replyContent: content.trim(),
      });

      setContent('');
      success('댓글이 작성되었습니다.');
      onCommentAdded();
    } catch (err) {
      console.error('Failed to create comment:', err);
      showError('댓글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`${boardType === 'FUNDING' ? '펀딩' : '조각'} 상품에 대한 의견을 남겨보세요...`}
              className="w-full p-3 border border-gray-200 text-gray-900 text-sm rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              rows={2}
              maxLength={500}
              disabled={loading}
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !content.trim()}
            className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={16} />
          </Button>
        </div>
        <div className="flex justify-between items-center mt-2 px-1">
          <span className="text-xs text-gray-400">{content.length}/500</span>
          {loading && (
            <span className="text-xs text-blue-600 font-medium">
              작성 중...
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
