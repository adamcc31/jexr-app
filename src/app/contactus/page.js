import React from "react";
import ContactUsClient from "./contact-client";
import BreadcrumbSchema from "@/components/JsonLd/BreadcrumbSchema";

export const metadata = {
    title: {
        absolute: 'Contact J Expert | Japan-Ready Talent Recruitment Inquiries',
    },
    description: 'Get in touch with J Expert. We help Japanese companies find the best Indonesian talent and assist candidates in finding their dream jobs.',
    alternates: {
        canonical: '/contactus',
    },
}

export default function ContactUs() {
    return (
        <>
            <BreadcrumbSchema items={[
                { label: 'Home', path: '/' },
                { label: 'Contact Us', path: '/contactus' }
            ]} />
            <ContactUsClient />
        </>
    )
}