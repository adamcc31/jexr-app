'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation'

import { LuSearch, FiUser, FiSettings, FiLock, FiLogOut } from "../assets/icons/vander";

export default function Navbar({ navClass, navLight }) {
    let [isOpen, setMenu] = useState(true);
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
    const toggleMenu = () => {
        setMenu(!isOpen)
        if (document.getElementById("navigation")) {
            const anchorArray = Array.from(document.getElementById("navigation").getElementsByTagName("a"));
            anchorArray.forEach(element => {
                element.addEventListener('click', (elem) => {
                    const target = elem.target.getAttribute("href")
                    if (target !== "") {
                        if (elem.target.nextElementSibling) {
                            var submenu = elem.target.nextElementSibling.nextElementSibling;
                            submenu.classList.toggle('open');
                        }
                    }
                })
            });
        }
    }
    return (
        <header id="topnav" className={`${scroll ? 'nav-sticky' : ''} ${navClass}`}>
            <div className="container">
                {navLight === true ?
                    <Link className="logo" href="/">
                        <span className="logo-light-mode">
                            <Image src='/images/logo-dark.png' width={120} height={31} className="l-dark" alt="" />
                            <Image src='/images/logo-light.png' width={120} height={31} className="l-light" alt="" />
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
                                                <input type="text" className="form-control rounded border" name="s" id="searchItem" placeholder="Search..." />
                                                <input type="submit" id="searchItemsubmit" value="Search" />
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>

                    <div id="navigation">
                        <ul className="navigation-menu nav-right nav-light">
                            <li className={manu === "/" ? "active" : ""}>
                                <Link href="/">Home</Link>
                            </li>

                        <li className={`${["/job-categories", "/job-grid-one", "/job-grid-two", "/job-grid-three", "/job-grid-four", "/job-list-one", "/job-list-two", "/job-detail-one", "/job-detail-two", "/job-detail-three", "/job-apply", "/job-post", "/career"].includes(manu) ? "active" : ""} has-submenu parent-menu-item`}><Link href="#"> Jobs </Link><span className="menu-arrow"></span>
                            <ul className="submenu">
                                <li className={manu === "/job-categories" ? "active" : ""}><Link href="/job-categories" className="sub-menu-item">Job Categories</Link></li>
                                <li className={manu === "/career" ? "active" : ""}><Link href="/career" className="sub-menu-item">Career </Link></li>
                            </ul>
                        </li>

                        <li className={`${["/employers", "/employer-profile"].includes(manu) ? "active" : ""} has-submenu parent-menu-item`}>
                            <Link href="#">Employers</Link><span className="menu-arrow"></span>
                            <ul className="submenu">
                                <li className={manu === "/employers" ? "active" : ""}><Link href="/employers" className="sub-menu-item">Employers</Link></li>
                                <li className={manu === "/employer-profile" ? "active" : ""}><Link href="/employer-profile" className="sub-menu-item">Employer Profile</Link></li>
                            </ul>
                        </li>

                        <li className={`${["/candidates", "/candidate-profile", "/candidate-profile-setting"].includes(manu) ? "active" : ""} has-submenu parent-menu-item`}>
                            <Link href="#">Candidates</Link><span className="menu-arrow"></span>
                            <ul className="submenu">
                                 <li className={manu === "/login" ? "active" : ""}><Link href="/login" className="sub-menu-item"> Login</Link></li>
                                 <li className={manu === "/signup" ? "active" : ""}><Link href="/signup" className="sub-menu-item"> Signup</Link></li>
                            </ul>
                        </li>

                        <li className={`${["/aboutus", "/services", "/pricing", "/helpcenter-overview", "/helpcenter-faqs", "/helpcenter-guides", '/helpcenter-support', "/blogs", "/blog-sidebar", "/blog-detail", "/login", "/signup", "/reset-password", "/lock-screen", "/terms", "/privacy"].includes(manu) ? "active" : ""} has-submenu parent-menu-item`}>
                            <Link href="#">More Pages</Link><span className="menu-arrow"></span>
                            <ul className="submenu">
                                <li className={manu === "/aboutus" ? "active" : ""}><Link href="/aboutus" className="sub-menu-item">About Us</Link></li>
                                <li className={manu === "/services" ? "active" : ""}><Link href="/services" className="sub-menu-item">Services</Link></li>

                                <li className={`${["/helpcenter-overview", "/helpcenter-faqs", "/helpcenter-guides", '/helpcenter-support'].includes(manu) ? "active" : ""} has-submenu parent-menu-item`}>
                                    <Link href="#"> Helpcenter </Link><span className="submenu-arrow"></span>
                                    <ul className="submenu">
                                        <li className={manu === "/helpcenter-overview" ? "active" : ""}><Link href="/helpcenter-overview" className="sub-menu-item">Overview</Link></li>
                                        <li className={manu === "/helpcenter-faqs" ? "active" : ""}><Link href="/helpcenter-faqs" className="sub-menu-item">FAQs</Link></li>
                                        <li className={manu === "/helpcenter-guides" ? "active" : ""}><Link href="/helpcenter-guides" className="sub-menu-item">Guides</Link></li>
                                        <li className={manu === "/helpcenter-support" ? "active" : ""}><Link href="/helpcenter-support" className="sub-menu-item">Support</Link></li>
                                    </ul>
                                </li>

                                <li className={`${["/terms", "/privacy"].includes(manu) ? "active" : ""} has-submenu parent-menu-item`}><Link href="#"> Terms and Policy </Link><span className="submenu-arrow"></span>
                                    <ul className="submenu">
                                        <li className={manu === "/terms" ? "active" : ""}><Link href="/terms" className="sub-menu-item">Terms of Services</Link></li>
                                        <li className={manu === "/privacy" ? "active" : ""}><Link href="/privacy" className="sub-menu-item">Privacy Policy</Link></li>
                                    </ul>
                                </li>
                            </ul>
                        </li>

                        <li className={manu === "/contactus" ? "active" : ""}><Link href="/contactus" className="sub-menu-item">Contact Us</Link></li>
                    </ul>
                </div>
            </div>
        </header>
    )
}