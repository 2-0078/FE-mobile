'use server';

import { MarketPriceResponse } from '@/types/ProductTypes';

const API_BASE_URL = 'https://api.pieceofcake.site';

export async function getMarketPrice(
  productUuid: string
): Promise<MarketPriceResponse | null> {
  try {
    console.log('Fetching market price for:', productUuid);

    const response = await fetch(
      `${API_BASE_URL}/real-time-data-service/api/v1/kis-api/market-price/${productUuid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          tags: [`market-data-${productUuid}`],
        },
      }
    );

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      console.error('Failed to fetch market price:', response.status);
      return null;
    }

    const data: MarketPriceResponse = await response.json();
    console.log('API response data market price:', data);

    return data;
  } catch (error) {
    console.error('Error fetching market price:', error);
    return null;
  }
}
