"use client";
import React from "react";
import { FiBriefcase, FiUsers, FiStar } from "react-icons/fi";
import { GiTeacher } from "react-icons/gi";

export default function OurServices() {
    const services = [
        {
            icon: FiBriefcase,
            title: "日系企業向け人材紹介", // Recruitment for Japanese Companies
            desc: "一般スタッフから管理職まで、日系企業の品質基準に合わせた一気通貫の採用ソリューションを提供します。"
        },
        {
            icon: FiUsers,
            title: "元実習生（帰国者）特化型紹介", // Kenshuusei Career Placement (Specialized)
            desc: "高い語学力と労働倫理を兼ね備えた日本での実習経験者と、インドネシアの日系企業様をマッチングさせます。"
        },
        {
            icon: GiTeacher,
            title: "教育・研修プログラム", // Training & Development
            desc: "規律、SOP遵守、プロ意識、チームワーク、ビジネスマナーなど、日本水準の徹底した研修を実施します。"
        },
        {
            icon: FiStar,
            title: "即戦力人材の優先紹介プラン", // Premium Talent Subscription (Priority Intro of Immediate Assets)
            desc: "スクリーニング済みの厳選された即戦力人材プールへ、優先的にアクセスできる特別プランです。"
        }
    ];

    return (
        <section className="section bg-primary" style={{ backgroundImage: "url('/images/bg2.png')", backgroundPosition: 'center' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="section-title text-center mb-4 pb-10">
                            <h4 className="title text-white mb-3">サービス内容</h4>
                            <p className="text-white-50 para-desc mx-auto mb-0">
                                インドネシアの優秀な人材と、日系企業の卓越したビジネスを繋ぐ、<br />総合的な採用・教育ソリューションです。
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <div key={index} className="col-lg-3 col-md-6 col-12 mt-4 pt-2">
                                <div className="card service-wrapper rounded border-0 shadow p-4 text-center bg-white">
                                    <div className="icon text-center text-primary fs-2 mb-3">
                                        <Icon />
                                    </div>
                                    <div className="content mt-2">
                                        <h5 className="title text-dark">{service.title}</h5>
                                        <p className="text-muted mt-3 mb-0">
                                            {service.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}