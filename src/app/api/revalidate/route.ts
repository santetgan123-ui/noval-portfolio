import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    revalidatePath('/');
    revalidatePath('/admin/dashboard');
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error during revalidation';
    return NextResponse.json(
      { revalidated: false, error: message },
      { status: 500 }
    );
  }
}
