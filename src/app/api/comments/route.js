import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get('pageId');

  const comments = await prisma.comment.findMany({
    where: { pageId: parseInt(pageId, 10) },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(comments);
}

export async function POST(request) {
  const body = await request.json();
  const { content, pageId, userId } = body;

  const newComment = await prisma.comment.create({
    data: {
      content,
      pageId,
      userId,
    },
  });

  return NextResponse.json(newComment);
}

export async function DELETE(request, { params }) {
  const commentId = parseInt(params.id, 10);

  await prisma.comment.delete({
    where: { id: commentId },
  });

  return NextResponse.json({ success: true });
}
