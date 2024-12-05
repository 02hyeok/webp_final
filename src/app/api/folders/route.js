import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const userId = request.cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const folders = await prisma.folder.findMany({
      where: { userId: parseInt(userId, 10) },
      include: {
        pages: true,
      },
    });

    return NextResponse.json(folders, { status: 200 });
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = request.cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    const folder = await prisma.folder.create({
      data: {
        name,
        userId: parseInt(userId, 10),
      },
    });

    return NextResponse.json(folder, { status: 201 });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
  }
}
