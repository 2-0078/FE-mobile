import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pieceUuid: string }> }
) {
  const { pieceUuid } = await params;

  const baseUrl = process.env.BASE_API_URL || 'https://api.pieceofcake.site';
  const sseUrl = `${baseUrl}/real-time-data-service/api/v1/kis-api/stream/quotes-update/${pieceUuid}`;

  //console.log('Proxying SSE quotes request to:', sseUrl);

  try {
    const response = await fetch(sseUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      console.error('SSE quotes endpoint returned error:', response.status);
      return new Response('SSE quotes endpoint error', {
        status: response.status,
      });
    }

    // Return the response directly with SSE headers
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });
  } catch (error) {
    console.error('SSE quotes proxy error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
