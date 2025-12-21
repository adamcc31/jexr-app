import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function DashboardRoot() {
    const cookieStore = await cookies();
    // extracting role from cookie or a hypothetical 'user_role' cookie
    // In a real app, you would decode the JWT or check a separate cookie
    const role = cookieStore.get('user_role')?.value;

    if (role === 'admin') {
        redirect('/admin');
    } else if (role === 'employer') {
        redirect('/dashboard-employer');
    } else {
        // Default fallback or error page if role is unknown but authenticated
        // For now, let's assume default is employer or redirect to a selection
        redirect('/candidate');
    }
}
