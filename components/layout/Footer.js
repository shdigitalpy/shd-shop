import React from "react";
import Link from "next/link"
import CategoryProductFooter from "../ecommerce/Filter/CategoryProductFooter";

const Footer = () => {
    return (
        <>
            <footer className="main">
                <section className="newsletter mb-15  wow animate__animated animate__fadeIn">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="position-relative newsletter-inner">
                                    <div className="newsletter-content">
                                        <h2 className="mb-20">
                                            Erhalte dein gratis Probierset <br />
                                            
                                        </h2>
                                        <p className="mb-45">
                                            Jetzt eintragen{" "}
                                            <span className="text-brand">
                                                und in eine neue Welt eintauchen
                                            </span>
                                        </p>
                                        <form className="form-subcriber d-flex">
                                            <input
                                                type="email"
                                                placeholder="E-Mail Adresse"
                                            />
                                            <button className="btn" type="submit">
                                                Loslegen
                                            </button>
                                        </form>
                                    </div>
                                    <img
                                        src="/assets/imgs/banner/banner-9.png"
                                        alt="newsletter"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="featured  section-padding">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-1-5 col-md-4 col-12 col-sm-6 mb-md-4 mb-xl-0">
                                <div
                                    className="banner-left-icon d-flex align-items-center  wow animate__animated animate__fadeInUp"
                                    data-wow-delay="0"
                                >
                                    <div className="banner-icon">
                                        <img
                                            src="/assets/imgs/theme/icons/icon-1.svg"
                                            alt=""
                                        />
                                    </div>
                                    <div className="banner-text">
                                        <h3 className="icon-box-title">
                                           Gratis Lieferung
                                        </h3>
                                        <p>ab CHF 100.--</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
                                <div
                                    className="banner-left-icon d-flex align-items-center  wow animate__animated animate__fadeInUp"
                                    data-wow-delay=".1s"
                                >
                                    <div className="banner-icon">
                                        <img
                                            src="/assets/imgs/theme/icons/icon-2.svg"
                                            alt=""
                                        />
                                    </div>
                                    <div className="banner-text">
                                        <h3 className="icon-box-title">
                                            Ab CH-Lager
                                        </h3>
                                        <p>mit Beratung</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
                                <div
                                    className="banner-left-icon d-flex align-items-center  wow animate__animated animate__fadeInUp"
                                    data-wow-delay=".2s"
                                >
                                    <div className="banner-icon">
                                        <img
                                            src="/assets/imgs/theme/icons/icon-3.svg"
                                            alt=""
                                        />
                                    </div>
                                    <div className="banner-text">
                                        <h3 className="icon-box-title">
                                            Tägliche Aktionen
                                        </h3>
                                        <p>im Newsletter</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
                                <div
                                    className="banner-left-icon d-flex align-items-center  wow animate__animated animate__fadeInUp"
                                    data-wow-delay=".3s"
                                >
                                    <div className="banner-icon">
                                        <img
                                            src="/assets/imgs/theme/icons/icon-4.svg"
                                            alt=""
                                        />
                                    </div>
                                    <div className="banner-text">
                                        <h3 className="icon-box-title">
                                            Grosse Auswahl
                                        </h3>
                                        <p>Bio Hundefutter</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-1-5 col-md-4 col-12 col-sm-6">
                                <div
                                    className="banner-left-icon d-flex align-items-center  wow animate__animated animate__fadeInUp"
                                    data-wow-delay=".4s"
                                >
                                    <div className="banner-icon">
                                        <img
                                            src="/assets/imgs/theme/icons/icon-5.svg"
                                            alt=""
                                        />
                                    </div>
                                    <div className="banner-text">
                                        <h3 className="icon-box-title">
                                            Kundenservice
                                        </h3>
                                        <p>E-Mail und Telefon</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-1-5 col-md-4 col-12 col-sm-6 d-xl-none">
                                <div
                                    className="banner-left-icon d-flex align-items-center  wow animate__animated animate__fadeInUp"
                                    data-wow-delay=".5s"
                                >
                                    <div className="banner-icon">
                                        <img
                                            src="/assets/imgs/theme/icons/icon-6.svg"
                                            alt=""
                                        />
                                    </div>
                                    <div className="banner-text">
                                        <h3 className="icon-box-title">
                                            Safe delivery
                                        </h3>
                                        <p>Within 30 days</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="section-padding footer-mid">
                    <div className="container pt-15 pb-20">
                        <div className="row">
                            <div className="col">
                                <div
                                    className="widget-about font-md mb-md-3 mb-lg-3 mb-xl-0  wow animate__animated animate__fadeInUp"
                                    data-wow-delay="0"
                                >
                                    <div className="logo  mb-30">
                                        <Link href="/"><a className="mb-15">
                                            <img
                                                src="/assets/imgs/logo.webp"
                                                alt="logo"
                                            />
                                        </a>
                                        </Link>
                                        <p className="font-lg text-heading">
                                            Der Bio Hundeshop vertreibt in der Schweiz nachhaltiges Hundefutter und Zubehör für Hunde und Besitzer
                                        </p>
                                    </div>
                                    <ul className="contact-infor">
                                        
                                       
                                        <li>
                                            <img
                                                src="/assets/imgs/theme/icons/icon-email-2.svg"
                                                alt=""
                                            />
                                            <strong>E-Mail:</strong>
                                            <span>info@bio-hundeshop.ch</span>
                                        </li>
                                        {/*<li>
                                            <img
                                                src="/assets/imgs/theme/icons/icon-clock.svg"
                                                alt=""
                                            />
                                            <strong>Hours:</strong>
                                            <span>
                                                10:00 - 18:00, Mon - Sat
                                            </span>
                                        </li>*/}
                                    </ul>
                                </div>
                            </div>
                            
                            <div
                                className="footer-link-widget col  wow animate__animated animate__fadeInUp"
                                data-wow-delay=".2s"
                            >
                                <h4 className="widget-title ">Mein Konto</h4>
                                <ul className="footer-list  mb-sm-5 mb-md-0">
                                    <li>
                                        <a href="/shop-login">Anmelden</a>
                                    </li>
                                    <li>
                                        <a href="/shop-cart">Warenkorb</a>
                                    </li>
                                    <li>
                                        <a href="/shop-wishlist">Merkliste</a>
                                    </li>
                                    <li>
                                        <a href="/page-account">Lieferung verfolgen</a>
                                    </li>
                                    
                                    
                                </ul>
                            </div>
                            <div
                                className="footer-link-widget col  wow animate__animated animate__fadeInUp"
                                data-wow-delay=".3s"
                            >
                                <h4 className="widget-title ">Informationen</h4>
                                <ul className="footer-list  mb-sm-5 mb-md-0">
                                    <li>
                                        <a href="#">FAQ</a>
                                    </li>
                                    <li>
                                        <a href="#">Lieferung</a>
                                    </li>
            
                                    <li>
                                        <a href="/shop">Aktionen</a>
                                    </li>
                                </ul>
                            </div>
                            <div
                                className="footer-link-widget col  wow animate__animated animate__fadeInUp"
                                data-wow-delay=".1s"
                            >
                                <h4 className="widget-title">Unternehmen</h4>
                                <ul className="footer-list  mb-sm-5 mb-md-0">
                                    {/*<li>
                                        <a href="/page-about">Über uns</a>
                                    </li>*/}
                                    
                                    <li>
                                        <a href="#">Datenschutz</a>
                                    </li>
                                    <li>
                                        <a href="#">AGB</a>
                                    </li>
                                    <li>
                                        <a href="/page-contact">Kontakt</a>
                                    </li>
                                    
                                   
                                </ul>
                            </div>
                            <div
                                className="footer-link-widget col  wow animate__animated animate__fadeInUp"
                                data-wow-delay=".4s"
                            >
                                <h4 className="widget-title ">Beliebt</h4>
                                <CategoryProductFooter/>
                            </div>
                            
                        </div>
                    </div>
                </section>
                <div
                    className="container pb-30  wow animate__animated animate__fadeInUp"
                    data-wow-delay="0"
                >
                    <div className="row align-items-center">
                        <div className="col-12 mb-30">
                            <div className="footer-bottom"></div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6">
                            <p className="font-sm mb-0">
                                &copy; {(new Date().getFullYear())},{" "}
                                <strong className="text-brand">SH Digital</strong> <br />
                                Alle Rechte vorbehalten
                            </p>
                        </div>
                        <div className="col-xl-4 col-lg-6 text-center d-none d-xl-block">
                            <div
                                className="footer-link-widget widget-install-app col  wow animate__animated animate__fadeInUp"
                                data-wow-delay=".5s"
                            >
                              
                                
                                <img
                                    className="payment_logos"
                                    src="/assets/card-icons/card_visa.svg"
                                    alt=""
                                />
                                <img
                                    className="payment_logos"
                                    src="/assets/card-icons/card_mastercard.svg"
                                    alt=""
                                />
                                <img
                                    className="payment_logos"
                                    src="/assets/card-icons/card_paypal.svg"
                                    alt=""
                                />
                                <img
                                    className="payment_logos"
                                    src="/assets/card-icons/card_twint.svg"
                                    alt=""
                                />
                                <img
                                    className="payment_logos"
                                    src="/assets/card-icons/card_postfinance_efinance.svg"
                                    alt=""
                                />
                                <img
                                    className="payment_logos"
                                    src="/assets/card-icons/card_postfinance_card.svg"
                                    alt=""
                                />
                                <img
                                    className="payment_logos"
                                    src="/assets/card-icons/card_google_pay.svg"
                                    alt=""
                                />

                                <img
                                    className="payment_logos"
                                    src="/assets/card-icons/card_apple_pay.svg"
                                    alt=""
                                />

                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-6 col-md-6 text-end d-none d-md-block">
                            <div className="mobile-social-icon">
                                <h6>Follow Us</h6>
                                <a href="#">
                                    <img
                                        src="/assets/imgs/theme/icons/icon-facebook-white.svg"
                                        alt=""
                                    />
                                </a>
                                <a href="#">
                                    <img
                                        src="/assets/imgs/theme/icons/icon-twitter-white.svg"
                                        alt=""
                                    />
                                </a>
                                <a href="#">
                                    <img
                                        src="/assets/imgs/theme/icons/icon-instagram-white.svg"
                                        alt=""
                                    />
                                </a>
                                <a href="#">
                                    <img
                                        src="/assets/imgs/theme/icons/icon-pinterest-white.svg"
                                        alt=""
                                    />
                                </a>
                                <a href="#">
                                    <img
                                        src="/assets/imgs/theme/icons/icon-youtube-white.svg"
                                        alt=""
                                    />
                                </a>
                            </div>
                            <p className="font-sm">
                                
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
