"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  MessageCircle,
  ShoppingCart,
  Gavel,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SculptureTradingPlatform() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1D");
  const [activeInfoTab, setActiveInfoTab] = useState("orderbook");
  const [buyPrice, setBuyPrice] = useState(2850000);
  const [sellPrice, setSellPrice] = useState(2850000);
  const [buyQuantity, setBuyQuantity] = useState(1);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [ownedQuantity] = useState(3); // 보유 수량 (실제로는 API에서 가져올 데이터)

  const sculptureData = {
    name: "Venus de Milo Replica",
    artist: "Classical Greek Style",
    currentPrice: 2850000,
    change: 156000,
    changePercent: 5.8,
    highestBid: 2850000,
    lowestAsk: 2900000,
    volume24h: 12,
    marketCap: 45600000,
  };

  // 호가단위 계산 함수
  const getTickSize = (price: number): number => {
    if (price < 1000) return 1;
    if (price < 5000) return 5;
    if (price < 10000) return 10;
    if (price < 50000) return 50;
    if (price < 100000) return 100;
    if (price < 500000) return 500;
    return 1000;
  };

  // 호가단위로 가격 조정
  const adjustToTickSize = (price: number): number => {
    const tickSize = getTickSize(price);
    return Math.round(price / tickSize) * tickSize;
  };

  // 가격 증가/감소
  const adjustPrice = (
    currentPrice: number,
    direction: "up" | "down"
  ): number => {
    const tickSize = getTickSize(currentPrice);
    const newPrice =
      direction === "up" ? currentPrice + tickSize : currentPrice - tickSize;
    return Math.max(0, adjustToTickSize(newPrice));
  };

  // 입력값 검증 및 조정
  const handlePriceInput = (
    value: string,
    setPriceFunc: (price: number) => void
  ) => {
    const numValue = Number.parseInt(value.replace(/,/g, ""));
    if (!isNaN(numValue)) {
      const adjustedPrice = adjustToTickSize(numValue);
      setPriceFunc(adjustedPrice);
    }
  };

  const orderBookData = {
    bids: [
      { price: 2850000, quantity: 2, total: 5700000 },
      { price: 2840000, quantity: 1, total: 2840000 },
      { price: 2830000, quantity: 3, total: 8490000 },
      { price: 2820000, quantity: 1, total: 2820000 },
      { price: 2810000, quantity: 2, total: 5620000 },
    ],
    asks: [
      { price: 2900000, quantity: 1, total: 2900000 },
      { price: 2910000, quantity: 2, total: 5820000 },
      { price: 2920000, quantity: 1, total: 2920000 },
      { price: 2930000, quantity: 3, total: 8790000 },
      { price: 2940000, quantity: 1, total: 2940000 },
    ],
  };

  const communityPosts = [
    {
      id: 1,
      user: "ArtCollector92",
      content: "Venus de Milo showing strong support at 2.8M level",
      likes: 24,
      time: "2m",
    },
    {
      id: 2,
      user: "SculptureExpert",
      content: "Market sentiment looking bullish for classical pieces",
      likes: 18,
      time: "5m",
    },
    {
      id: 3,
      user: "InvestorPro",
      content: "Volume spike indicates institutional interest",
      likes: 31,
      time: "8m",
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const formatChange = (change: number, percent: number) => {
    const isPositive = change > 0;
    return (
      <span
        className={`flex items-center gap-1 ${
          isPositive ? "text-green-400" : "text-red-400"
        }`}
      >
        {isPositive ? (
          <TrendingUp className="w-3 h-3" />
        ) : (
          <TrendingDown className="w-3 h-3" />
        )}
        +{formatPrice(change)} (+{percent}%)
      </span>
    );
  };

  return (
    <div className="pb-20">
      {/* Price Section */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3 border-custom-black bg-custom-slate">
          <div className="min-w-16 h-20 relative rounded-lg flex items-center justify-center">
            <Image
              src="/chatbot.png"
              alt="example"
              width={60}
              height={60}
              className="object-contain mx-auto"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="w-7/12">
                <h3 className="text-2xl font-medium text-white">
                  아모레퍼시픽
                </h3>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">
              ₩{formatPrice(sculptureData.currentPrice)}
            </div>
            <div className="text-sm">
              {formatChange(sculptureData.change, sculptureData.changePercent)}
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="text-gray-400">
                  <Search className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-1">
                {["30M", "1H", "1D", "1W", "1M", "1Y"].map((timeframe) => (
                  <Button
                    key={timeframe}
                    variant={
                      selectedTimeframe === timeframe ? "default" : "ghost"
                    }
                    size="sm"
                    className={`text-xs px-2 py-1 ${
                      selectedTimeframe === timeframe
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setSelectedTimeframe(timeframe)}
                  >
                    {timeframe}
                  </Button>
                ))}
              </div>
            </div>
            <div className="h-48 bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-gray-400 text-sm">
                차트 영역 (EChart 구현 예정)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Tabs - Order Book & Auction */}
        <Card className="bg-gray-900 border-gray-800">
          <Tabs
            value={activeInfoTab}
            onValueChange={setActiveInfoTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger
                value="orderbook"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-blue-400"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                호가창
              </TabsTrigger>
              <TabsTrigger
                value="auction"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-blue-400"
              >
                <Gavel className="w-4 h-4 mr-2" />
                경매/투표
              </TabsTrigger>
            </TabsList>

            {/* Order Book Content */}
            <TabsContent value="orderbook" className="mt-0 p-4">
              <div className="space-y-3">
                {/* Asks (매도) */}
                <div className="space-y-1">
                  <div className="text-xs text-red-400 font-semibold mb-2">
                    매도 호가
                  </div>
                  {orderBookData.asks.reverse().map((ask, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-1 px-2 bg-red-950/20 rounded"
                    >
                      <span className="text-red-400 text-sm">
                        ₩{formatPrice(ask.price)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {ask.quantity}
                      </span>
                      <span className="text-xs text-gray-500">
                        ₩{formatPrice(ask.total)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Spread */}
                <div className="text-center py-2 border-y border-gray-800">
                  <span className="text-xs text-gray-400">
                    스프레드: ₩
                    {formatPrice(
                      sculptureData.lowestAsk - sculptureData.highestBid
                    )}
                  </span>
                </div>

                {/* Bids (매수) */}
                <div className="space-y-1">
                  <div className="text-xs text-green-400 font-semibold mb-2">
                    매수 호가
                  </div>
                  {orderBookData.bids.map((bid, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-1 px-2 bg-green-950/20 rounded"
                    >
                      <span className="text-green-400 text-sm">
                        ₩{formatPrice(bid.price)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {bid.quantity}
                      </span>
                      <span className="text-xs text-gray-500">
                        ₩{formatPrice(bid.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Auction Content */}
            <TabsContent value="auction" className="mt-0 p-4">
              <div className="space-y-4">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold">현재 최고가</span>
                      <Badge variant="secondary" className="bg-yellow-600">
                        진행중
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-yellow-400 mb-2">
                      ₩{formatPrice(sculptureData.highestBid)}
                    </div>
                    <div className="text-xs text-gray-400 mb-4">
                      종료까지 2시간 4분 32초
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                      <Users className="w-4 h-4" />
                      <span>참여자 24명</span>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                          입찰하기
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-gray-700 text-white">
                        <DialogHeader>
                          <DialogTitle>경매 입찰</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="bid-amount">입찰가 (₩)</Label>
                            <Input
                              id="bid-amount"
                              placeholder="2,900,000"
                              className="bg-gray-800 border-gray-700"
                            />
                          </div>
                          <div>
                            <Label htmlFor="bid-comment">코멘트 (선택)</Label>
                            <Textarea
                              id="bid-comment"
                              placeholder="입찰 이유를 적어주세요..."
                              className="bg-gray-800 border-gray-700"
                            />
                          </div>
                          <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                            입찰 확인
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                {/* Recent Bids */}
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-300">
                    최근 입찰 내역
                  </div>
                  {[
                    { user: "Collector123", amount: 2850000, time: "1분 전" },
                    { user: "ArtLover", amount: 2800000, time: "5분 전" },
                    { user: "InvestorPro", amount: 2750000, time: "12분 전" },
                  ].map((bid, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 px-3 bg-gray-800 rounded"
                    >
                      <div>
                        <div className="text-sm font-medium text-blue-400">
                          @{bid.user}
                        </div>
                        <div className="text-xs text-gray-400">{bid.time}</div>
                      </div>
                      <div className="text-sm font-semibold text-yellow-400">
                        ₩{formatPrice(bid.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-4">
        <div className="flex gap-3">
          {/* Buy Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3">
                <ShoppingCart className="w-4 h-4 mr-2" />
                구매
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>구매 주문</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="buy-price">가격 (₩)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="px-3 border-gray-600 text-gray-400 hover:text-white bg-transparent"
                      onClick={() => setBuyPrice(adjustPrice(buyPrice, "down"))}
                    >
                      -
                    </Button>
                    <Input
                      id="buy-price"
                      value={formatPrice(buyPrice)}
                      onChange={(e) =>
                        handlePriceInput(e.target.value, setBuyPrice)
                      }
                      className="bg-gray-800 border-gray-700 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="px-3 border-gray-600 text-gray-400 hover:text-white bg-transparent"
                      onClick={() => setBuyPrice(adjustPrice(buyPrice, "up"))}
                    >
                      +
                    </Button>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    호가단위: ₩{formatPrice(getTickSize(buyPrice))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="buy-quantity">수량</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="px-3 border-gray-600 text-gray-400 hover:text-white bg-transparent"
                      onClick={() =>
                        setBuyQuantity(Math.max(1, buyQuantity - 1))
                      }
                    >
                      -
                    </Button>
                    <Input
                      id="buy-quantity"
                      type="number"
                      min="1"
                      value={buyQuantity}
                      onChange={(e) =>
                        setBuyQuantity(
                          Math.max(1, Number.parseInt(e.target.value) || 1)
                        )
                      }
                      className="bg-gray-800 border-gray-700 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="px-3 border-gray-600 text-gray-400 hover:text-white bg-transparent"
                      onClick={() => setBuyQuantity(buyQuantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">총 주문금액</span>
                    <span className="font-semibold">
                      ₩{formatPrice(buyPrice * buyQuantity)}
                    </span>
                  </div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  구매 주문 확인
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Sell Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent font-semibold py-3"
              >
                판매
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>판매 주문</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-blue-950/30 p-3 rounded-lg border border-blue-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-400">보유 수량</span>
                    <span className="font-semibold text-blue-400">
                      {ownedQuantity}개
                    </span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="sell-price">가격 (₩)</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="px-3 border-gray-600 text-gray-400 hover:text-white bg-transparent"
                      onClick={() =>
                        setSellPrice(adjustPrice(sellPrice, "down"))
                      }
                    >
                      -
                    </Button>
                    <Input
                      id="sell-price"
                      value={formatPrice(sellPrice)}
                      onChange={(e) =>
                        handlePriceInput(e.target.value, setSellPrice)
                      }
                      className="bg-gray-800 border-gray-700 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="px-3 border-gray-600 text-gray-400 hover:text-white bg-transparent"
                      onClick={() => setSellPrice(adjustPrice(sellPrice, "up"))}
                    >
                      +
                    </Button>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    호가단위: ₩{formatPrice(getTickSize(sellPrice))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="sell-quantity">수량</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="px-3 border-gray-600 text-gray-400 hover:text-white bg-transparent"
                      onClick={() =>
                        setSellQuantity(Math.max(1, sellQuantity - 1))
                      }
                    >
                      -
                    </Button>
                    <Input
                      id="sell-quantity"
                      type="number"
                      min="1"
                      max={ownedQuantity}
                      value={sellQuantity}
                      onChange={(e) => {
                        const value = Math.min(
                          ownedQuantity,
                          Math.max(1, Number.parseInt(e.target.value) || 1)
                        );
                        setSellQuantity(value);
                      }}
                      className="bg-gray-800 border-gray-700 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="px-3 border-gray-600 text-gray-400 hover:text-white bg-transparent"
                      onClick={() =>
                        setSellQuantity(
                          Math.min(ownedQuantity, sellQuantity + 1)
                        )
                      }
                    >
                      +
                    </Button>
                  </div>
                  {sellQuantity > ownedQuantity && (
                    <div className="text-xs text-red-400 mt-1">
                      보유 수량을 초과할 수 없습니다.
                    </div>
                  )}
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">총 판매금액</span>
                    <span className="font-semibold">
                      ₩{formatPrice(sellPrice * sellQuantity)}
                    </span>
                  </div>
                </div>
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={sellQuantity > ownedQuantity}
                >
                  판매 주문 확인
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Community Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>커뮤니티</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {communityPosts.map((post) => (
                  <Card key={post.id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-semibold text-blue-400">
                          @{post.user}
                        </span>
                        <span className="text-xs text-gray-500">
                          {post.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500">
                          ❤️ {post.likes}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <div className="pt-4 border-t border-gray-700">
                  <Textarea
                    placeholder="의견을 남겨보세요..."
                    className="bg-gray-800 border-gray-700 mb-3"
                  />
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    게시하기
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
