import { NextResponse } from 'next/server';
import { updateIPFiles } from '@/lib/ipUtils';

export async function GET() {
  try {
    const result = await updateIPFiles();
    return NextResponse.json({
      success: true,
      ...result,
      message: 'IP信息已更新'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}