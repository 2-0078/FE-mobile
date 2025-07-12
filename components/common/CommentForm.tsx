'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
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
  const { data: session } = useSession();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { success, error: showError } = useAlert();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setIsAuth(true);
    }
  }, [session]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 로그인 상태 확인
    if (!checkLoginAndRedirect()) {
      return;
    }

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
      // 커스텀 이벤트를 발생시켜 댓글 목록을 새로고침
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('commentUpdated'));
      }
      onCommentAdded();
    } catch (err) {
      console.error('Failed to create comment:', err);
      showError('댓글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-t border-gray-100">
      {isAuth ? (
        // 로그인된 사용자: 댓글 입력 폼 표시
        <form onSubmit={handleSubmit} className="p-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`${boardType === 'FUNDING' ? '펀딩' : '조각'} 상품에 대한 의견을 남겨보세요...`}
                className="w-full p-3 border border-gray-200 text-black text-sm rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-100 placeholder-gray-400"
                rows={2}
                maxLength={500}
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !content.trim()}
              className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={16} />
            </Button>
          </div>
          <div className="flex justify-between items-center mt-2 px-1">
            <span className="text-xs text-gray-400">{content.length}/500</span>
            {loading && (
              <span className="text-xs text-green-400 font-medium">
                작성 중...
              </span>
            )}
          </div>
        </form>
      ) : (
        // 로그인되지 않은 사용자: 로그인 버튼 표시
        <div className="p-4">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-3">
              댓글 작성은 로그인 후 사용 가능합니다
            </p>
            <Button
              onClick={() => {
                const currentPath =
                  window.location.pathname + window.location.search;
                const callbackUrl = `${currentPath}${currentPath.includes('?') ? '&' : '?'}openComments=true`;
                router.push(
                  `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
                );
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              로그인하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
