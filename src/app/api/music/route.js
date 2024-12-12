import fs from 'fs';
import path from 'path';

export async function GET(req) {
  const url = new URL(req.url);
  const pageId = url.searchParams.get('pageId');

  if (!pageId) {
    return new Response('Page ID is required', { status: 400 });
  }

  const musicDir = path.join(process.cwd(), 'public', 'music', pageId);
  if (!fs.existsSync(musicDir)) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  const files = fs.readdirSync(musicDir).map((file) => ({
    name: file,
    path: `/music/${pageId}/${file}`,
  }));

  return new Response(JSON.stringify(files), { status: 200 });
}

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');
  const pageId = formData.get('pageId');

  if (!file || !pageId) {
    return new Response('File and Page ID are required', { status: 400 });
  }

  const musicDir = path.join(process.cwd(), 'public', 'music', pageId);
  if (!fs.existsSync(musicDir)) {
    fs.mkdirSync(musicDir, { recursive: true });
  }

  const filePath = path.join(musicDir, file.name);
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  fs.writeFileSync(filePath, fileBuffer);

  return new Response(
    JSON.stringify({
      filePath: `/music/${pageId}/${file.name}`,
      fileName: file.name,
    }),
    { status: 200 }
  );
}