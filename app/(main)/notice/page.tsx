import { FileText, Calendar, User } from 'lucide-react';
import Header from '@/components/layout/Header';
import PageWrapper from '@/components/layout/PageWrapper';
import { auth } from '@/auth';

interface NoticeItem {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  isImportant: boolean;
}

export default async function NoticePage() {
  const session = await auth();
  // const user = session?.user; // 사용하지 않는 변수 주석 처리

  // 임시 공지사항 데이터
  const notices: NoticeItem[] = [
    {
      id: 1,
      title: '서비스 이용약관 개정 안내',
      content:
        '더 나은 서비스 제공을 위해 이용약관이 개정되었습니다. 자세한 내용은 아래 링크를 통해 확인해주세요.',
      author: '관리자',
      date: '2024-01-15',
      isImportant: true,
    },
    {
      id: 2,
      title: '신규 상품 등록 기능 오픈',
      content:
        '이제 직접 상품을 등록하고 판매할 수 있습니다. 상품 등록 방법은 FAQ를 참고해주세요.',
      author: '관리자',
      date: '2024-01-10',
      isImportant: false,
    },
    {
      id: 3,
      title: '시스템 점검 안내',
      content:
        '2024년 1월 20일 새벽 2시부터 4시까지 시스템 점검이 진행됩니다. 이용에 참고해주세요.',
      author: '시스템팀',
      date: '2024-01-08',
      isImportant: false,
    },
  ];

  return (
    <>
      <Header title="공지사항" isAlert={false} />
      <PageWrapper>
        <div className="space-y-4 px-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-custom-slate border-gray-800 rounded-lg p-4 transition-colors ${
                notice.isImportant ? 'border-l-4 border-l-red-500' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <h3 className="text-white font-medium text-sm">
                    {notice.title}
                  </h3>
                  {notice.isImportant && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                      중요
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                {notice.content}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{notice.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{notice.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageWrapper>
    </>
  );
}
