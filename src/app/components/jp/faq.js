'use client'
import React, { useState } from 'react';
import Image from 'next/image';


const faqData = [
    {
        title: 'J-Expert Recruitmentとは何ですか？',
        desc: 'J-Expert Recruitmentは、インドネシアに進出している日系企業専門の人材紹介会社です。日本の労働文化、規律、基準を理解している候補者に特化しています。'
    },
    {
        title: 'J-Expertは他の人材紹介会社と何が違いますか？',
        desc: <>2015年以来、40,000人以上の元技能実習生（日系インドネシア人）を支援してきたExataグループの内部候補者データベースに直接アクセスできます。<br /><br />これにより、より正確で迅速、かつ適切な選考プロセスが可能になります。</>
    },
    {
        title: 'どのような候補者を紹介してもらえますか？',
        desc: <>
            以下の候補者をご紹介可能です：
            <ul className="list-unstyled mt-2">
                <li className="d-flex mt-2"><i className="mdi mdi-chevron-right text-primary me-2"></i> 日本からの帰国者/元技能実習生（技術職・現業職）</li>
                <li className="d-flex mt-2"><i className="mdi mdi-chevron-right text-primary me-2"></i> 日尼バイリンガル人材</li>
                <li className="d-flex mt-2"><i className="mdi mdi-chevron-right text-primary me-2"></i> スタッフ、スーパーバイザー、およびリーダー/通訳レベル</li>
            </ul>
        </>
    },
    {
        title: '候補者はすでに日本の労働文化に精通していますか？',
        desc: <>
            はい。大多数の候補者は以下の特徴を持っています：
            <ul className="list-unstyled mt-2">
                <li className="d-flex mt-2"><i className="mdi mdi-chevron-right text-primary me-2"></i> 日系企業での直接就業経験がある</li>
                <li className="d-flex mt-2"><i className="mdi mdi-chevron-right text-primary me-2"></i> 改善（Kaizen）、報連相（Ho-Ren-So）、5S、および日本の労働規律に精通している</li>
                <li className="d-flex mt-2"><i className="mdi mdi-chevron-right text-primary me-2"></i> インドネシアにおける日本的な組織構造に適応する準備ができている</li>
            </ul>
        </>
    },
    {
        title: '日系企業とのみ取引していますか？',
        desc: '私たちの主な対象は日系企業ですが、日本的な即戦力人材を必要とする多国籍企業にも対応しています。'
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
                    <p className="text-muted para-desc mb-0">Search all the open positions on the web. Get your own personalized salary estimate. Read reviews on over 30000+ companies worldwide.</p>


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