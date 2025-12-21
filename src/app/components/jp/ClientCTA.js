"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";

export default function ClientCTA() {
    return (
        <section className="section bg-primary" style={{ backgroundImage: "url('/images/bg2.png')", backgroundPosition: 'center' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card shadow-lg border-0 rounded overflow-hidden">
                            <div className="row g-0">
                                <div className="col-md-5 order-2 order-md-1">
                                    <div className="position-relative h-100 w-100">
                                        <Image
                                            src="/images/hero/bg.jpg"
                                            fill
                                            className="object-fit-cover"
                                            alt="Client CTA"
                                        />
                                    </div>
                                </div>

                                <div className="col-md-7 order-1 order-md-2 bg-white">
                                    <div className="card-body p-5">
                                        <h4 className="title mb-3">日本のビジネス環境に適した、<br /> 強固なチームを構築しませんか？</h4>
                                        <p className="text-muted">
                                            J Expert は、日本の労働文化と規律を重んじる優秀な人材をご紹介する、貴社の信頼できるパートナーです。貴社のニーズを深く理解し、確実な採用成果をお届けします。
                                        </p>

                                        <div className="row">
                                            <div className="col-12">
                                                <ul className="list-unstyled text-muted mt-3">
                                                    <li className="mb-2 d-flex align-items-center"><FiCheckCircle className="text-primary me-2" /> 徹底した教育と規律ある人材</li>
                                                    <li className="mb-2 d-flex align-items-center"><FiCheckCircle className="text-primary me-2" /> 確かな信頼性と実績</li>
                                                    <li className="mb-2 d-flex align-items-center"><FiCheckCircle className="text-primary me-2" /> 日本の企業文化への高い適応力</li>
                                                    <li className="mb-2 d-flex align-items-center"><FiCheckCircle className="text-primary me-2" /> 長期的な定着とコミットメント</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <Link href="#" className="btn btn-primary me-2 mt-2">
                                                お問い合わせ <FiArrowRight className="align-middle ms-1" />
                                            </Link>
                                            <Link href="#" className="btn btn-outline-primary mt-2">
                                                個別相談を予約
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}