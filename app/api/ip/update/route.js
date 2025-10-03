import { NextResponse } from 'next/server';
import { updateIPFiles } from '@/lib/ipUtils';

export async function POST() {
  try {
    const result = await updateIPFiles();
    return NextResponse.json({
      success: true,
      ...result,
      message: 'IP文件已更新',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}