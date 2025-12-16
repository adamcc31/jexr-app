"use client";
import React from "react";
import { FiBriefcase, FiUsers, FiStar } from "react-icons/fi";
import { GiTeacher } from "react-icons/gi";

export default function OurServices() {
    const services = [
        {
            icon: FiBriefcase,
            title: "Recruitment for Japanese Companies",
            desc: "End-to-end hiring solutions for staff, supervisor, and managerial roles, tailored for Japanese corporate standards."
        },
        {
            icon: FiUsers,
            title: "Kenshuusei Career Placement",
            desc: "Connecting Japan-trained workers with Japanese companies in Indonesia, leveraging their language skills and work ethic."
        },
        {
            icon: GiTeacher,
            title: "Training & Development Programs",
            desc: "Japan-standard training covering discipline, SOP adherence, professional mindset, teamwork, and workplace behavior."
        },
        {
            icon: FiStar,
            title: "Premium Talent Subscription",
            desc: "Priority access to a curated pool of pre-screened, high-quality candidates ready for immediate placement."
        }
    ];

    return (
        <section className="section bg-primary" style={{ backgroundImage: "url('/images/bg2.png')", backgroundPosition: 'center' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="section-title text-center mb-4 pb-10">
                            <h4 className="title text-white mb-3">Our Services</h4>
                            <p className="text-white-50 para-desc mx-auto mb-0">
                                Comprehensive recruitment and training solutions bridging Indonesian talent with Japanese corporate excellence.
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
