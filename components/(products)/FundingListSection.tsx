import { Clock, Puzzle } from "lucide-react";
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface CrowdfundingProduct {
  id: string;
  image: string;
  title: string;
  brand: string;
  currentParticipants: number;
  totalParticipants: number;
  pricePerShare: number;
  totalPrice: number;
  daysLeft: number;
}

const crowdfundingProducts: CrowdfundingProduct[] = [
  {
    id: "1",
    image: "/placeholder.svg?height=60&width=60",
    title: "샤넬 클래식 플랩백",
    brand: "Chanel",
    currentParticipants: 45,
    totalParticipants: 100,
    pricePerShare: 163000,
    totalPrice: 1600000000,
    daysLeft: 12,
  },
  {
    id: "2",
    image: "/placeholder.svg?height=60&width=60",
    title: "롤렉스 서브마리너",
    brand: "Rolex",
    currentParticipants: 78,
    totalParticipants: 120,
    pricePerShare: 140000,
    totalPrice: 16800000,
    daysLeft: 5,
  },
  {
    id: "3",
    image: "/placeholder.svg?height=60&width=60",
    title: "에르메스 버킨백",
    brand: "Hermès",
    currentParticipants: 23,
    totalParticipants: 80,
    pricePerShare: 262500,
    totalPrice: 21000000,
    daysLeft: 18,
  },
  {
    id: "4",
    image: "/placeholder.svg?height=60&width=60",
    title: "샤넬 22백팩",
    brand: "Chanel",
    currentParticipants: 67,
    totalParticipants: 90,
    pricePerShare: 103800,
    totalPrice: 9340000,
    daysLeft: 8,
  },
];

export function FundingListSection() {
  const formatPrice = (price: number) => {
    if (price >= 100000000) {
      return `${(price / 100000000).toFixed(0)}억${
        (price % 100000000) / 10000
      }만원`;
    } else if (price >= 10000) {
      return `${(price / 10000).toFixed(0)}만원`;
    } else {
      return `${price.toLocaleString()}원`;
    }
  };

  const getProgressPercentage = (current: number, total: number) => {
    return Math.round((current / total) * 100);
  };

  return (
    <div className="space-y-4 px-4">
      {crowdfundingProducts.map((product) => (
        <div
          key={product.id}
          className="bg-slate-800/50 rounded-lg px-4 py-2 border h-30 border-slate-700/50"
        >
          <Link href={`/funding/${product.id}`}>
            <div className="flex items-center gap-3 relative">
              <div className="w-16 h-24 relative rounded-lg flex items-center justify-center">
                <Image
                  src="/example.png"
                  alt="example"
                  fill={true}
                  className="object-contain mx-auto"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">
                      {product.brand}
                    </p>
                    <h3 className="text-sm font-medium text-white">
                      {product.title}
                    </h3>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-xs text-slate-400">조각당</p>
                    <p className="text-lg font-bold text-white">
                      {product.pricePerShare.toLocaleString()}원
                    </p>
                    <div className="text-xs text-slate-400">
                      총 {formatPrice(product.totalPrice)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-300">
                    <Puzzle className="w-3 h-3" />
                    <span>
                      {product.totalParticipants - product.currentParticipants}/
                      {product.totalParticipants}
                    </span>
                    <span className="text-blue-400">
                      (
                      {getProgressPercentage(
                        product.totalParticipants - product.currentParticipants,
                        product.totalParticipants
                      )}
                      %)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-300">
                    <Clock className="w-3 h-3" />
                    <span>{product.daysLeft}일 남음</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2 w-full bg-slate-700 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${getProgressPercentage(
                        product.totalParticipants - product.currentParticipants,
                        product.totalParticipants
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
