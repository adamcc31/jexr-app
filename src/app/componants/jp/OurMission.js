"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";

export default function OurMission() {
    return (
        <section className="section">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-6 col-md-6 order-2 order-md-1 mt-4 mt-sm-0 pt-2 pt-sm-0">
                        <div className="position-relative">
                            <Image
                                src="/images/work/pab.jpg"
                                width={0}
                                height={0}
                                sizes="100vw"
                                style={{ width: '100%', height: 'auto' }}
                                className="rounded img-fluid shadow-lg"
                                alt="Our Mission"
                            />
                            <div className="img-overlay bg-overlay"></div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6 order-1 order-md-2">
                        <div className="section-title ms-lg-5">
                            <h4 className="title mb-3">私たちの使命： <br /> 優秀な人材で、日系企業の事業成長を加速させる</h4>
                            <p className="text-muted">私たちは、インドネシアの優秀な人材と、日系企業の採用ニーズを繋ぐ「架け橋」です。企業様と候補者の双方が円滑に業務を開始し、長期的な成功と定着を実現することをお約束します。</p>

                            <ul className="list-unstyled text-muted">
                                <li className="mb-1">
                                    <span className="text-primary h5 me-2">
                                        <FiCheckCircle className="align-middle" />
                                    </span>
                                    日系企業様からの厚い信頼を誇る採用パートナー
                                </li>
                                <li className="mb-1">
                                    <span className="text-primary h5 me-2">
                                        <FiCheckCircle className="align-middle" />
                                    </span>
                                    日本の労働文化と規律を深く理解した優秀な人材
                                </li>
                                <li className="mb-1">
                                    <span className="text-primary h5 me-2">
                                        <FiCheckCircle className="align-middle" />
                                    </span>
                                    インドネシア最大級の元実習生（帰国者）ネットワーク
                                </li>
                            </ul>

                            <div className="mt-4">
                                <Link href="#" className="btn btn-primary">
                                    詳細を見る
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}