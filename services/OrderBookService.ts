export interface OrderBookItem {
  price: number;
  quantity: number;
  total: number;
}

export interface OrderBookData {
  bids: OrderBookItem[];
  asks: OrderBookItem[];
  lastPrice: number;
  change: number;
  changePercent: number;
  spread: number;
  volume: number;
}

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

  private constructor() {}

  static getInstance(): OrderBookService {
    if (!OrderBookService.instance) {
      OrderBookService.instance = new OrderBookService();
    }
    return OrderBookService.instance;
  }

  // Mock data generation for demonstration
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

  async getOrderBook(pieceUuid: string): Promise<OrderBookData> {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/orderbook/${pieceUuid}`);
      // return await response.json();

      // For now, return mock data
      return this.generateMockOrderBook(pieceUuid);
    } catch (error) {
      console.error('Failed to fetch order book:', error);
      throw error;
    }
  }

  subscribeToUpdates(
    pieceUuid: string,
    callback: (data: OrderBookData) => void
  ): () => void {
    const key = `orderbook-${pieceUuid}`;
    this.listeners.set(key, callback);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const data = this.generateMockOrderBook(pieceUuid);
      callback(data);
    }, 2000);

    // Return unsubscribe function
    return () => {
      clearInterval(interval);
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

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

export default OrderBookService;
