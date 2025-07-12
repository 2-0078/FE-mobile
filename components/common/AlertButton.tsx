'use client';

import React, { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import AlertIcon from '@/repo/ui/Icons/AlertIcon';

interface AlertData {
  key: string;
  message: string;
  alertType: string;
  memberUuid?: string;
  commonAlert: boolean;
}

export default function AlertButton() {
  const { data: session } = useSession();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    const connectSSE = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const memberUuid = session?.user?.memberUuid;
      const url = memberUuid ? `/api/sse?memberUuid=${memberUuid}` : '/api/sse';

      console.log('Connecting to SSE with URL:', url);
      eventSourceRef.current = new EventSource(url);

      // Reset reconnection attempts on successful connection
      reconnectAttemptsRef.current = 0;

      eventSourceRef.current.onopen = () => {
        console.log('SSE connection opened');
      };

      eventSourceRef.current.onmessage = (event) => {
        try {
          const alertData: AlertData = JSON.parse(event.data);
          console.log('Received alert:', alertData);

          // Handle different alert types
          handleAlert(alertData);
        } catch (error) {
          console.error('Failed to parse alert data:', error);
        }
      };

      eventSourceRef.current.onerror = (error) => {
        console.error('SSE connection error:', error);
        console.error(
          'SSE connection state:',
          eventSourceRef.current?.readyState
        );

        // Check if the connection was closed
        if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            console.log(
              `SSE connection closed, attempting to reconnect... (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`
            );
            reconnectAttemptsRef.current++;

            // Clear existing timeout
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
            }

            // Exponential backoff: 5s, 10s, 20s, 40s, 80s
            const delay = Math.min(
              5000 * Math.pow(2, reconnectAttemptsRef.current - 1),
              30000
            );
            reconnectTimeoutRef.current = setTimeout(() => {
              connectSSE();
            }, delay);
          } else {
            console.log(
              'Max reconnection attempts reached, stopping reconnection'
            );
          }
        }
      };
    };

    // Only connect if we have a session or if we want to receive common alerts
    if (session !== undefined) {
      connectSSE();
    }

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [session?.user?.memberUuid, session]);

  const handleAlert = async (alertData: AlertData) => {
    const { alertType, key } = alertData;

    try {
      let tagToRevalidate: string | null = null;

      switch (alertType) {
        case 'PIECE_PRICE_CHANGE':
          // Revalidate market data for piece products
          tagToRevalidate = `qoutes-${key}`;
          console.log(`Revalidating qoutes data for product: ${key}`);
          break;

        case 'FUNDING_START':
        case 'FUNDING_END':
        case 'FUNDING_COUNT_CHANGE':
          // Revalidate funding data
          tagToRevalidate = `funding-${key}`;
          console.log(`Revalidating funding data: ${alertType} for ${key}`);
          break;

        case 'PRODUCT_STATUS_CHANGE':
          // Revalidate product data
          tagToRevalidate = `product-${key}`;
          console.log(`Revalidating product data: ${alertType} for ${key}`);
          break;

        case 'FUNDING_SUCCESS':
        case 'PIECE_SELL_SUCCESS':
        case 'PIECE_BUY_SUCCESS':
          // Revalidate user-specific data
          tagToRevalidate = `user-transactions-${session?.user?.memberUuid}`;
          console.log(`Revalidating user transactions: ${alertType}`);
          break;

        case 'VOTE_END':
          // Revalidate vote data
          tagToRevalidate = `vote-${key}`;
          console.log(`Revalidating vote data: ${alertType} for ${key}`);
          break;

        case 'AUCTION_END':
        case 'AUCTION_SUCCESS':
          // Revalidate auction data
          tagToRevalidate = `auction-${key}`;
          console.log(`Revalidating auction data: ${alertType} for ${key}`);
          break;

        default:
          console.log(`Unhandled alert type: ${alertType}`);
          return;
      }

      if (tagToRevalidate) {
        // Call the revalidate API endpoint
        const response = await fetch('/api/revalidate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tag: tagToRevalidate }),
        });

        if (response.ok) {
          console.log(`Successfully revalidated tag: ${tagToRevalidate}`);

          // Broadcast the alert to other components for immediate UI update
          window.postMessage(
            {
              type: 'SSE_ALERT',
              data: alertData,
            },
            '*'
          );
        } else {
          console.error(`Failed to revalidate tag: ${tagToRevalidate}`);
        }
      }
    } catch (error) {
      console.error('Failed to handle alert:', error);
    }
  };

  return (
    <div className="absolute top-8 right-5 w-12 h-12 flex items-center justify-center bg-custom-green rounded-full">
      <AlertIcon />
    </div>
  );
}
