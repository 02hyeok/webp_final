import { promises as fs } from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  // 업로드 디렉토리가 없으면 생성
  await fs.mkdir(uploadsDir, { recursive: true });

  const fileName = `${Date.now()}_${file.name}`;
  const filePath = path.join(uploadsDir, fileName);

  await fs.writeFile(filePath, buffer);

  // 사용자 프로필 이미지 업데이트
  const userId = 0;
  await prisma.user.update({
    where: { id: userId },
    data: { profileImage: `/uploads/${fileName}` },
  });

  return NextResponse.json({ message: 'File uploaded successfully', filePath });
}
