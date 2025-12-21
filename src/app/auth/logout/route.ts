import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();

    // Clear authentication cookies
    cookieStore.delete('auth_token');
    cookieStore.delete('api_token'); // Client-readable token for API calls
    cookieStore.delete('user_role');

    // Redirect to login
    redirect('/login');
}
