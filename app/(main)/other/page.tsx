import { Metadata } from 'next';
import {
  PartyPopper,
  ChevronRight,
  Package,
  HandCoins,
  User,
  Headset,
  HelpCircle,
  FileText,
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import LogoutButton from '@/components/common/LogoutButton';
import BottomNavbar from '@/components/layout/BottomNavbar';
import { auth } from '@/auth';
import { getMemberProfile } from '@/action/member-service';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '더보기',
  description:
    'Piece of Cake에서 공지사항, 이벤트, 자주하는 질문, 상품 판매, 문의하기 등 다양한 서비스를 이용하세요.',
  keywords: [
    '공지사항',
    '이벤트',
    '자주하는 질문',
    '상품 판매',
    '문의하기',
    '고객센터',
    '투자',
    '조각투자',
  ],
  openGraph: {
    title: '더보기 | Piece of Cake',
    description:
      '공지사항, 이벤트, 자주하는 질문, 상품 판매, 문의하기 등 다양한 서비스를 이용하세요.',
    url: 'https://pieceofcake.site/other',
    siteName: 'Piece of Cake',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Piece of Cake - 더보기',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '더보기 | Piece of Cake',
    description:
      '공지사항, 이벤트, 자주하는 질문, 상품 판매, 문의하기 등 다양한 서비스를 이용하세요.',
    images: ['/og-image.png'],
  },
};

export default async function OtherPage() {
  const session = await auth();
  const user = session?.user;
  let memberProfile = undefined;

  if (user) {
    memberProfile = await getMemberProfile(user.memberUuid);
  }

  const menuItems = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: '공지사항',
      subtitle: '새로운 소식을 확인하세요',
      href: '/notice',
    },
    {
      icon: <PartyPopper className="w-5 h-5" />,
      title: '이벤트',
      subtitle: '진행중인 이벤트',
      href: '/event',
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: '자주하는 질문',
      subtitle: '궁금한 점을 해결하세요',
      href: '/faq',
    },
  ];

  const productItems = [
    {
      icon: <HandCoins className="w-5 h-5" />,
      title: '상품 판매하기',
      subtitle: '내 상품을 등록해보세요',
      href: '/sell',
    },
    {
      icon: <Package className="w-5 h-5" />,
      title: '등록 상품 조회하기',
      subtitle: '판매중인 상품 관리',
      href: '/my-products',
    },
  ];

  const supportItems = [
    {
      icon: <Headset className="w-5 h-5" />,
      title: '문의하기',
      subtitle: '고객센터 연결',
      href: '/contact',
    },
  ];

  return (
    <>
      <PageWrapper>
        {user && (
          <div className="mb-8">
            <Link href="/profile">
              <div className="cursor-pointer hover:bg-gray-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {memberProfile?.nickname}님
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Menu Sections */}
        <div className="space-y-6">
          {/* General Menu */}
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <div className="cursor-pointer hover:bg-gray-800 transition-colors py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-gray-300">{item.icon}</div>
                    <div>
                      <p className="text-white font-medium">{item.title}</p>
                      <p className="text-gray-400 text-sm">{item.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </Link>
          ))}

          {/* Product Section */}
          <div>
            <h2 className="text-gray-300 text-sm font-medium mb-3">
              상품을 판매하고 싶으신가요?
            </h2>
            <div className="space-y-3">
              {productItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <div className="bg-custom-slate border-gray-800 p-4 cursor-pointer hover:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-green-400">{item.icon}</div>
                        <div>
                          <p className="text-white font-medium">{item.title}</p>
                          <p className="text-gray-400 text-sm">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Support Section */}
          <div>
            <h2 className="text-gray-300 text-sm font-medium mb-3">
              궁금하신 점이 있으신가요?
            </h2>
            <div className="space-y-3">
              {supportItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <div className="bg-custom-slate border-gray-800 p-4 cursor-pointer hover:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-300">{item.icon}</div>
                        <div>
                          <p className="text-white font-medium">{item.title}</p>
                          <p className="text-gray-400 text-sm">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          {user && <LogoutButton />}
        </div>
      </PageWrapper>
      <BottomNavbar />
    </>
  );
}
