/**
 * Contact API Client
 * 
 * API client for public contact form submissions.
 * No authentication required.
 */

import { publicApiClient } from './public-api';

export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface ContactResponse {
    success: boolean;
    message: string;
}

/**
 * Submit contact form to backend API
 * This replaces the old EmailJS implementation
 */
export async function submitContactForm(data: ContactFormData): Promise<ContactResponse> {
    const response = await publicApiClient.post<{ message: string }>('/contact', data);
    return {
        success: true,
        message: response.data.message || 'Your message has been sent successfully!',
    };
}
