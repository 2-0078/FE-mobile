import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const memberUuid = searchParams.get('memberUuid');

  const baseUrl = process.env.BASE_API_URL || 'https://api.pieceofcake.site';
  const sseUrl = memberUuid
    ? `${baseUrl}/alert-service/api/v1/alert/stream/new?memberUuid=${memberUuid}`
    : `${baseUrl}/alert-service/api/v1/alert/stream/new`;

  //console.log('Proxying SSE request to:', sseUrl);

  try {
    const response = await fetch(sseUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      console.error('SSE endpoint returned error:', response.status);
      return new Response('SSE endpoint error', { status: response.status });
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
    console.error('SSE proxy error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
