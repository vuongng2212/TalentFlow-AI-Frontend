import { NextResponse } from 'next/server';
import { getJobs } from '../../../services/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || undefined;
  const status = searchParams.get('status') || undefined;

  const jobs = await getJobs(search, status);
  return NextResponse.json(jobs);
}
