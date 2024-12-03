import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { pageId, isFavorite } = await request.json();

    const updatedPage = await prisma.page.update({
      where: { id: pageId },
      data: { isFavorite },
    });

    return NextResponse.json(updatedPage, { status: 200 });
  } catch (error) {
    console.error('Error updating favorite status:', error);
    return NextResponse.json({ error: 'Failed to update favorite status' }, { status: 500 });
  }
}
