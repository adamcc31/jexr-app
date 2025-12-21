import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';

/**
 * Server-side logout API route
 * 
 * Clears httpOnly auth cookies (which can't be cleared client-side)
 * and redirects to login page.
 */
export async function GET(request: NextRequest) {
    const cookieStore = await cookies();

    // Clear authentication cookies
    cookieStore.delete('auth_token');
    cookieStore.delete('api_token');
    cookieStore.delete('user_role');

    // Redirect to login
    redirect('/login');
}
