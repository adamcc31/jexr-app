import React from "react";
import Image from "next/image";

import Navbar from "./components/navbar";
import AboutUs from "./components/aboutUs";
import OurServices from "./components/OurServices";
import HowWeWork from "./components/HowWeWork";
import OurMission from "./components/OurMission";
import HighLevelConcept from "./components/HighLevelConcept";
import ClientCTA from "./components/ClientCTA";
import Footer from "./components/footer";
import ScrollTop from "./components/scrollTop";
import Faq from "./components/faq";

import { SpeedInsights } from "@vercel/speed-insights/next"
import WebsiteSchema from "@/components/JsonLd/WebsiteSchema";
import OrganizationSchema from "@/components/JsonLd/OrganizationSchema";

export const metadata = {
    title: 'J Expert | Japan-Ready Talent Recruitment Indonesia',
    description: 'Find top Japan-trained Indonesian talent (ex-Kenshusei) for your company. J Expert bridges Japanese work ethics with Indonesian potential.',
    alternates: {
        canonical: 'https://jexpertrecruitment.com',
    },
}


export default function IndexTwo() {
    return (
        <>
            <WebsiteSchema />
            <OrganizationSchema />
            <SpeedInsights />
            <Navbar navClass="defaultscroll sticky" navLight={true} />

            <section className="bg-half-260 d-table w-100 position-relative overflow-hidden">
                {/* Optimized Hero Image using Next.js Image */}
                <Image
                    src="/images/hero/bg.jpg"
                    alt="Hero background"
                    fill
                    priority
                    quality={75}
                    sizes="100vw"
                    style={{ objectFit: 'cover', zIndex: -2 }}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEEAQQDAAAAAAAAAAAAAQIDAAQFEQYSITFBE2Fx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAaEQACAgMAAAAAAAAAAAAAAAABAgADESEx/9oADAMBAAIRAxEAPwCxw/k2R49mIby3VZY3QxyRyDasp8MCO4I+6uZbxC4m6W5LeIyLMIo4X2vhgaKKFi6CZQXpQ5n/2Q=="
                />
                <div className="bg-overlay bg-primary-gradient-overlay" style={{ zIndex: -1 }}></div>
                <div className="container position-relative" style={{ zIndex: 1 }}>
                    <div className="row mt-5 justify-content-center">
                        <div className="col-lg-10">
                            <div className="title-heading text-center">
                                <h1 className="heading text-white fw-bold">Your Trusted Partner for <br />Recruiting Japan Ready <br /> Talent in Indonesia.</h1>
                                <p className="para-desc text-white-50 mx-auto mb-0">We connect Japanese companies in Indonesia with highly disciplined, skilled, and culturally aligned Indonesian talent ensuring long-term success and seamless integration with Japanese work standards</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="position-relative">
                <div className="shape overflow-hidden text-white">
                    <svg viewBox="0 0 2880 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>

            <section className="section">
                <AboutUs containerClass="container mt-100 mt-60" />
                <br />

                <OurServices />

                <HowWeWork />

                <HighLevelConcept />

                <OurMission />

                <ClientCTA />

                <Faq />
            </section>

            <Footer />
            <ScrollTop />
        </>
    )
}