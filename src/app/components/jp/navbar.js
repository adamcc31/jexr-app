'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation'

import { LuSearch } from "../../assets/icons/vander";

export default function Navbar({ navClass, navLight }) {
    let [isOpen, setMenu] = useState(false);
    let [scroll, setScroll] = useState(false);
    let [search, setSearch] = useState(false);
    let [cartitem, setCartitem] = useState(false);

    let [manu, setManu] = useState('');
    let pathname = usePathname();

    useEffect(() => {
        setManu(pathname)
        function scrollHandler() {
            setScroll(window.scrollY > 50)
        }
        if (typeof window !== "undefined") {
            window.addEventListener('scroll', scrollHandler);
            window.scrollTo(0, 0);
        }

        let searchModal = () => { setSearch(false) }
        document.addEventListener('mousedown', searchModal);

        let cartModal = () => { setCartitem(false) }
        document.addEventListener('mousedown', cartModal);

        return () => {
            window.removeEventListener('scroll', scrollHandler);
            document.removeEventListener('mousedown', searchModal);
            document.removeEventListener('mousedown', cartModal);
        };

    }, [setManu]);

    const toggleMenu = (e) => {
        e.preventDefault();
        setMenu(!isOpen);
    };
    return (
        <header id="topnav" className={`${scroll ? 'nav-sticky' : ''} ${navClass}`}>
            <div className="container">
                {navLight === true ?
                    <Link className="logo" href="/">
                        <span className="logo-light-mode">
                            <Image src='/images/logo-dark.png' width={120} height={31} className="l-dark" alt="" />
                            <Image src='/images/logo-white.png' width={120} height={31} className="l-light" alt="" />
                        </span>
                        <Image src='/images/logo-light.png' width={120} height={31} className="logo-dark-mode" alt="" />
                    </Link> :
                    <Link className="logo" href="/">
                        <span className="logo-light-mode">
                            <Image src='/images/logo-dark.png' width={120} height={31} className="l-dark" alt="" />
                            <Image src='/images/logo-white.png' width={120} height={31} className="l-light" alt="" />
                        </span>
                        <Image src='/images/logo-white.png' width={120} height={31} className="logo-dark-mode" alt="" />
                    </Link>
                }
                <div className="menu-extras">
                    <div className="menu-item">
                        <Link href='/' className="navbar-toggle" id="isToggle" onClick={toggleMenu}>
                            <div className="lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </Link>
                    </div>
                </div>

                <ul className="buy-button list-inline mb-0">
                    <li className="list-inline-item ps-1 mb-0">
                        <div className="dropdown">
                            <button type="button" onClick={() => setSearch(!search)} className="dropdown-toggle btn btn-sm btn-icon btn-pills btn-primary">
                                <LuSearch className="icons" />
                            </button>
                            <div style={{ display: search === true ? 'block' : 'none' }}>
                                <div className={`dropdown-menu dd-menu dropdown-menu-end bg-white rounded border-0 mt-3 p-0 show`} style={{ width: '240px', position: 'absolute', right: '0' }}>
                                    <div className="search-bar">
                                        <div id="itemSearch" className="menu-search mb-0">
                                            <form role="search" method="get" id="searchItemform" className="searchform">
                                                {/* Translate Placeholder */}
                                                <input type="text" className="form-control rounded border" name="s" id="searchItem" placeholder="検索..." />
                                                {/* Translate Submit Button */}
                                                <input type="submit" id="searchItemsubmit" value="検索" />
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>

                <div id="navigation" className={isOpen ? 'open' : ''}>
                    <ul className="navigation-menu nav-right nav-light">
                        <li className={manu === "/" ? "active" : ""}>
                            {/* Home -> ホーム */}
                            <Link href="/">ホーム</Link>
                        </li>

                        <li className={manu === "/job-categories" ? "active" : ""}>
                            {/* Jobs -> 求人情報 */}
                            <Link href="/job-categories">求人情報</Link>
                        </li>

                        <li className={manu === "/candidate-pool" ? "active" : ""}>
                            {/* Candidate Pool -> 候補者プール */}
                            <Link href="/candidate-pool">候補者プール</Link>
                        </li>

                        {/* Contact Us -> お問い合わせ */}
                        <li className={manu === "/contactus" ? "active" : ""}><Link href="/contactus" className="sub-menu-item">お問い合わせ</Link></li>

                        <li className={`${["/aboutus", "/services", "/pricing", "/helpcenter-overview", "/helpcenter-faqs", "/helpcenter-guides", '/helpcenter-support', "/blogs", "/blog-sidebar", "/blog-detail", "/login", "/signup", "/reset-password", "/lock-screen", "/terms", "/privacy"].includes(manu) ? "active" : ""} has-submenu parent-menu-item`}>
                            {/* Language -> 言語 */}
                            <Link href="#">言語</Link><span className="menu-arrow"></span>
                            <ul className="submenu">
                                {/* Japanese -> 日本語 */}
                                <li className={manu === "/jp" ? "active" : ""}><Link href="/jp" className="sub-menu-item">日本語</Link></li>
                                {/* English -> 英語 (atau tetap English) */}
                                <li className={manu === "/" ? "active" : ""}><Link href="/" className="sub-menu-item">英語</Link></li>
                            </ul>
                        </li>

                        <li className={manu === "/login" ? "active" : ""}>
                            {/* Login -> ログイン */}
                            <Link href="/login">ログイン</Link>
                        </li>

                        <li className={manu === "/signup" ? "active" : ""}>
                            {/* Signup -> 新規登録 */}
                            <Link href="/signup">新規登録</Link>
                        </li>

                        <li className={`${["/aboutus", "/services", "/pricing", "/helpcenter-overview", "/helpcenter-faqs", "/helpcenter-guides", '/helpcenter-support', "/blogs", "/blog-sidebar", "/blog-detail", "/login", "/signup", "/reset-password", "/lock-screen", "/terms", "/privacy"].includes(manu) ? "active" : ""} has-submenu parent-menu-item`}>
                            {/* More Pages -> その他 */}
                            <Link href="#">その他</Link><span className="menu-arrow"></span>
                            <ul className="submenu">
                                {/* About Us -> 会社概要 */}
                                <li className={manu === "/aboutus" ? "active" : ""}><Link href="/aboutus" className="sub-menu-item">会社概要</Link></li>
                                {/* Terms -> 利用規約 */}
                                <li className={manu === "/terms" ? "active" : ""}><Link href="/terms" className="sub-menu-item">利用規約</Link></li>
                                {/* Privacy -> プライバシーポリシー */}
                                <li className={manu === "/privacy" ? "active" : ""}><Link href="/privacy" className="sub-menu-item">プライバシーポリシー</Link></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}