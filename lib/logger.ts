/**
 * Centralized error logging utility for NeuroFlow
 *
 * In development: Logs to console for debugging
 * In production: Sends to monitoring service (Sentry, etc.)
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.error('Database connection failed', error);
 */

type ErrorContext = {
  module?: string;
  action?: string;
  userId?: string;
  [key: string]: unknown;
};

export const logger = {
  /**
   * Log errors with context
   * In production, integrate with Sentry/monitoring service
   */
  error: (message: string, error?: unknown, context?: ErrorContext) => {
    // Development: Full error details
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${message}]`, {
        error: error instanceof Error ? error.message : error,
        context,
      });
    }

    // Production: Send to monitoring service
    // Example: Sentry.captureException(error, { tags: context });
  },

  /**
   * Log warnings (non-critical issues)
   */
  warn: (message: string, context?: ErrorContext) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[⚠️ ${message}]`, context);
    }
  },

  /**
   * Log info messages (useful for debugging)
   */
  info: (message: string, context?: ErrorContext) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[ℹ️ ${message}]`, context);
    }
  },
};
