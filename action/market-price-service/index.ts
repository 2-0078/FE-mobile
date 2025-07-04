'use server';

import { MarketPriceResponse } from '@/types/ProductTypes';

const API_BASE_URL = 'https://api.pieceofcake.site';

export async function getMarketPrice(
  productUuid: string
): Promise<MarketPriceResponse | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/real-time-data-service/api/v1/kis-api/market-price/${productUuid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch market price:', response.status);
      return null;
    }

    const data: MarketPriceResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching market price:', error);
    return null;
  }
}
