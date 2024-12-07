import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    const deletedComment = await prisma.comment.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ message: 'Comment deleted successfully', deletedComment }, { status: 200 });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ error: 'Comment not found or failed to delete' }, { status: 404 });
  }
}
