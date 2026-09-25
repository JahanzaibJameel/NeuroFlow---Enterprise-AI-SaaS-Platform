import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';

// GET all files for current user
export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    let files: Array<{ id: string; name: string; url: string; size: number; mimeType: string; userId: string; createdAt: Date }> = [];

    try {
      files = await prisma.file.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbError) {
      if (dbError instanceof PrismaClientInitializationError) {
        logger.warn('Database unavailable, returning empty files list', {
          module: 'files-api',
          action: 'GET',
        });
      } else {
        throw dbError;
      }
    }

    return NextResponse.json({ files });
  } catch (error) {
    logger.error('Error fetching files', error, {
      module: 'files-api',
      action: 'GET',
    });
    return NextResponse.json(
      { error: 'Failed to fetch files' },
      { status: 500 }
    );
  }
}

// POST - Create new file record (would be called after Vercel Blob upload)
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, url, size, mimeType } = body;

    if (!name || !url || !size || !mimeType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    try {
      const file = await prisma.file.create({
        data: {
          name,
          url,
          size,
          mimeType,
          userId: session.user.id,
        },
      });

      return NextResponse.json({ file }, { status: 201 });
    } catch (dbError) {
      if (dbError instanceof PrismaClientInitializationError) {
        logger.warn('Database unavailable during file creation', {
          module: 'files-api',
          action: 'POST',
        });
        return NextResponse.json(
          { error: 'Service temporarily unavailable' },
          { status: 503 }
        );
      }
      throw dbError;
    }
  } catch (error) {
    logger.error('Error creating file', error, {
      module: 'files-api',
      action: 'POST',
    });
    return NextResponse.json(
      { error: 'Failed to create file' },
      { status: 500 }
    );
  }
}

// DELETE - Remove file
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 });
    }

    try {
      await prisma.file.delete({
        where: { id },
      });
    } catch (dbError) {
      if (dbError instanceof PrismaClientInitializationError) {
        logger.warn('Database unavailable during file deletion', {
          module: 'files-api',
          action: 'DELETE',
        });
        return NextResponse.json(
          { error: 'Service temporarily unavailable' },
          { status: 503 }
        );
      }
      throw dbError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error deleting file', error, {
      module: 'files-api',
      action: 'DELETE',
    });
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
