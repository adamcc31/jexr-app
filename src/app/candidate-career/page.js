import React from "react";

import Navbar from "../components/navbar";
import Footer from "../components/footer";
import ScrollTop from "../components/scrollTop";

import CandidateHero from "../components/candidate-landing/CandidateHero";
import ProblemAwareness from "../components/candidate-landing/ProblemAwareness";
import SolutionSection from "../components/candidate-landing/SolutionSection";
import JobFocusSection from "../components/candidate-landing/JobFocusSection";
import QualificationSection from "../components/candidate-landing/QualificationSection";
import WhyDifferent from "../components/candidate-landing/WhyDifferent";
import PlacementProcess from "../components/candidate-landing/PlacementProcess";
import CandidateCTA from "../components/candidate-landing/CandidateCTA";

import BreadcrumbSchema from "@/components/JsonLd/BreadcrumbSchema";

export const metadata = {
    title: 'Career Center for Japan-Ready Talents | J Expert Recruitment',
    description: 'Join J Expert Career Center — the trusted partner for former Kenshusei, Japan workers, and Japanese language professionals. Find careers in Japanese-standard companies. 100% FREE service.',
    keywords: 'kenshusei, japan worker, japanese language, jlpt, career center, japan recruitment, indonesia japan, tokutei ginou, sensei, translator, japanese teacher',
    alternates: {
        canonical: '/candidate-career',
    },
    openGraph: {
        title: 'Career Center for Japan-Ready Talents | J Expert Recruitment',
        description: 'Your trusted career partner for finding opportunities in Japanese-standard companies in Indonesia. Specialized matching for Japan-trained professionals. 100% FREE.',
        type: 'website',
        locale: 'en_US',
        siteName: 'J Expert Recruitment',
    },
}

export default function CandidateCareer() {
    return (
        <>
            <BreadcrumbSchema items={[
                { label: 'Home', path: '/' },
                { label: 'Career Center', path: '/candidate-career' }
            ]} />

            <Navbar navClass="defaultscroll sticky" navLight={true} />

            {/* Hero Section */}
            <CandidateHero />

            {/* Wave Divider */}
            <div className="position-relative">
                <div className="shape overflow-hidden text-light">
                    <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>

            {/* Problem Awareness Section */}
            <ProblemAwareness />

            {/* Wave Divider */}
            <div className="position-relative">
                <div className="shape overflow-hidden text-white">
                    <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>

            {/* Solution Section */}
            <SolutionSection />

            {/* Wave Divider */}
            <div className="position-relative">
                <div className="shape overflow-hidden text-light">
                    <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>

            {/* Job Focus Section */}
            <JobFocusSection />

            {/* Wave Divider */}
            <div className="position-relative">
                <div className="shape overflow-hidden text-white">
                    <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>

            {/* Qualification Section */}
            <QualificationSection />

            {/* Wave Divider */}
            <div className="position-relative">
                <div className="shape overflow-hidden text-light">
                    <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>

            {/* Why Different Section */}
            <WhyDifferent />

            {/* Wave Divider */}
            <div className="position-relative">
                <div className="shape overflow-hidden text-white">
                    <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>

            {/* Placement Process Section */}
            <PlacementProcess />

            {/* Final CTA Section */}
            <CandidateCTA />

            <Footer />
            <ScrollTop />
        </>
    )
}
