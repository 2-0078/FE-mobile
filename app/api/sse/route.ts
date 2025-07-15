import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const memberUuid = searchParams.get('memberUuid');

  const baseUrl = process.env.BASE_API_URL || 'https://api.pieceofcake.site';
  const sseUrl = memberUuid
    ? `${baseUrl}/alert-service/api/v1/alert/stream/new?memberUuid=${memberUuid}`
    : `${baseUrl}/alert-service/api/v1/alert/stream/new`;

  console.log('Proxying SSE request to:', sseUrl);

  try {
    const response = await fetch(sseUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'User-Agent': 'PieceOfCake-Mobile/1.0',
      },
    });

    if (!response.ok) {
      console.error(
        'SSE endpoint returned error:',
        response.status,
        response.statusText
      );
      return new Response(`SSE endpoint error: ${response.status}`, {
        status: response.status,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache',
        },
      });
    }

    // Return the response directly with SSE headers
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Cache-Control, Content-Type',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  } catch (error) {
    console.error('SSE proxy error:', error);
    return new Response(
      `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Cache-Control, Content-Type',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
