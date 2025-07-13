import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.memberUuid) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { memberUuid } = session.user;
    const token = session?.user?.accessToken;
    const body = await request.json();

    const response = await fetch(
      `${process.env.BASE_API_URL}/trading-service/api/v1/order/${body.type}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Member-Uuid': memberUuid,
        },
        body: JSON.stringify({
          pieceUuid: body.pieceUuid,
          quantity: body.quantity,
          price: body.price,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || '주문 처리 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Trading order error:', error);
    return NextResponse.json(
      { error: '주문 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
