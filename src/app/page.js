import React from "react";

import Navbar from "./componants/navbar";
import FormSelect from "./componants/formSelect";
import AboutUs from "./componants/aboutUs";
import OurServices from "./components/OurServices";
import HowWeWork from "./components/HowWeWork";
import OurMission from "./components/OurMission";
import HighLevelConcept from "./components/HighLevelConcept";
import ClientCTA from "./components/ClientCTA";
import Footer from "./componants/footer";
import ScrollTop from "./componants/scrollTop";
import Faq from "./componants/faq";


export default function IndexTwo() {
    return (
        <>
            <Navbar navClass="defaultscroll sticky" navLight={true} />

            <section className="bg-half-260 d-table w-100" style={{ backgroundImage: 'url("/images/hero/bg.jpg")' }}>
                <div className="bg-overlay bg-primary-gradient-overlay"></div>
                <div className="container">
                    <div className="row mt-5 justify-content-center">
                        <div className="col-lg-10">
                            <div className="title-heading text-center">
                                <h1 className="heading text-white fw-bold">Your Trusted Partner for <br />Recruiting Japan Ready <br /> Talent in Indonesia.</h1>
                                <p className="para-desc text-white-50 mx-auto mb-0">We connect Japanese companies in Indonesia with highly disciplined, skilled, and culturally aligned Indonesian talent ensuring long-term success and seamless integration with Japanese work standards</p>

                                <div className="d-md-flex justify-content-between align-items-center bg-white shadow rounded p-2 mt-4">
                                    <FormSelect />
                                </div>

                                <div className="mt-2">
                                    <span className="text-white-50"><span className="text-white">Popular Searches :</span> Senior Engineer, Senior Operator, Translator and more</span>
                                </div>
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