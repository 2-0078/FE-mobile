import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { tag } = await request.json();

    if (!tag) {
      return NextResponse.json({ error: 'Tag is required' }, { status: 400 });
    }

    //console.log('Revalidating tag:', tag);
    revalidateTag(tag);

    return NextResponse.json({ success: true, revalidated: tag });
  } catch (error) {
    console.error('Error revalidating tag:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
