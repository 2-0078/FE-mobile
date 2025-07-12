'use server';

import { MarketPriceResponse, QoutesResponse } from '@/types/ProductTypes';

const API_BASE_URL = 'https://api.pieceofcake.site';

export async function getMarketPrice(
  pieceProductUuid: string
): Promise<MarketPriceResponse | null> {
  try {
    console.log('Fetching market price for:', pieceProductUuid);

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

export async function getQoutes(
  pieceProductUuid: string
): Promise<QoutesResponse | null> {
  try {
    console.log('Fetching qoutes for:', pieceProductUuid);

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
    console.log('API response data qoutes:', data);

    return data;
  } catch (error) {
    console.error('Error fetching qoutes:', error);
    return null;
  }
}
