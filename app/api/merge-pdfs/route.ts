import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();

  console.log('Received POST data:', body);

  return NextResponse.json({
    success: true,
    message: 'POST request received',
    data: body,
  });
}
