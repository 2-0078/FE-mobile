'use client';

import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import PageWrapper from '@/components/layout/PageWrapper';
import { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');

  // 임시 FAQ 데이터
  const faqs: FAQItem[] = [
    {
      id: 1,
      question: '상품을 어떻게 등록하나요?',
      answer:
        '더보기 > 상품 판매하기 메뉴에서 상품을 등록할 수 있습니다. 상품 이미지, 가격, 설명을 입력하고 등록 버튼을 눌러주세요.',
      category: '상품관리',
    },
    {
      id: 2,
      question: '거래 수수료는 얼마인가요?',
      answer: '현재 거래 수수료는 3%입니다. 판매가에서 자동으로 차감됩니다.',
      category: '거래',
    },
    {
      id: 3,
      question: '적립금은 어떻게 사용하나요?',
      answer:
        '적립금은 상품 구매 시 결제 수단으로 사용할 수 있습니다. 1원 = 1포인트로 사용됩니다.',
      category: '적립금',
    },
    {
      id: 4,
      question: '배송은 언제 되나요?',
      answer:
        '결제 완료 후 1-2일 내에 배송됩니다. 배송 상황은 마이페이지에서 확인할 수 있습니다.',
      category: '배송',
    },
    {
      id: 5,
      question: '환불은 어떻게 하나요?',
      answer:
        '상품 수령 후 7일 이내에 환불 신청이 가능합니다. 고객센터로 문의해주세요.',
      category: '환불',
    },
    {
      id: 6,
      question: '회원 탈퇴는 어떻게 하나요?',
      answer:
        '설정 > 계정 관리에서 회원 탈퇴가 가능합니다. 탈퇴 시 모든 데이터가 삭제됩니다.',
      category: '계정',
    },
  ];

  const categories = [
    '전체',
    '상품관리',
    '거래',
    '적립금',
    '배송',
    '환불',
    '계정',
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === '전체' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header title="자주하는 질문" isAlert={false} />
      <PageWrapper>
        <div className="space-y-4">
          {/* 검색 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="질문을 검색해보세요"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-custom-slate border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-green"
            />
          </div>

          {/* 카테고리 필터 */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-custom-green text-black'
                    : 'bg-custom-slate text-gray-300 border border-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ 목록 */}
          <div className="space-y-1">
            {filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-custom-slate border-gray-800 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedId(expandedId === faq.id ? null : faq.id)
                  }
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-white font-medium text-sm">
                      {faq.question}
                    </span>
                  </div>
                  {expandedId === faq.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {expandedId === faq.id && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-300 text-xs leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-8">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-sm">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}
