import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pieceUuid: string }> }
) {
  const { pieceUuid } = await params;

  const baseUrl = process.env.BASE_API_URL || 'https://api.pieceofcake.site';
  const sseUrl = `${baseUrl}/real-time-data-service/api/v1/kis-api/stream/quotes-update/${pieceUuid}`;

  console.log('Proxying SSE quotes request to:', sseUrl);

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
        'SSE quotes endpoint returned error:',
        response.status,
        response.statusText
      );
      return new Response(`SSE quotes endpoint error: ${response.status}`, {
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
    console.error('SSE quotes proxy error:', error);
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
