/**
 * Error Handler Utility
 *
 * Converts application errors into proper Next.js API responses
 * with appropriate status codes and error messages.
 */

import { Error as MongooseError } from 'mongoose';
import { NextResponse } from 'next/server';
import { AppError, RateLimitError, ValidationError } from '../errors/AppError';
import dbConnect from '../mongodb';

/**
 * Handle API errors and return appropriate NextResponse
 */
export function handleAPIError(error: unknown): NextResponse {
  // Log error for debugging
  console.error('API Error:', error);

  // Handle RateLimitError with Retry-After header
  if (error instanceof RateLimitError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        retryAfter: error.retryAfter,
      },
      {
        status: error.statusCode,
        headers: error.retryAfter
          ? { 'Retry-After': String(error.retryAfter) }
          : undefined,
      }
    );
  }

  // Handle known AppError instances
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        ...(error instanceof ValidationError && { errors: error.errors }),
      },
      { status: error.statusCode }
    );
  }

  // Handle Mongoose validation errors
  if (error instanceof MongooseError.ValidationError) {
    const errors: Record<string, string> = {};
    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        errors,
      },
      { status: 400 }
    );
  }

  // Handle Mongoose CastError (invalid ObjectId, etc.)
  if (error instanceof MongooseError.CastError) {
    return NextResponse.json(
      {
        success: false,
        error: `Invalid ${error.path}: ${error.value}`,
      },
      { status: 400 }
    );
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    // Check for specific error messages
    if (error.message.includes('duplicate key')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Resource already exists',
        },
        { status: 409 } // Conflict
      );
    }

    // Generic error
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }

  // Unknown error type
  return NextResponse.json(
    {
      success: false,
      error: 'An unexpected error occurred',
    },
    { status: 500 }
  );
}

/**
 * Async error wrapper for route handlers
 * Catches errors and passes them to handleAPIError
 */
export function asyncHandler<T extends Request, Context = unknown>(
  handler: (request: T, context: Context) => Promise<NextResponse>
) {
  return async (request: T, context: Context): Promise<NextResponse> => {
    try {
      await dbConnect();
      return await handler(request, context);
    } catch (error) {
      return handleAPIError(error);
    }
  };
}

/**
 * Create a standardized success response
 */
export function successResponse<T = any>(
  data: T,
  status: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Create a standardized error response
 */
export function errorResponse(
  message: string,
  status: number = 400,
  errors?: Record<string, string>
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(errors && { errors }),
    },
    { status }
  );
}
