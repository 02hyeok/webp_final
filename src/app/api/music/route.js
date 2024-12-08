import fs from 'fs';
import path from 'path';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return new Response('No file uploaded', { status: 400 });
  }

  const musicDir = path.join(process.cwd(), 'public', 'music');
  if (!fs.existsSync(musicDir)) {
    fs.mkdirSync(musicDir, { recursive: true });
  }

  const filePath = path.join(musicDir, file.name);
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  fs.writeFileSync(filePath, fileBuffer);

  return new Response(
    JSON.stringify({
      filePath: `/music/${file.name}`,
      fileName: file.name,
    }),
    { status: 200 }
  );
}
