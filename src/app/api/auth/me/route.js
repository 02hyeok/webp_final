import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const userId = request.cookies.get('userId')?.value;

  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId, 10) },
    select: {
      id: true,
      email: true,
      profileImage: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user, { status: 200 });
}
