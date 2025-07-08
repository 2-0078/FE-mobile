'use client';

import { Headset, Mail, Phone, MessageSquare, Send } from 'lucide-react';
import Header from '@/components/layout/Header';
import PageWrapper from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import { FloatingInput } from '@/components/ui/floating-input';
import { useState } from 'react';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMethods = [
    {
      icon: <Phone className="w-5 h-5" />,
      title: '전화 문의',
      value: '1588-1234',
      description: '평일 09:00 - 18:00',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: '이메일 문의',
      value: 'support@pieceofcake.site',
      description: '24시간 접수 가능',
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: '실시간 채팅',
      value: '채팅 상담',
      description: '평일 09:00 - 18:00',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: 실제 API 호출
      console.log('문의 제출:', form);
      alert(
        '문의가 성공적으로 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.'
      );
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      alert('문의 접수에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header title="문의하기" isAlert={false} />
      <PageWrapper>
        <div className="space-y-6 px-4">
          {/* 문의 방법 */}
          <div className="space-y-3">
            <h2 className="text-white font-medium text-lg">문의 방법</h2>
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="bg-custom-slate border-gray-800 rounded-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="text-custom-green">{method.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-sm">
                      {method.title}
                    </h3>
                    <p className="text-custom-green text-sm font-medium">
                      {method.value}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {method.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 문의 폼 */}
          <div className="space-y-4">
            <h2 className="text-white font-medium text-lg">1:1 문의</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FloatingInput
                  id="name"
                  name="name"
                  label="이름"
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  placeholder="이름을 입력해주세요"
                />

                <FloatingInput
                  id="email"
                  name="email"
                  label="이메일"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  placeholder="이메일을 입력해주세요"
                />
              </div>

              <FloatingInput
                id="phone"
                name="phone"
                label="연락처"
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="연락처를 입력해주세요"
              />

              <FloatingInput
                id="subject"
                name="subject"
                label="문의 제목"
                type="text"
                value={form.subject}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, subject: e.target.value }))
                }
                required
                placeholder="문의 제목을 입력해주세요"
              />

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  문의 내용
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, message: e.target.value }))
                  }
                  required
                  rows={6}
                  placeholder="문의 내용을 자세히 입력해주세요"
                  className="w-full bg-custom-slate border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-green resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !form.name ||
                  !form.email ||
                  !form.subject ||
                  !form.message
                }
                className="w-full bg-custom-green text-black font-bold py-4 rounded-md h-14 disabled:opacity-50"
              >
                {isSubmitting ? '접수 중...' : '문의 접수하기'}
              </Button>
            </form>
          </div>

          {/* FAQ 링크 */}
          <div className="bg-custom-slate border-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Headset className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <h3 className="text-white font-medium text-sm">
                  자주하는 질문
                </h3>
                <p className="text-gray-400 text-xs">
                  궁금한 점이 있으시면 FAQ를 먼저 확인해보세요
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8 px-3"
                onClick={() => (window.location.href = '/faq')}
              >
                FAQ 보기
              </Button>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
