"use client";
import React from "react";
import { FiSearch, FiCheckSquare, FiTarget, FiUserCheck, FiLifeBuoy } from "react-icons/fi";

export default function HowWeWork() {
    const steps = [
        {
            icon: FiSearch,
            title: "ヒアリング・要件定義", // Hearing / Requirement Definition
            desc: "貴社の企業文化、期待値、そして具体的な採用ニーズを深く分析し、最適なマッチングの基盤を築きます。"
        },
        {
            icon: FiCheckSquare,
            title: "日本基準のスクリーニング", // Japanese Standard Screening
            desc: "「技術力」「高い労働倫理」「企業文化への適合性」の3つの柱に基づき、候補者を厳選します。"
        },
        {
            icon: FiTarget,
            title: "高精度なマッチング", // High-Precision Matching
            desc: "貴社の長期的な事業目標と候補者のキャリアプランを照合し、持続可能で効果的な人材配置を実現します。"
        },
        {
            icon: FiUserCheck,
            title: "面接調整・採用決定", // Interview Coordination & Hiring Decision
            desc: "面接日程の調整から入社手続きのサポートまで、スムーズな受け入れプロセスを全面的に支援します。"
        },
        {
            icon: FiLifeBuoy,
            title: "入社後のフォローアップ", // Post-Hiring Follow-up
            desc: "入社後も継続的なサポートを行い、職場への円滑な適応と早期戦力化、定着を確実にします。"
        }
    ];

    return (
        <section className="section">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12">
                        <div className="section-title text-center mb-4 pb-2">
                            <h4 className="title mb-3">サービスの流れ</h4>
                            <p className="text-muted para-desc mx-auto mb-0">
                                品質、コンプライアンス、そして長期的な成功を実現するための、体系的な採用プロセスです。
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="col-lg-4 col-md-6 col-12 mt-4 pt-2">
                                <div className="card border-0 text-center features feature-primary feature-clean">
                                    <div className="icons text-center mx-auto">
                                        <Icon className="d-block rounded h3 mb-0" />
                                    </div>
                                    <div className="content mt-4">
                                        <h5 className="title text-dark">{index + 1}. {step.title}</h5>
                                        <p className="text-muted mb-0 mt-3">
                                            {step.desc}
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