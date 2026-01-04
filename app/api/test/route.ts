import { successResponse } from '@/lib/utils/controllerHelpers';
import { NextRequest } from 'next/server';

export async function GET() {
  return successResponse(null);
}
export async function POST(req: NextRequest) {
  const payload = await req.json();
  console.log(payload);
  return successResponse(null);
}
