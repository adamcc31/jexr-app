import React from "react";

import Navbar from "../componants/jp/navbar";
import FormSelect from "../componants/jp/formSelect";
import AboutUs from "../componants/jp/aboutUs";
import OurServices from "../componants/jp/OurServices";
import HowWeWork from "../componants/jp/HowWeWork";
import OurMission from "../componants/jp/OurMission";
import HighLevelConcept from "../componants/jp/HighLevelConcept";
import ClientCTA from "../componants/jp/ClientCTA";
import Footer from "../componants/jp/footer";
import ScrollTop from "../componants/jp/scrollTop";
import Faq from "../componants/jp/faq";

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

                                <div className="d-md-flex justify-content-between align-items-center bg-white shadow rounded p-2 mt-4">
                                    <FormSelect />
                                </div>

                                <div className="mt-2">
                                    <span className="text-white-50"><span className="text-white">注目の検索キーワード :</span> シニアエンジニア、熟練オペレーター、通訳 など</span>
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