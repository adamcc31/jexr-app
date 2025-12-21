'use client'
import React, { useState } from 'react';
import Image from 'next/image';

import '../../../node_modules/react-modal-video/scss/modal-video.scss';


const faqData = [
    {
        title: 'What is J-Expert Recruitment?',
        desc: 'J-Expert Recruitment is a recruitment specialist for Japanese companies operating in Indonesia, focusing on candidates who understand Japanese work culture, discipline, and standards.'
    },
    {
        title: 'What makes J-Expert different from other recruitment agencies?',
        desc: <>We have direct access to Exata Group&apos;s internal candidate database, which has assisted over 40,000 Kenshuusei (Japanese-Indonesian) candidates in Japan since 2015.<br /><br />This makes our selection process more precise, faster, and relevant.</>
    },
    {
        title: 'What types of candidates do you provide?',
        desc: <>
            We provide:
            <ul className="list-unstyled mt-2">
                <li className="d-flex mt-2"><i className="mdi mdi-chevron-right text-primary me-2"></i> Japanese migrants / Ex-Japan (technical & operational roles)</li>
                <li className="d-flex mt-2"><i className="mdi mdi-chevron-right text-primary me-2"></i> Japanese-Indonesian bilingual candidates</li>
                <li className="d-flex mt-2"><i className="mdi mdi-chevron-right text-primary me-2"></i> Staff, Supervisor, and Leader/Interpreter level</li>
            </ul>
        </>
    },
    {
        title: 'Are the candidates already familiar with Japanese work culture?',
        desc: <>
            Yes. The majority of our candidates:
            <ul className="list-unstyled mt-2">
                <li className="d-flex mt-2"><i className="mdi mdi-chevron-right text-primary me-2"></i> Have worked directly in a Japanese company</li>
                <li className="d-flex mt-2"><i className="mdi mdi-chevron-right text-primary me-2"></i> Familiar with Kaizen, Ho-Ren-So, 5S, and Japanese work discipline</li>
                <li className="d-flex mt-2"><i className="mdi mdi-chevron-right text-primary me-2"></i> Ready to adapt to a Japanese organizational structure in Indonesia</li>
            </ul>
        </>
    },
    {
        title: 'Do you only work with Japanese companies?',
        desc: 'Our primary focus is Japanese companies, but we are also open to multinational companies that need Japan-ready talent.'
    },
]

export default function Faq() {
    let [isOpen, setOpen] = useState(false);
    let [activeIndex, setActiveIndex] = useState(0)
    return (
        <div className="row g-4 align-items-center">
            <div className="col-lg-6 col-md-6 mb-5">
                <div className="about-left">
                    <div className="position-relative shadow rounded img-one">
                        <Image src='/images/img/az01.jpg' width={0} height={0} sizes='100vw' style={{ width: '100%', height: 'auto' }} className="img-fluid rounded" alt="" />
                    </div>

                    <div className="img-two shadow rounded p-2 bg-white">
                        <Image src='/images/img/az02.jpg' width={0} height={0} sizes='100vw' style={{ width: '100%', height: 'auto' }} className="img-fluid rounded" alt="" />
                    </div>
                </div>
            </div>

            <div className="col-lg-6 col-md-6">
                <div className="section-title mb-4 ms-lg-3">
                    <h4 className="title mb-3">Frequently Asked Questions</h4>
                    <p className="text-muted para-desc mb-0">Find your fit talent in J Expert Recruitment. Get your perfect match with our advanced matching system.</p>


                    <div className="accordion mt-4 pt-2" id="buyingquestion">
                        {faqData.map((item, index) => {
                            return (
                                <div className="accordion-item rounded mt-2" key={index}>
                                    <h2 className="accordion-header" id="headingOne">
                                        <button className={`${activeIndex === index ? '' : 'collapsed'} accordion-button border-0 bg-light`} onClick={() => setActiveIndex(index)}>
                                            {item.title}
                                        </button>
                                    </h2>
                                    <div id="collapseOne" className={`${activeIndex === index ? 'show' : ''} accordion-collapse border-0 collapse`}>
                                        <div className="accordion-body text-muted">
                                            {item.desc}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}