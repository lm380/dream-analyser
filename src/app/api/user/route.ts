import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '../../../../lib/prisma';

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const user: object | null = await prisma.user.findUnique({
    where: {
      email: session.user?.email || '',
    },
    select: {
      email: true,
      name: true,
      dreams: true,
      lifeContext: true,
    },
  });

  return NextResponse.json(user, { status: 200 });
}
