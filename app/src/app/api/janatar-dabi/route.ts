import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import type {
  IssueType,
  IssueVotes,
  JanatarDabiData,
  VoteResponse,
  ISSUE_KEYS,
} from '@/types/janatar-dabi';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'janatar-dabi-votes.json');

const DEFAULT_VOTES: IssueVotes = {
  mosquitos: 0,
  water_logging: 0,
  traffic: 0,
  extortion: 0,
  bad_roads: 0,
  load_shedding: 0,
};

const VALID_ISSUES: IssueType[] = [
  'mosquitos',
  'water_logging',
  'traffic',
  'extortion',
  'bad_roads',
  'load_shedding',
];

async function readVotesData(): Promise<JanatarDabiData> {
  try {
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(fileContent);
  } catch {
    // If file doesn't exist, return default structure
    return {
      metadata: {
        created_at: new Date().toISOString().split('T')[0],
        description: 'Janatar Dabi - People\'s Demands voting data',
      },
      constituencies: {},
    };
  }
}

async function writeVotesData(data: JanatarDabiData): Promise<void> {
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// GET /api/janatar-dabi?constituency_id=1
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const constituencyId = searchParams.get('constituency_id');

  if (!constituencyId) {
    return NextResponse.json(
      { error: 'constituency_id is required' },
      { status: 400 }
    );
  }

  try {
    const data = await readVotesData();
    const votes = data.constituencies[constituencyId] || { ...DEFAULT_VOTES };

    return NextResponse.json({
      success: true,
      constituency_id: constituencyId,
      votes,
    });
  } catch (error) {
    console.error('Error reading votes:', error);
    return NextResponse.json(
      { error: 'Failed to read votes' },
      { status: 500 }
    );
  }
}

// POST /api/janatar-dabi
// Body: { constituency_id: string, issue: IssueType }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { constituency_id, issue } = body;

    if (!constituency_id) {
      return NextResponse.json(
        { error: 'constituency_id is required' },
        { status: 400 }
      );
    }

    if (!issue || !VALID_ISSUES.includes(issue as IssueType)) {
      return NextResponse.json(
        { error: 'Valid issue type is required' },
        { status: 400 }
      );
    }

    const data = await readVotesData();

    // Initialize constituency if it doesn't exist
    if (!data.constituencies[constituency_id]) {
      data.constituencies[constituency_id] = { ...DEFAULT_VOTES };
    }

    // Increment the vote count
    data.constituencies[constituency_id][issue as IssueType]++;

    // Save the updated data
    await writeVotesData(data);

    const response: VoteResponse = {
      success: true,
      votes: data.constituencies[constituency_id],
      message: 'Vote recorded successfully',
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error recording vote:', error);
    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    );
  }
}
