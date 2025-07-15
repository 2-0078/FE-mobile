import { getOrderBook } from '@/action/market-price-service';
import { OrderBookData, OrderBookItem } from '@/types/ProductTypes';
import { RealTimeQuotesData } from '@/types/ProductTypes';
import QuotesStreamService from '@/services/QuotesStreamService';

export interface TradingOrder {
  pieceUuid: string;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  totalAmount: number;
}

class OrderBookService {
  private static instance: OrderBookService;
  private eventSource: EventSource | null = null;
  private listeners: Map<string, (data: OrderBookData) => void> = new Map();
  private quotesService: QuotesStreamService;

  private constructor() {
    this.quotesService = QuotesStreamService.getInstance();
  }

  static getInstance(): OrderBookService {
    if (!OrderBookService.instance) {
      OrderBookService.instance = new OrderBookService();
    }
    return OrderBookService.instance;
  }

  async getOrderBook(pieceUuid: string): Promise<OrderBookData> {
    try {
      const response = await getOrderBook(pieceUuid);

      if (response && response.result) {
        return response.result;
      } else {
        // API 응답이 없거나 실패한 경우 기본 데이터 사용
        return this.generateMockOrderBook(pieceUuid);
      }
    } catch (error) {
      console.error('Failed to fetch order book:', error);
      // 에러 시에도 기본 데이터 반환
      return this.generateMockOrderBook(pieceUuid);
    }
  }

  // Mock data generation for fallback
  private generateMockOrderBook(pieceUuid: string): OrderBookData {
    const basePrice = 50000 + Math.floor(Math.random() * 10000);
    const bids: OrderBookItem[] = [];
    const asks: OrderBookItem[] = [];

    // Generate bid orders (buy orders)
    for (let i = 0; i < 10; i++) {
      const price = basePrice - i * 100;
      const quantity = Math.floor(Math.random() * 100) + 10;
      bids.push({
        price,
        quantity,
        total: price * quantity,
      });
    }

    // Generate ask orders (sell orders)
    for (let i = 0; i < 10; i++) {
      const price = basePrice + i * 100;
      const quantity = Math.floor(Math.random() * 100) + 10;
      asks.push({
        price,
        quantity,
        total: price * quantity,
      });
    }

    const lastPrice = basePrice + Math.floor(Math.random() * 2000) - 1000;
    const change = lastPrice - basePrice;
    const changePercent = (change / basePrice) * 100;
    const spread = asks[0]?.price - bids[0]?.price || 0;
    const volume = Math.floor(Math.random() * 10000) + 1000;

    return {
      bids: bids.sort((a, b) => b.price - a.price), // Highest bid first
      asks: asks.sort((a, b) => a.price - b.price), // Lowest ask first
      lastPrice,
      change,
      changePercent,
      spread,
      volume,
    };
  }

  subscribeToUpdates(
    pieceUuid: string,
    callback: (data: OrderBookData) => void
  ): () => void {
    const key = `orderbook-${pieceUuid}`;
    this.listeners.set(key, callback);

    // SSE를 통한 실시간 업데이트
    const handleQuotesUpdate = (quotesData: RealTimeQuotesData) => {
      const asks: OrderBookItem[] = quotesData.askp
        .map((price, index) => ({
          price,
          quantity: quotesData.askpRsqn[index] || 0,
          total: price * (quotesData.askpRsqn[index] || 0),
        }))
        .filter((item) => item.quantity > 0);

      const bids: OrderBookItem[] = quotesData.bidp
        .map((price, index) => ({
          price,
          quantity: quotesData.bidRsqn[index] || 0,
          total: price * (quotesData.bidRsqn[index] || 0),
        }))
        .filter((item) => item.quantity > 0);

      const spread =
        asks.length > 0 && bids.length > 0 ? asks[0].price - bids[0].price : 0;
      const volume = [...asks, ...bids].reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      const orderBookData: OrderBookData = {
        asks: asks.sort((a, b) => a.price - b.price),
        bids: bids.sort((a, b) => b.price - a.price),
        lastPrice: bids.length > 0 ? bids[0].price : 0,
        change: 0,
        changePercent: 0,
        spread,
        volume,
      };

      callback(orderBookData);
    };

    // SSE 연결
    const disconnect = this.quotesService.connectToQuotesStream(
      pieceUuid,
      handleQuotesUpdate
    );

    // Return unsubscribe function
    return () => {
      disconnect();
      this.listeners.delete(key);
    };
  }

  async placeOrder(
    order: TradingOrder
  ): Promise<{ success: boolean; orderId?: string; message?: string }> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/trading/order', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(order),
      // });
      // return await response.json();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        orderId,
        message: `${order.type === 'buy' ? '매수' : '매도'} 주문이 성공적으로 처리되었습니다.`,
      };
    } catch (error) {
      console.error('Failed to place order:', error);
      return {
        success: false,
        message: '주문 처리 중 오류가 발생했습니다.',
      };
    }
  }

  async getOrderHistory(pieceUuid: string): Promise<TradingOrder[]> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/trading/history/${pieceUuid}`);
      // return await response.json();

      // Return mock data
      return [
        {
          pieceUuid,
          type: 'buy',
          price: 50000,
          quantity: 5,
          totalAmount: 250000,
        },
        {
          pieceUuid,
          type: 'sell',
          price: 52000,
          quantity: 3,
          totalAmount: 156000,
        },
      ];
    } catch (error) {
      console.error('Failed to fetch order history:', error);
      throw error;
    }
  }

  // SSE connection for real-time updates
  connectToSSE(pieceUuid: string): void {
    if (this.eventSource) {
      this.eventSource.close();
    }

    // TODO: Replace with actual SSE endpoint
    // this.eventSource = new EventSource(`/api/sse/orderbook/${pieceUuid}`);

    // For now, we'll use the interval-based approach above
    console.log('SSE connection would be established here');
  }
}

export default OrderBookService;
