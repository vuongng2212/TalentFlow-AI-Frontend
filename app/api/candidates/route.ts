import { NextResponse } from 'next/server';
import { getCandidates } from '../../../services/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || undefined;
  const stage = searchParams.get('stage') || undefined;
  const minScore = searchParams.get('minScore') ? Number(searchParams.get('minScore')) : undefined;

  const candidates = await getCandidates({ search, stage, minScore });
  return NextResponse.json(candidates);
}
