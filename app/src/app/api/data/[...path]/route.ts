import { readFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

import { apiError } from '@/lib/api-utils';

import {
  ALLOWED_DATA_FILES,
  DATA_CACHE_CONTROL,
  DATA_CONTENT_TYPES,
} from '@/constants/api';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: pathSegments } = await params;
  const filename = pathSegments.join('/');

  // Security: Only allow whitelisted files
  if (!ALLOWED_DATA_FILES.has(filename)) {
    return apiError('File not found', { status: 404 });
  }

  try {
    const publicPath = process.cwd();
    const filePath = path.join(publicPath, 'public', 'data', filename);

    const content = await readFile(filePath, 'utf-8');
    const contentType = filename.endsWith('.geojson')
      ? DATA_CONTENT_TYPES.GEOJSON
      : DATA_CONTENT_TYPES.JSON;

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': DATA_CACHE_CONTROL,
      },
    });
  } catch {
    return apiError('File not found', { status: 404 });
  }
}
