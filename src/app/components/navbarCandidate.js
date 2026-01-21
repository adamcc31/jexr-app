'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation'
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { apiClient } from "@/lib/api";

import { FiUser, FiSettings, FiLogOut, FiGlobe } from "../assets/icons/vander";

export default function Navbar({ navClass, navLight }) {
    const { t, i18n } = useTranslation('candidate');
    let [isOpen, setMenu] = useState(false);
    let [scroll, setScroll] = useState(false);
    let [cartitem, setCartitem] = useState(false);
    let [langMenu, setLangMenu] = useState(false);

    let [manu, setManu] = useState('');
    let pathname = usePathname();

    const profileRef = React.useRef(null);
    const langRef = React.useRef(null);

    // Fetch candidate profile for profile picture
    const { data: profileData } = useQuery({
        queryKey: ["candidateNavbar"],
        queryFn: async () => {
            try {
                const res = await apiClient.get("/candidates/me/verification");
                return res.data.data;
            } catch (error) {
                return null;
            }
        },
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    const profilePicUrl = profileData?.verification?.profile_picture_url || "/images/team/01.jpg";

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setLangMenu(false);
    };

    useEffect(() => {
        setManu(pathname)
        function scrollHandler() {
            setScroll(window.scrollY > 50)
        }
        if (typeof window !== "undefined") {
            window.addEventListener('scroll', scrollHandler);
            window.scrollTo(0, 0);
        }

        // Close dropdowns when clicking outside
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setCartitem(false);
            }
            if (langRef.current && !langRef.current.contains(event.target)) {
                setLangMenu(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', scrollHandler);
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [setManu]);

    const toggleMenu = (e) => {
        e.preventDefault();
        setMenu(!isOpen);
    };
    return (
        <header id="topnav" className={`${scroll ? 'nav-sticky' : ''} ${navClass}`}>
            <div className="container">
                <Link className="logo" href="/candidate">
                    <Image src='/images/logo-dark.png' width={120} height={30} className="logo-light-mode" alt="" />
                    <Image src='/images/logo-light.png' width={120} height={30} className="logo-dark-mode" alt="" />
                </Link>
                <div className="menu-extras">
                    <div className="menu-item">
                        <Link href='#' className="navbar-toggle" id="isToggle" onClick={toggleMenu}>
                            <div className="lines">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </Link>
                    </div>
                </div>

                <ul className="buy-button list-inline mb-0">
                    {/* Language Switcher */}
                    <li className="list-inline-item ps-1 mb-0">
                        <div className="dropdown" ref={langRef}>
                            <button type="button" onClick={() => setLangMenu(!langMenu)} className="dropdown-toggle btn btn-sm btn-icon btn-pills btn-soft-primary" title={t('common.language')}>
                                <FiGlobe className="icons" />
                            </button>
                            <div style={{ display: langMenu ? 'block' : 'none' }}>
                                <div className={`dropdown-menu dd-menu dropdown-menu-end bg-white rounded border-0 mt-3 p-0 show`} style={{ width: '120px', position: 'absolute', right: '0' }}>
                                    <button
                                        onClick={() => changeLanguage('en')}
                                        className={`dropdown-item fw-medium fs-6 ${i18n.language === 'en' ? 'active bg-primary text-white' : ''}`}
                                    >
                                        English
                                    </button>
                                    <button
                                        onClick={() => changeLanguage('id')}
                                        className={`dropdown-item fw-medium fs-6 ${i18n.language === 'id' ? 'active bg-primary text-white' : ''}`}
                                    >
                                        Indonesia
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>


                    <li className="list-inline-item ps-1 mb-0">
                        <div className="dropdown dropdown-primary" ref={profileRef}>
                            <button type="button" onClick={() => setCartitem(!cartitem)} className="dropdown-toggle btn btn-sm btn-icon btn-pills btn-primary" style={{ overflow: 'hidden' }}>
                                {profilePicUrl.startsWith('/') ? (
                                    <Image src={profilePicUrl} height={32} width={32} className="img-fluid rounded-pill" alt="Profile" />
                                ) : (
                                    <img src={profilePicUrl} height={32} width={32} className="img-fluid rounded-pill" alt="Profile" style={{ objectFit: 'cover' }} />
                                )}
                            </button>
                            <div style={{ display: cartitem === true ? 'block' : 'none' }}>
                                <div className={` dropdown-menu dd-menu dropdown-menu-end bg-white rounded shadow border-0 mt-3 show`}>
                                    <Link href="/candidate/profile" className="dropdown-item fw-medium fs-6" onClick={() => setCartitem(false)}><FiUser className="fea icon-sm me-2 align-middle" />{t('common.profile')}</Link>
                                    <Link href="/candidate/settings" className="dropdown-item fw-medium fs-6" onClick={() => setCartitem(false)}><FiSettings className="fea icon-sm me-2 align-middle" />{t('common.settings')}</Link>
                                    <div className="dropdown-divider border-top"></div>
                                    <Link href="/auth/logout" className="dropdown-item fw-medium fs-6" onClick={() => setCartitem(false)}><FiLogOut className="fea icon-sm me-2 align-middle" />{t('common.logout')}</Link>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>

                <div id="navigation" className={isOpen ? 'open' : ''}>
                    <ul className="navigation-menu nav-right">
                        <li className={manu === "/candidate" ? "active" : ""}>
                            <Link href="/candidate">{t('common.home')}</Link>
                        </li>

                        <li className={manu === "/candidate/jobs" ? "active" : ""}>
                            <Link href="/candidate/jobs">{t('common.jobs')}</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}
