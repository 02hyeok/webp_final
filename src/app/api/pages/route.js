import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = parseInt(searchParams.get('userId'), 10); 

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    try {
      const pages = await prisma.page.findMany({
        where: { userId },
        orderBy: [
          { isFavorite: "desc" }, 
          { createdAt: 'asc' },
        ],
      });
      return new Response(JSON.stringify(pages), { status: 200 });
    } catch (error) {
      console.error('Error fetching pages:', error);
      return new Response('Failed to fetch pages', { status: 500 });
    }
}
  
export async function POST(request) {
    try {
      const body = await request.json();
      if (!body.title || !body.userId) {
        throw new Error("Missing required fields");
      }

      // 새 페이지 생성
      const newPage = await prisma.page.create({
        data: {
          title: body.title,
          content: body.content || "",
          userId: body.userId,
          folderId: body.folderId || null,
        },
      });

      return NextResponse.json(newPage, { status: 201 });
    } catch (error) {
      console.error('Error creating new page:', error);
      return new Response('Failed to create new page', { status: 500 });
    }
}
  
export async function PUT(request) {
    try {
      const body = await request.json();
      const updatedPage = await prisma.page.update({
        where: { id: body.id },
        data: {
          title: body.title,
          content: body.content,
        },
      });
  
      return new Response(JSON.stringify(updatedPage), { status: 200 });
    } catch (error) {
      console.error('Error updating page:', error);
      return new Response('Failed to update page', { status: 500 });
    }
}