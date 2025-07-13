import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // pieceUuid는 향후 실제 API 호출 시 사용 예정

    // TODO: 실제 API 호출로 교체
    // const response = await fetch(`${process.env.BASE_API_URL}/trading-service/api/v1/history/${pieceUuid}`);
    // const data = await response.json();

    // 현재는 기본 데이터 반환
    const mockData = [
      {
        time: '14:30:25',
        price: 14500,
        quantity: 5,
        type: 'buy',
        totalAmount: 72500,
      },
      {
        time: '14:29:18',
        price: 14450,
        quantity: 3,
        type: 'sell',
        totalAmount: 43350,
      },
      {
        time: '14:28:42',
        price: 14500,
        quantity: 8,
        type: 'buy',
        totalAmount: 116000,
      },
      {
        time: '14:27:15',
        price: 14400,
        quantity: 12,
        type: 'sell',
        totalAmount: 172800,
      },
      {
        time: '14:26:33',
        price: 14550,
        quantity: 6,
        type: 'buy',
        totalAmount: 87300,
      },
      {
        time: '14:25:47',
        price: 14450,
        quantity: 4,
        type: 'sell',
        totalAmount: 57800,
      },
      {
        time: '14:24:12',
        price: 14500,
        quantity: 10,
        type: 'buy',
        totalAmount: 145000,
      },
      {
        time: '14:23:28',
        price: 14400,
        quantity: 7,
        type: 'sell',
        totalAmount: 100800,
      },
      {
        time: '14:22:55',
        price: 14550,
        quantity: 9,
        type: 'buy',
        totalAmount: 130950,
      },
      {
        time: '14:21:33',
        price: 14450,
        quantity: 15,
        type: 'sell',
        totalAmount: 216750,
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockData,
    });
  } catch (error) {
    console.error('Error fetching trading history:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch trading history' },
      { status: 500 }
    );
  }
}
