import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { LanguageModel } from 'ai';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';
import { generateComponentFromPrompt } from '@/lib/ai/components';

const promptSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
});

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const validatedData = promptSchema.parse(body);

    // Rate limiting check
    const recentUsage = await prisma.aIUsage.findMany({
      where: {
        userId,
        createdAt: {
          gte: new Date(Date.now() - 60 * 1000), // Last minute
        },
      },
    });

    if (recentUsage.length >= 10) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a minute.' },
        { status: 429 }
      );
    }

    // Try to match prompt to component registry first
    const matchedComponent = await generateComponentFromPrompt(
      validatedData.prompt,
      userId
    );

    // If we have a matched component, return it with structured data
    if (matchedComponent) {
      // Log AI usage
      await prisma.aIUsage.create({
        data: {
          userId,
          prompt: validatedData.prompt,
          tokens: 50, // Fixed token count for component generation
        },
      });

      return NextResponse.json({
        component: matchedComponent,
        message: `Generated ${matchedComponent.type} component with real data`,
      });
    }

    // Fall back to AI text generation for non-component prompts
    // Note: @ai-sdk/openai returns LanguageModelV3 but ai@3.x expects LanguageModelV1.
    // The runtime model works correctly; casting is needed for type compatibility.
    const result = await streamText({
      model: openai('gpt-4o-mini') as unknown as LanguageModel,
      system: `You are NeuroFlow's AI assistant. You help users build UI components and provide code suggestions.
      
When users ask for UI components, respond with clear, concise React/Tailwind code examples.
Always use modern React patterns with hooks, TypeScript, and Tailwind CSS.

Available component types you can generate:
- Dashboard widgets (stats cards, charts, activity feeds)
- Forms and input elements
- Navigation components
- Data display tables and lists
- Marketing sections (hero, features, pricing)

Format your responses with clear explanations followed by code blocks when appropriate.`,
      prompt: validatedData.prompt,
      temperature: 0.7,
      maxTokens: 1000,
      tools: {
        getProjects: {
          description: 'Get user projects from database',
          parameters: z.object({}),
          execute: async () => {
            const projects = await prisma.project.findMany({
              where: { userId },
              orderBy: { updatedAt: 'desc' },
              take: 5,
            });
            return projects;
          },
        },
        getNotifications: {
          description: 'Get user notifications',
          parameters: z.object({}),
          execute: async () => {
            const notifications = await prisma.notification.findMany({
              where: { userId },
              orderBy: { createdAt: 'desc' },
              take: 10,
            });
            return notifications;
          },
        },
      },
    });

    // Log AI usage (async, don't block response)
    const resultData = await result;
    resultData.usage
      .then((usage: { totalTokens?: number }) => {
        prisma.aIUsage
          .create({
            data: {
              userId,
              prompt: validatedData.prompt,
              tokens: usage.totalTokens || 0,
            },
          })
          .catch((error: unknown) =>
            logger.error('AI usage logging failed', error)
          );
      })
      .catch((error: unknown) =>
        logger.error('AI usage promise failed', error)
      );

    return result.toDataStreamResponse();
  } catch (error) {
    logger.error('AI API error', error, { action: 'stream' });

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
