import { PartyPopper, Calendar, Users, Gift, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';
import PageWrapper from '@/components/layout/PageWrapper';
// import { auth } from '@/auth'; // 사용하지 않는 import 주석 처리

interface EventItem {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  reward: string;
  isActive: boolean;
  imageUrl?: string;
}

export default async function EventPage() {
  // const session = await auth(); // 사용하지 않는 변수 주석 처리
  // const user = session?.user; // 사용하지 않는 변수 주석 처리

  // 임시 이벤트 데이터
  const events: EventItem[] = [
    {
      id: 1,
      title: '신규 가입자 이벤트',
      description: '신규 가입 시 10,000원 적립금을 드립니다!',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      participants: 150,
      maxParticipants: 200,
      reward: '10,000원 적립금',
      isActive: true,
    },
    {
      id: 2,
      title: '첫 거래 완료 이벤트',
      description: '첫 거래 완료 시 추가 5,000원 적립금을 드립니다.',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      participants: 89,
      maxParticipants: 100,
      reward: '5,000원 적립금',
      isActive: true,
    },
    {
      id: 3,
      title: '친구 초대 이벤트',
      description: '친구를 초대하고 양쪽 모두 적립금을 받아보세요!',
      startDate: '2024-01-10',
      endDate: '2024-01-25',
      participants: 45,
      maxParticipants: 50,
      reward: '양쪽 3,000원 적립금',
      isActive: false,
    },
  ];

  return (
    <>
      <Header title="이벤트" isAlert={false} isCloseButton={true} />
      <PageWrapper>
        <div className="space-y-4 px-4 pt-20">
          {events.map((event) => (
            <div
              key={event.id}
              className={`bg-custom-slate border-gray-800 rounded-lg p-4 transition-colors ${
                !event.isActive ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <PartyPopper className="w-4 h-4 text-yellow-400" />
                  <h3 className="text-white font-medium text-sm">
                    {event.title}
                  </h3>
                  {!event.isActive && (
                    <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded">
                      종료
                    </span>
                  )}
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                {event.description}
              </p>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {event.startDate} ~ {event.endDate}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Users className="w-3 h-3" />
                  <span>
                    {event.participants}/{event.maxParticipants}명 참여
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-green-400">
                  <Gift className="w-3 h-3" />
                  <span>{event.reward}</span>
                </div>
              </div>

              {event.isActive && (
                <div className="flex items-center gap-2 text-xs text-yellow-400">
                  <Clock className="w-3 h-3" />
                  <span>진행중</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </PageWrapper>
    </>
  );
}
