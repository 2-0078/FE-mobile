import {
  PartyPopper,
  ChevronRight,
  Package,
  HandCoins,
  User,
  Headset,
  HelpCircle,
  FileText,
} from "lucide-react";
import Header from "@/components/layout/Header";
import PageWrapper from "@/components/layout/PageWrapper";

export default function OtherPage() {
  const menuItems = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: "공지사항",
      subtitle: "새로운 소식을 확인하세요",
    },
    {
      icon: <PartyPopper className="w-5 h-5" />,
      title: "이벤트",
      subtitle: "진행중인 이벤트",
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: "자주하는 질문",
      subtitle: "궁금한 점을 해결하세요",
    },
  ];

  const productItems = [
    {
      icon: <HandCoins className="w-5 h-5" />,
      title: "상품 판매하기",
      subtitle: "내 상품을 등록해보세요",
    },
    {
      icon: <Package className="w-5 h-5" />,
      title: "등록 상품 조회하기",
      subtitle: "판매중인 상품 관리",
    },
  ];

  const supportItems = [
    {
      icon: <Headset className="w-5 h-5" />,
      title: "문의하기",
      subtitle: "고객센터 연결",
    },
  ];

  return (
    <PageWrapper>
      <Header title="더보기" />

      {/* User Section */}
      <div className="mb-8">
        <div className="bg-custom-slate border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-300" />
              </div>
              <div>
                <p className="text-white font-medium">OOO님</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="space-y-6">
        {/* General Menu */}
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="bg-custom-slate border-gray-800 p-4  transition-colors"
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

        {/* Product Section */}
        <div>
          <h2 className="text-gray-300 text-sm font-medium mb-3">
            상품을 판매하고 싶으신가요?
          </h2>
          <div className="space-y-3">
            {productItems.map((item, index) => (
              <div
                key={index}
                className="bg-custom-slate border-gray-800 p-4  transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-green-400">{item.icon}</div>
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

        {/* Support Section */}
        <div>
          <h2 className="text-gray-300 text-sm font-medium mb-3">
            궁금하신 점이 있으신가요?
          </h2>
          <div className="space-y-3">
            {supportItems.map((item, index) => (
              <div
                key={index}
                className="bg-custom-slate border-gray-800 p-4  transition-colors"
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
  );
}
