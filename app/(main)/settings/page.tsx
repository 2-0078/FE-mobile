import React from 'react';
import Header from '@/components/layout/Header';
import PageWrapper from '@/components/layout/PageWrapper';
import {
  Bell,
  Shield,
  User,
  Moon,
  Globe,
  Smartphone,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { auth } from '@/auth';
import Link from 'next/link';

export default async function SettingsPage() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return (
      <PageWrapper>
        <Header title="설정" />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">로그인이 필요합니다.</p>
        </div>
      </PageWrapper>
    );
  }

  const notificationSettings = [
    {
      icon: <Bell className="w-5 h-5" />,
      title: '푸시 알림',
      subtitle: '새로운 상품과 이벤트 알림',
      type: 'toggle',
      enabled: true,
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: '마케팅 알림',
      subtitle: '프로모션 및 할인 정보',
      type: 'toggle',
      enabled: false,
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: '거래 알림',
      subtitle: '구매, 판매 관련 알림',
      type: 'toggle',
      enabled: true,
    },
  ];

  const privacySettings = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: '개인정보 설정',
      subtitle: '개인정보 수집 및 이용',
      type: 'link',
      href: '/profile',
    },
    {
      icon: <User className="w-5 h-5" />,
      title: '계정 보안',
      subtitle: '비밀번호 변경 및 2단계 인증',
      type: 'link',
      href: '/profile',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: '데이터 관리',
      subtitle: '개인정보 다운로드 및 삭제',
      type: 'link',
      href: '/profile',
    },
  ];

  const appSettings = [
    {
      icon: <Moon className="w-5 h-5" />,
      title: '다크 모드',
      subtitle: '자동 테마 설정',
      type: 'toggle',
      enabled: true,
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: '언어 설정',
      subtitle: '한국어',
      type: 'link',
      href: '/profile',
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: '앱 버전',
      subtitle: 'v1.0.0',
      type: 'info',
    },
  ];

  const supportItems = [
    {
      icon: <Globe className="w-5 h-5" />,
      title: '고객센터',
      subtitle: '문의사항 및 도움말',
      href: '/contact',
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: '이용약관',
      subtitle: '서비스 이용 약관',
      href: '/faq',
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: '개인정보처리방침',
      subtitle: '개인정보 수집 및 이용',
      href: '/faq',
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderSettingItem = (item: any) => {
    if (item.href) {
      return (
        <Link key={item.title} href={item.href}>
          <div className="bg-custom-slate border-gray-800 p-4 rounded-lg transition-colors cursor-pointer hover:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-gray-300">{item.icon}</div>
                <div>
                  <p className="text-white font-medium">{item.title}</p>
                  <p className="text-gray-400 text-sm">{item.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center">
                {item.type === 'toggle' && (
                  <button
                    className={`p-1 rounded-full transition-colors ${
                      item.enabled ? 'text-custom-green' : 'text-gray-500'
                    }`}
                  >
                    {item.enabled ? (
                      <ToggleRight className="w-6 h-6" />
                    ) : (
                      <ToggleLeft className="w-6 h-6" />
                    )}
                  </button>
                )}
                {item.type === 'link' && (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
                {item.type === 'info' && (
                  <span className="text-gray-400 text-sm">{item.subtitle}</span>
                )}
              </div>
            </div>
          </div>
        </Link>
      );
    }

    return (
      <div
        key={item.title}
        className="bg-custom-slate border-gray-800 p-4 rounded-lg transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-gray-300">{item.icon}</div>
            <div>
              <p className="text-white font-medium">{item.title}</p>
              <p className="text-gray-400 text-sm">{item.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center">
            {item.type === 'toggle' && (
              <button
                className={`p-1 rounded-full transition-colors ${
                  item.enabled ? 'text-custom-green' : 'text-gray-500'
                }`}
              >
                {item.enabled ? (
                  <ToggleRight className="w-6 h-6" />
                ) : (
                  <ToggleLeft className="w-6 h-6" />
                )}
              </button>
            )}
            {item.type === 'link' && (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
            {item.type === 'info' && (
              <span className="text-gray-400 text-sm">{item.subtitle}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header title="설정" isAlert={false} isCloseButton={true} />
      <PageWrapper>
        <div className="space-y-6 pt-20">
          {/* Notification Settings */}
          <div>
            <h3 className="text-gray-300 text-sm font-medium mb-3">
              알림 설정
            </h3>
            <div className="space-y-3">
              {notificationSettings.map(renderSettingItem)}
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <h3 className="text-gray-300 text-sm font-medium mb-3">
              개인정보 및 보안
            </h3>
            <div className="space-y-3">
              {privacySettings.map(renderSettingItem)}
            </div>
          </div>

          {/* App Settings */}
          <div>
            <h3 className="text-gray-300 text-sm font-medium mb-3">앱 설정</h3>
            <div className="space-y-3">
              {appSettings.map(renderSettingItem)}
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-gray-300 text-sm font-medium mb-3">지원</h3>
            <div className="space-y-3">
              {supportItems.map(renderSettingItem)}
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
