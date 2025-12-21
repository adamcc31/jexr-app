import React from "react";

import Navbar from "../components/jp/navbar";
import AboutUs from "../components/jp/aboutUs";
import OurServices from "../components/jp/OurServices";
import HowWeWork from "../components/jp/HowWeWork";
import OurMission from "../components/jp/OurMission";
import HighLevelConcept from "../components/jp/HighLevelConcept";
import ClientCTA from "../components/jp/ClientCTA";
import Footer from "../components/jp/footer";
import ScrollTop from "../components/jp/scrollTop";
import Faq from "../components/jp/faq";

import { SpeedInsights } from "@vercel/speed-insights/next"


export default function IndexTwo() {
    return (
        <>
            <SpeedInsights />
            <Navbar navClass="defaultscroll sticky" navLight={true} />

            <section className="bg-half-260 d-table w-100" style={{ backgroundImage: 'url("/images/hero/bg.jpg")' }}>
                <div className="bg-overlay bg-primary-gradient-overlay"></div>
                <div className="container">
                    <div className="row mt-5 justify-content-center">
                        <div className="col-lg-10">
                            <div className="title-heading text-center">
                                <h1 className="heading text-white fw-bold">インドネシアでの<br />「即戦力」人材採用における、<br /> 貴社の信頼できるパートナー。</h1>
                                <p className="para-desc text-white-50 mx-auto mb-0">私たちは、高い規律とスキルを持ち、日本文化に親和性のあるインドネシア人材と日系企業様を繋ぎます。日本の業務基準へのスムーズな適応と、長期的な事業の成功をお約束します。</p>
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