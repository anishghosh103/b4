/**
 * NextAuth-Compatible Auth Helpers
 *
 * Provides drop-in replacements for the existing requireAuth and optionalAuth middleware.
 * Maintains the same AuthData interface to avoid breaking existing API routes.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../auth';
import { UnauthorizedError } from '../errors/AppError';
import { IUser, User } from '../models/User';

/**
 * Auth data returned by helpers (same interface as old middleware)
 */
export interface AuthData {
  user: IUser | null;
  isAuthenticated: boolean;
}

/**
 * Get auth data from NextAuth session
 * Fetches the full user document from MongoDB to include creditBalance and other fields
 */
export async function getAuthData(request: NextRequest): Promise<AuthData> {
  // Get session from NextAuth
  const session = await auth();

  if (!session?.user?.id) {
    // No session - return guest session data
    return {
      user: null,
      isAuthenticated: false,
    };
  }

  // Fetch full user document (with creditBalance, etc.)
  const user = await User.findById(session.user.id);

  return {
    user,
    isAuthenticated: !!user,
  };
}

/**
 * Route handler wrapper that requires authentication
 * Drop-in replacement for the old requireAuth middleware
 */
export function requireAuth<T = unknown>(
  handler: (
    request: NextRequest,
    user: IUser,
    context: T
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest, context: T): Promise<NextResponse> => {
    const authData = await getAuthData(request);

    if (!authData.isAuthenticated || !authData.user) {
      throw new UnauthorizedError('Authentication required');
    }

    return handler(request, authData.user, context);
  };
}

/**
 * Route handler wrapper with optional authentication
 * Drop-in replacement for the old optionalAuth middleware
 */
export function optionalAuth<T = unknown>(
  handler: (
    request: NextRequest,
    authData: AuthData,
    context: T
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest, context: T): Promise<NextResponse> => {
    const authData = await getAuthData(request);
    return handler(request, authData, context);
  };
}
