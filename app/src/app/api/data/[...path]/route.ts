import { readFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

// Allowed data files to prevent directory traversal attacks
const ALLOWED_FILES = new Set([
  'bd-districts.json',
  'bd-divisions.json',
  'bnp_candidates.json',
  'constituencies.geojson',
  'constituency-infrastructure.json',
  'constituency-voters-2025.json',
  'district-boundaries.json',
  'dot-density-population.json',
  'dot-density-voters.json',
  'jamat_candidate.json',
  'juib_candidates.json',
  'ncp_candidates.json',
]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: pathSegments } = await params;
  const filename = pathSegments.join('/');

  // Security: Only allow whitelisted files
  if (!ALLOWED_FILES.has(filename)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  try {
    // In production, public folder is at the root level
    const publicPath = process.cwd();
    const filePath = path.join(publicPath, 'public', 'data', filename);

    const content = await readFile(filePath, 'utf-8');
    const contentType = filename.endsWith('.geojson')
      ? 'application/geo+json'
      : 'application/json';

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
