import React from 'react';
import Header from '@/components/layout/Header';
import PageWrapper from '@/components/layout/PageWrapper';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { auth } from '@/auth';
import { getMemberProfile } from '@/action/member-service';

export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;
  let memberProfile = undefined;

  if (user) {
    memberProfile = await getMemberProfile(user.memberUuid);
  }

  if (!user) {
    return (
      <PageWrapper>
        <Header title="프로필" />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">로그인이 필요합니다.</p>
        </div>
      </PageWrapper>
    );
  }

  const profileItems = [
    {
      icon: <User className="w-5 h-5" />,
      title: '닉네임',
      value: memberProfile?.nickname || '설정되지 않음',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: '이메일',
      value: user.email || '설정되지 않음',
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: '전화번호',
      value: '설정되지 않음',
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: '가입일',
      value: '알 수 없음',
    },
  ];

  const settingsItems = [
    {
      icon: <Settings className="w-5 h-5" />,
      title: '알림 설정',
      subtitle: '푸시 알림을 관리하세요',
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: '개인정보 설정',
      subtitle: '개인정보를 관리하세요',
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: '보안 설정',
      subtitle: '계정 보안을 관리하세요',
    },
  ];

  return (
    <>
      <Header title="프로필" isAlert={false} />
      <PageWrapper>
        {/* Profile Image and Basic Info */}
        <div className="mb-8">
          <div className="bg-custom-slate border-gray-800 p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                {memberProfile?.profileImageUrl ? (
                  <img
                    src={memberProfile.profileImageUrl}
                    alt="프로필"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div>
                <h2 className="text-white text-xl font-bold">
                  {memberProfile?.nickname || '사용자'}
                </h2>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-6">
          <div>
            <h3 className="text-gray-300 text-sm font-medium mb-3">
              기본 정보
            </h3>
            <div className="space-y-3">
              {profileItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-custom-slate border-gray-800 p-4 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-gray-300">{item.icon}</div>
                      <div>
                        <p className="text-gray-400 text-sm">{item.title}</p>
                        <p className="text-white font-medium">{item.value}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div>
            <h3 className="text-gray-300 text-sm font-medium mb-3">설정</h3>
            <div className="space-y-3">
              {settingsItems.map((item, index) => (
                <div
                  key={index}
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
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
