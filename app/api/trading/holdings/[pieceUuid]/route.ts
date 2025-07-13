import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pieceUuid: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.memberUuid) {
      return NextResponse.json(null, { status: 200 });
    }

    const { memberUuid } = session.user;
    const token = session?.user?.accessToken;
    const { pieceUuid } = await params;

    const response = await fetch(
      `${process.env.BASE_API_URL}/trading-service/api/v1/holdings/${pieceUuid}`,
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
      console.error('Failed to fetch user holdings:', response.status);
      return NextResponse.json(null, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user holdings:', error);
    return NextResponse.json(null, { status: 200 });
  }
}
