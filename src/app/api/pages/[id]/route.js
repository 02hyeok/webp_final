import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    const pageId = parseInt(id, 10);

    if (!pageId) {
      return NextResponse.json({ error: 'Missing page ID' }, { status: 400 });
    }

    await prisma.page.delete({
      where: { id: pageId },
    });

    return NextResponse.json({ message: 'Page deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
