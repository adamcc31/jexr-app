'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';


export default function AboutUs({ containerClass }) {
    return (
        <>
            <div className={containerClass}>
                <div className="row g-4 align-items-center">
                    <div className="col-lg-6 col-md-6 mb-5 mt-0">
                        <div className="about-left">
                            <div className="position-relative shadow rounded img-one">
                                <Image src='/images/img/az01.jpg' width={0} height={0} sizes='100vw' style={{ width: '100%', height: 'auto' }} className="img-fluid rounded" alt="" />
                            </div>

                            <div className="img-two shadow rounded p-2 bg-white">
                                <Image src='/images/about/ab02.jpg' width={0} height={0} sizes='100vw' style={{ width: '100%', height: 'auto' }} className="img-fluid rounded" alt="" />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 col-md-6">
                        <div className="section-title ms-lg-5">
                            <h1 className="title mb-3">J EXPERT について</h1>
                            <h4 className="title mb-3">日系企業に特化した<br /> 人材紹介サービス</h4>
                            <p className="text-muted para-desc mb-10">インドネシアの日系企業様は、ある特有の課題に直面されています。<br /> <strong>それは、「日本の規律、品質基準、そして労働文化を真に理解している人材」の確保です。</strong></p>
                            <p className="text-muted para-desc mb-10"><strong>J Expert Recruitment </strong> は、その課題を解決するために設立されました。</p>
                            <p className="text-muted para-desc mb-0">私たちは、以下のような資質を持つインドネシア人材の採用をご支援いたします：</p>

                            <ul className="list-unstyled text-muted mb-10 mt-3">
                                <li className="mb-1"><span className="text-primary h5 me-2"><i className="mdi mdi-check-circle-outline align-middle"></i></span>日本での実習経験者（元研修生・技能実習生）</li>
                                <li className="mb-1"><span className="text-primary h5 me-2"><i className="mdi mdi-check-circle-outline align-middle"></i></span>規律を重んじ、信頼のおける人材</li>
                                <li className="mb-1"><span className="text-primary h5 me-2"><i className="mdi mdi-check-circle-outline align-middle"></i></span>日本のSOP（標準作業手順）や労働倫理に精通した人材</li>
                                <li className="mb-1"><span className="text-primary h5 me-2"><i className="mdi mdi-check-circle-outline align-middle"></i></span>または、日本文化に即座に適応できるプロフェッショナル</li>
                            </ul>

                            <p className="text-muted para-desc mb-0"><strong>私たちは、日系企業様を理解しています。</strong></p>
                            <p className="text-muted para-desc mb-0"><strong>私たちは、インドネシアの人材を理解しています。</strong></p>
                            <p className="text-muted para-desc mb-0"><strong>そして、その両者の架け橋となります。</strong></p>

                            <div className="mt-4">
                                <Link href="/aboutus" className="btn btn-primary">会社概要 <i className="mdi mdi-arrow-right align-middle"></i></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}