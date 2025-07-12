import { MarketPriceData } from '@/types/ProductTypes';

const MARKET_DATA_PREFIX = 'market_data_';
const LAST_UPDATE_PREFIX = 'last_update_';

interface StoredMarketData {
  data: MarketPriceData;
  timestamp: number;
  date: string; // YYYY-MM-DD 형식
}

export const marketStorage = {
  // 전일 데이터 저장
  saveMarketData: (productUuid: string, marketData: MarketPriceData) => {
    try {
      if (typeof window === 'undefined') return;

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const storedData: StoredMarketData = {
        data: marketData,
        timestamp: Date.now(),
        date: today,
      };

      console.log('Saving market data:', { productUuid, storedData });

      localStorage.setItem(
        `${MARKET_DATA_PREFIX}${productUuid}`,
        JSON.stringify(storedData)
      );

      // 마지막 업데이트 시간 저장
      localStorage.setItem(
        `${LAST_UPDATE_PREFIX}${productUuid}`,
        Date.now().toString()
      );

      console.log('Market data saved successfully');
    } catch (error) {
      console.error('Failed to save market data to localStorage:', error);
    }
  },

  // 저장된 데이터 불러오기
  getMarketData: (productUuid: string): MarketPriceData | null => {
    try {
      if (typeof window === 'undefined') return null;

      const stored = localStorage.getItem(
        `${MARKET_DATA_PREFIX}${productUuid}`
      );
      console.log('Getting market data for:', productUuid, 'stored:', stored);

      if (!stored) {
        console.log('No stored data found');
        return null;
      }

      const storedData: StoredMarketData = JSON.parse(stored);
      const today = new Date().toISOString().split('T')[0];

      console.log('Stored data:', storedData, 'Today:', today);

      // 데이터가 24시간 이내인지 확인
      const dataAge = Date.now() - storedData.timestamp;
      const oneDay = 24 * 60 * 60 * 1000; // 24시간 (밀리초)

      if (dataAge < oneDay) {
        console.log('Returning cached data (within 24 hours)');
        return storedData.data;
      }

      console.log('Data is too old, not returning cached data');
      return null;
    } catch (error) {
      console.error('Failed to get market data from localStorage:', error);
      return null;
    }
  },

  // 마지막 업데이트 시간 확인
  getLastUpdateTime: (productUuid: string): number | null => {
    try {
      if (typeof window === 'undefined') return null;

      const timestamp = localStorage.getItem(
        `${LAST_UPDATE_PREFIX}${productUuid}`
      );
      return timestamp ? parseInt(timestamp) : null;
    } catch (error) {
      console.error('Failed to get last update time:', error);
      return null;
    }
  },

  // 데이터가 최신인지 확인 (1시간 이내)
  isDataRecent: (productUuid: string): boolean => {
    if (typeof window === 'undefined') return false;

    const lastUpdate = marketStorage.getLastUpdateTime(productUuid);
    if (!lastUpdate) return false;

    const oneHour = 60 * 60 * 1000; // 1시간 (밀리초)
    return Date.now() - lastUpdate < oneHour;
  },

  // 현재 시간이 거래 시간인지 확인 (9시 ~ 15시 30분)
  isMarketOpen: (): boolean => {
    if (typeof window === 'undefined') return false;

    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour * 100 + minute;

    // 9:00 ~ 15:30 (900 ~ 1530)
    return currentTime >= 900 && currentTime <= 1530;
  },
};
