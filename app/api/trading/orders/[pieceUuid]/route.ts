import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { pieceUuid: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.memberUuid) {
      return NextResponse.json({ result: [] }, { status: 200 });
    }

    const { memberUuid } = session.user;
    const token = session?.user?.accessToken;
    const { pieceUuid } = params;

    const response = await fetch(
      `${process.env.BASE_API_URL}/trading-service/api/v1/orders/${pieceUuid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Member-Uuid': memberUuid,
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch order history:', response.status);
      return NextResponse.json({ result: [] }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching order history:', error);
    return NextResponse.json({ result: [] }, { status: 200 });
  }
}
