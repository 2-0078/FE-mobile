'use server';

import {
  MarketPriceResponse,
  QoutesResponse,
  OrderBookResponse,
  PeriodMarketPriceResponse,
  RealTimePriceResponse,
} from '@/types/ProductTypes';

const API_BASE_URL = 'https://api.pieceofcake.site';

export async function getMarketPrice(
  pieceProductUuid: string
): Promise<MarketPriceResponse | null> {
  try {
    //console.log('Fetching market price for:', pieceProductUuid);

    const response = await fetch(
      `${API_BASE_URL}/real-time-data-service/api/v1/kis-api/market-price/${pieceProductUuid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          tags: [`market-data-${pieceProductUuid}`],
        },
      }
    );

    //console.log('Response status:', response.status);
    //console.log('Response ok:', response.ok);

    if (!response.ok) {
      console.error('Failed to fetch market price:', response.status);
      return null;
    }

    const data: MarketPriceResponse = await response.json();
    //console.log('API response data market price:', data);

    return data;
  } catch (error) {
    console.error('Error fetching market price:', error);
    return null;
  }
}

export async function getQoutes(
  pieceProductUuid: string
): Promise<QoutesResponse | null> {
  try {
    //console.log('Fetching qoutes for:', pieceProductUuid);

    const response = await fetch(
      `${API_BASE_URL}/real-time-data-service/api/v1/kis-api/quotes/${pieceProductUuid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          tags: [`qoutes-${pieceProductUuid}`],
        },
      }
    );

    const data: QoutesResponse = await response.json();
    //console.log('API response data qoutes:', data);

    return data;
  } catch (error) {
    console.error('Error fetching qoutes:', error);
    return null;
  }
}

// 호가 데이터 가져오기
export async function getOrderBook(
  pieceProductUuid: string
): Promise<OrderBookResponse | null> {
  try {
    //console.log('Fetching order book for:', pieceProductUuid);

    const response = await fetch(
      `${API_BASE_URL}/real-time-data-service/api/v1/kis-api/orderbook/${pieceProductUuid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          tags: [`orderbook-${pieceProductUuid}`],
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch order book:', response.status);
      return null;
    }

    const data: OrderBookResponse = await response.json();
    //console.log('API response data order book:', data);

    return data;
  } catch (error) {
    console.error('Error fetching order book:', error);
    return null;
  }
}

// 기간별 시세 데이터 가져오기 (실제 API 엔드포인트 사용)
export async function getPeriodMarketPrices(
  pieceProductUuid: string,
  startDate: string,
  endDate: string,
  divCode: string = '1'
): Promise<PeriodMarketPriceResponse | null> {
  try {
    //console.log(
      'Fetching period market prices for:',
      pieceProductUuid,
      'from',
      startDate,
      'to',
      endDate
    );

    const response = await fetch(
      `${API_BASE_URL}/real-time-data-service/api/v1/kis-api/period/${pieceProductUuid}?startDate=${startDate}&endDate=${endDate}&divCode=${divCode}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          tags: [`period-prices-${pieceProductUuid}-${startDate}-${endDate}`],
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch period market prices:', response.status);
      return null;
    }

    const data: PeriodMarketPriceResponse = await response.json();
    //console.log('API response data period market prices:', data);

    return data;
  } catch (error) {
    console.error('Error fetching period market prices:', error);
    return null;
  }
}

// 기간별 시세 데이터 가져오기 (기존 함수명 유지, 내부적으로 새로운 API 사용)
export async function getHistoricalPrices(
  pieceProductUuid: string,
  period: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' = '1D'
): Promise<PeriodMarketPriceResponse | null> {
  try {
    // 기간에 따른 날짜 계산
    const endDate = new Date();
    let startDate = new Date();

    switch (period) {
      case '1D':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case '1W':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '1M':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case '3M':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case '6M':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    // 날짜를 YYYYMMDD 형식으로 변환
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    };

    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);

    //console.log(
      'Fetching historical prices for:',
      pieceProductUuid,
      'period:',
      period,
      'from',
      startDateStr,
      'to',
      endDateStr
    );

    return await getPeriodMarketPrices(
      pieceProductUuid,
      startDateStr,
      endDateStr
    );
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    return null;
  }
}

// 실시간 시세 데이터 가져오기
export async function getRealTimePrice(
  pieceProductUuid: string
): Promise<RealTimePriceResponse | null> {
  try {
    //console.log('Fetching real-time price for:', pieceProductUuid);

    const response = await fetch(
      `${API_BASE_URL}/real-time-data-service/api/v1/kis-api/real-time-price/${pieceProductUuid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          tags: [`realtime-price-${pieceProductUuid}`],
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch real-time price:', response.status);
      return null;
    }

    const data: RealTimePriceResponse = await response.json();
    //console.log('API response data real-time price:', data);

    return data;
  } catch (error) {
    console.error('Error fetching real-time price:', error);
    return null;
  }
}

// 전날 업데이트된 마지막 호가 데이터 가져오기
export async function getPreviousDayQuotes(
  pieceProductUuid: string
): Promise<QoutesResponse | null> {
  try {
    //console.log('Fetching previous day quotes for:', pieceProductUuid);

    const response = await fetch(
      `${API_BASE_URL}/real-time-data-service/api/v1/kis-api/quotes/${pieceProductUuid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          tags: [`previous-day-quotes-${pieceProductUuid}`],
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch previous day quotes:', response.status);
      return null;
    }

    const data: QoutesResponse = await response.json();
    //console.log('API response data previous day quotes:', data);

    return data;
  } catch (error) {
    console.error('Error fetching previous day quotes:', error);
    return null;
  }
}
