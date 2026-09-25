import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    let existingUser = null;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });
    } catch (dbError) {
      // Handle database connection errors gracefully (e.g., during Vercel build)
      if (dbError instanceof PrismaClientInitializationError) {
        logger.warn('Database unavailable during registration check', {
          module: 'auth-api',
          action: 'register',
        });
        // Return a generic error to prevent build failure
        return NextResponse.json(
          { error: 'Service temporarily unavailable' },
          { status: 503 }
        );
      }
      throw dbError;
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    let user;
    try {
      user = await prisma.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          name: validatedData.name,
          role: 'USER',
        },
      });
    } catch (dbError) {
      if (dbError instanceof PrismaClientInitializationError) {
        logger.warn('Database unavailable during user creation', {
          module: 'auth-api',
          action: 'register',
        });
        return NextResponse.json(
          { error: 'Service temporarily unavailable' },
          { status: 503 }
        );
      }
      throw dbError;
    }

    // Create welcome notification
    try {
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Welcome to NeuroFlow!',
          content: 'Get started by exploring the AI Playground.',
        },
      });
    } catch (dbError) {
      // Notification creation failure shouldn't block registration
      if (!(dbError instanceof PrismaClientInitializationError)) {
        logger.warn('Failed to create welcome notification', {
          module: 'auth-api',
          action: 'register',
          error: dbError,
        });
      }
    }

    return NextResponse.json(
      {
        message: 'User created successfully',
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    logger.error('Registration failed', error, {
      module: 'auth-api',
      action: 'register',
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
