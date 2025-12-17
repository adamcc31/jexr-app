import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMapPin } from "react-icons/fi";

import Navbar from "../../componants/navbar";
import FormSelect from "../../componants/formSelect";
import AboutUs from "../../componants/aboutUs";
import OurServices from "../../components/OurServices";
import HighLevelConcept from "../../components/HighLevelConcept";
import Footer from "../../componants/footer";
import ScrollTop from "../../componants/scrollTop";
import Faq from "../../componants/faq";

import { SpeedInsights } from "@vercel/speed-insights/next"

import { jobData } from "../../data/data";

let lang = "jp";

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
                                <h1 className="heading text-white fw-bold">{lang === "jp" ? "インドネシアでの<br />「即戦力」人材採用における、<br /> 貴社の信頼できるパートナー。" : "Your Trusted Partner for <br />Recruiting Japan Ready <br /> Talent in Indonesia."}</h1>
                                <p className="para-desc text-white-50 mx-auto mb-0">{lang === "jp" ? "私たちは、高い規律とスキルを持ち、日本文化に親和性のあるインドネシア人材と日系企業様を繋ぎます。日本の業務基準へのスムーズな適応と、長期的な事業の成功をお約束します。" : "We connect Japanese companies in Indonesia with highly disciplined, skilled, and culturally aligned Indonesian talent ensuring long-term success and seamless integration with Japanese work standards"}</p>

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
                {/* Job List */}
                <div className="container">
                    <div className="row g-4 gy-5">
                        {jobData.map((item, index) => {
                            return (
                                <div className="col-lg-3 col-md-4 col-sm-6 col-12" key={index}>
                                    <div className="employer-card position-relative bg-white rounded shadow p-4 mt-3">
                                        <div className="employer-img d-flex justify-content-center align-items-center bg-white shadow-md rounded">
                                            <Image src={item.image} width={36} height={36} className="avatar avatar-ex-small" alt="" />
                                        </div>

                                        <div className="content mt-3">
                                            <Link href={`/employer-profile/${item.id}`} className="title text-dark h5">{item.name}</Link>

                                            <p className="text-muted mt-2 mb-0">未来を拓くデジタルソリューション</p>
                                        </div>

                                        <ul className="list-unstyled d-flex justify-content-between align-items-center border-top mt-3 pt-3 mb-0">
                                            <li className="text-muted d-inline-flex align-items-center"><FiMapPin className="fea icon-sm me-1 align-middle" />{item.country}</li>
                                            <li className="list-inline-item text-primary fw-medium">{item.vacancy} 件の求人</li>
                                        </ul>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="row">
                        <div className="col-12 mt-4 pt-2">
                            <ul className="pagination justify-content-center mb-0">
                                <li className="page-item">
                                    <Link className="page-link" href="#" aria-label="Previous">
                                        <span aria-hidden="true"><i className="mdi mdi-chevron-left fs-6"></i></span>
                                    </Link>
                                </li>
                                <li className="page-item"><Link className="page-link" href="#">1</Link></li>
                                <li className="page-item active"><Link className="page-link" href="#">2</Link></li>
                                <li className="page-item"><Link className="page-link" href="#">3</Link></li>
                                <li className="page-item">
                                    <Link className="page-link" href="#" aria-label="Next">
                                        <span aria-hidden="true"><i className="mdi mdi-chevron-right fs-6"></i></span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Job List end */}
                <br />
                <HighLevelConcept />
                <br />
                <AboutUs containerClass="container mt-10 mt-60" />
                <br />

                <OurServices />
                <br />
                <Faq />
            </section>

            <Footer />
            <ScrollTop />
        </>
    )
}