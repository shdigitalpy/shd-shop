import Link from "next/link";
import React, { useEffect, useState } from "react";
import i18n from '../../i18n';
import Router from 'next/router';
import { connect } from "react-redux";
import CategoryProduct2 from "../ecommerce/Filter/CategoryProduct2";
import CategoryProduct3 from "../ecommerce/Filter/CategoryProduct3";
import Search from "../ecommerce/Search";
import { signOut } from "../../rest/calls";
import { clearCart } from '../../redux/action/cart';
import { clearWishlist } from '../../redux/action/wishlistAction';
import { FaPhoneSquareAlt as Icon } from 'react-icons/fa';

const Header = ({
    totalCartItems,
    totalCompareItems,
    toggleClick,
    totalWishlistItems,
    authPage,
    clearCart,
    clearWishlist,
}) => {
    const [isToggled, setToggled] = useState(false);
    const [auth, setAuth] = useState(false);
    const [scroll, setScroll] = useState(0);
    const [lang, setLang] = useState("en");

    useEffect(() => {
        document.addEventListener("scroll", () => {
            const scrollCheck = window.scrollY >= 100;
            if (scrollCheck !== scroll) {
                setScroll(scrollCheck);
            }
        });

        let token = localStorage.getItem('token');
        if (!token) {
            return setAuth(false);
        }
        setAuth(true);
    }, []);

    const handleToggle = () => setToggled(!isToggled);

    const changeLanguageHandler = (ln) => {
        i18n.changeLanguage(ln)
            .then(() => {
                localStorage.setItem("lang", ln);
                setLang(ln);
            });
    };

    const signOutHandler = () => {
        clearCart();
        clearWishlist();
        signOut();
        Router.push('/')
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    useEffect(() => {
        const language = localStorage.getItem("lang");
        if (language) {
            changeLanguageHandler(language);
        }
    });

    return (
        <>
            <header className="header-area header-style-1 header-height-2">
                <div className="mobile-promotion">
                    <span>
                        Grand opening, <strong>up to 15%</strong> off all items.
                        Only <strong>3 days</strong> left
                    </span>
                </div>
                <div className="header-top header-top-ptb-1 d-lg-block">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-3 col-lg-4">
                                {/*<div className="header-info">
                                    <ul>
                                        <li>
                                            <Link href="/page-about">
                                                <a>About Us</a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/page-account">
                                                <a>My Account</a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/shop-wishlist">
                                                <a>Wishlist</a>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/page-account">
                                                <a>Order Tracking</a>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>*/}
                            </div>
                            <div className="col-xl-6 col-lg-4">
                                {/*<div className="text-center">
                                    <div
                                        id="news-flash"
                                        className="d-inline-block"
                                    >
                                        <ul>
                                            <li>
                                                Get great devices up to 50% off
                                                <Link href="/shop-grid-right">
                                                    <a> View details</a>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>*/}
                            </div>
                            <div className="col-xl-3 col-lg-4">
                                <div className="header-info header-info-right">
                                    <ul>
                                        <li>
                                            <strong className="text-brand">
                                                
                                               Gratis Lieferung ab CHF 100.--
                                            </strong>
                                        </li>
                                        <li>
                                            <Link href="/#">
                                                <a className="language-dropdown-active">
                                                    <i className="fi-rs-world"></i>
                                                    { lang === "en" ? "English" : "German" }
                                                    <i className="fi-rs-angle-small-down"></i>
                                                </a>
                                            </Link>
                                            <ul className="language-dropdown">
                                                { lang === "en" && (
                                                    <li>
                                                        <a className="link-dark" onClick={() => changeLanguageHandler("de")}>German</a>
                                                    </li>
                                                )}
                                                { lang === "de" && (
                                                    <li>
                                                        <a className="link-dark" onClick={() => changeLanguageHandler("en")}>English</a>
                                                    </li>
                                                )}
                                            </ul>
                                        </li>
                                        
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="header-middle header-middle-ptb-1 d-none d-lg-block">
                    <div className="container">
                        <div className="header-wrap justify-content-between">
                            <div className="logo logo-width-1">
                                <Link href="/">
                                    <a>
                                        <img
                                            src="/assets/imgs/demo-shop-logo.webp"
                                            alt="logo"
                                        />
                                    </a>
                                </Link>
                            </div>
                            <div className="header-action-icon-2 d-block d-lg-none">
                                <div
                                    className="burger-icon burger-icon-white"
                                    onClick={toggleClick}
                                >
                                    <span className="burger-icon-top"></span>
                                    <span className="burger-icon-mid"></span>
                                    <span className="burger-icon-bottom"></span>
                                </div>
                            </div>
                            { !authPage && <div className="header-right d-none d-lg-flex">
                                <div className="search-style-3">
                                    <Search />
                                </div>
                                <div className="header-action-right">
                                    <div className="header-action-2">
                                        {/*<div className="search-location">
                                            <form action="#">
                                                <select className="select-active">
                                                    <option>
                                                        Your Location
                                                    </option>
                                                    <option>Alabama</option>
                                                    <option>Alaska</option>
                                                    <option>Arizona</option>
                                                    <option>Delaware</option>
                                                    <option>Florida</option>
                                                    <option>Georgia</option>
                                                    <option>Hawaii</option>
                                                    <option>Indiana</option>
                                                    <option>Maryland</option>
                                                    <option>Nevada</option>
                                                    <option>New Jersey</option>
                                                    <option>New Mexico</option>
                                                    <option>New York</option>
                                                </select>
                                            </form>
                                        </div>*/}
                                        {/*<div className="header-action-icon-2">
                                            <Link href="/shop-compare">
                                                <a>
                                                    <img
                                                        className="svgInject"
                                                        alt="Evara"
                                                        src="/assets/imgs/theme/icons/icon-compare.svg"
                                                    />
                                                    <span className="pro-count blue">
                                                        {totalCompareItems}
                                                    </span>
                                                </a>
                                            </Link>
                                            <Link href="/shop-compare">
                                                <a>
                                                    <span className="lable ml-0">
                                                        Compare
                                                    </span>
                                                </a>
                                            </Link>
                                        </div>*/}
                                        <div className="header-action-icon-2">
                                            <Link href="/shop-wishlist">
                                                <a>
                                                    <img
                                                        className="svgInject"
                                                        alt="Evara"
                                                        src="/assets/imgs/theme/icons/icon-heart.svg"
                                                    />
                                                    <span className="pro-count blue">
                                                        {totalWishlistItems}
                                                    </span>
                                                </a>
                                            </Link>
                                            <Link href="/shop-wishlist">
                                                <span className="lable">
                                                    Merkzettel
                                                </span>
                                            </Link>
                                        </div>
                                        <div className="header-action-icon-2">
                                            <Link href="/shop-cart">
                                                <a className="mini-cart-icon">
                                                    <img
                                                        alt="Evara"
                                                        src="/assets/imgs/theme/icons/icon-cart.svg"
                                                    />
                                                    <span className="pro-count blue">
                                                        {totalCartItems}
                                                    </span>
                                                </a>
                                            </Link>
                                            <Link href="/shop-cart">
                                                <a>
                                                    <span className="lable">
                                                        Warenkorb
                                                    </span>
                                                </a>
                                            </Link>
                                        </div>

                                        { (!auth && !authPage) && (
                                            <div className="header-action-icon-2">
                                                <Link href="/page-login"><a>
                                                    <img
                                                        className="svgInject"
                                                        alt="Nest"
                                                        src="/assets/imgs/theme/icons/icon-user.svg"
                                                    />
                                                </a></Link>
                                                <Link href="/page-login"><a>
                                                <span className="lable ml-0">
                                                    Konto
                                                </span>
                                                </a></Link>
                                            </div>
                                        )}
                                        { auth && <div className="header-action-icon-2">
                                            <Link href="/page-account"><a>
                                                <img
                                                    className="svgInject"
                                                    alt="Nest"
                                                    src="/assets/imgs/theme/icons/icon-user.svg"
                                                />
                                            </a></Link>
                                            <Link href="/page-account"><a>
                                                <span className="lable ml-0">
                                                    Account
                                                </span>
                                            </a></Link>
                                            <div className="cart-dropdown-wrap cart-dropdown-hm2 account-dropdown">
                                                <ul>
                                                    <li>
                                                        <Link href="/page-account">
                                                            <a>
                                                                <i className="fi fi-rs-user mr-10"></i>
                                                                My Account
                                                            </a></Link>
                                                    </li>
                                                    {/*<li>
                                                        <Link href="/page-account"><a>
                                                            <i className="fi fi-rs-location-alt mr-10"></i>
                                                            Order Tracking
                                                        </a></Link>
                                                    </li>*/}
                                                    {/*<li>
                                                        <Link href="/page-account"><a>
                                                            <i className="fi fi-rs-label mr-10"></i>
                                                            My Voucher
                                                        </a></Link>
                                                    </li>*/}
                                                    <li>
                                                        <Link href="/shop-wishlist"><a>
                                                            <i className="fi fi-rs-heart mr-10"></i>
                                                            My Wishlist
                                                        </a></Link>
                                                    </li>
                                                    {/*<li>
                                                        <Link href="/page-account"><a>
                                                            <i className="fi fi-rs-settings-sliders mr-10"></i>
                                                            Setting
                                                        </a></Link>
                                                    </li>*/}
                                                    <li>
                                                        <a onClick={signOutHandler}>
                                                            <i className="fi fi-rs-sign-out mr-10"></i>
                                                            Sign out
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div> }
                                    </div>
                                </div>
                            </div> }
                        </div>

                        { !authPage && <div className="header-right d-block d-lg-none">
                            <div className="search-style-2">
                                <Search />
                            </div>
                            <div className="header-action-right">
                                <div className="header-action-2">
                                    <div className="header-action-icon-2">
                                        <Link href="/shop-wishlist">
                                            <a>
                                                <img
                                                    className="svgInject"
                                                    alt="Evara"
                                                    src="/assets/imgs/theme/icons/icon-heart.svg"
                                                />
                                                <span className="pro-count blue">
                                                        {totalWishlistItems}
                                                    </span>
                                            </a>
                                        </Link>
                                        <Link href="/shop-wishlist">
                                                <span className="lable">
                                                    Wishlist
                                                </span>
                                        </Link>
                                    </div>
                                    <div className="header-action-icon-2">
                                        <Link href="/shop-cart">
                                            <a className="mini-cart-icon">
                                                <img
                                                    alt="Evara"
                                                    src="/assets/imgs/theme/icons/icon-cart.svg"
                                                />
                                                <span className="pro-count blue">
                                                        {totalCartItems}
                                                    </span>
                                            </a>
                                        </Link>
                                        <Link href="/shop-cart">
                                            <a>
                                                    <span className="lable">
                                                        Cart
                                                    </span>
                                            </a>
                                        </Link>
                                    </div>

                                    { (!auth && !authPage) && (
                                        <div className="header-action-icon-2">
                                            <Link href="/page-login"><a>
                                                <img
                                                    className="svgInject"
                                                    alt="Nest"
                                                    src="/assets/imgs/theme/icons/icon-user.svg"
                                                />
                                            </a></Link>
                                            <Link href="/page-login"><a>
                                                <span className="lable ml-0">
                                                    Account
                                                </span>
                                            </a></Link>
                                        </div>
                                    )}
                                    { auth && <div className="header-action-icon-2">
                                        <Link href="/page-account"><a>
                                            <img
                                                className="svgInject"
                                                alt="Nest"
                                                src="/assets/imgs/theme/icons/icon-user.svg"
                                            />
                                        </a></Link>
                                        <Link href="/page-account"><a>
                                                <span className="lable ml-0">
                                                    Account
                                                </span>
                                        </a></Link>
                                        <div className="cart-dropdown-wrap cart-dropdown-hm2 account-dropdown">
                                            <ul>
                                                <li>
                                                    <Link href="/page-account">
                                                        <a>
                                                            <i className="fi fi-rs-user mr-10"></i>
                                                            My Account
                                                        </a></Link>
                                                </li>
                                                {/*<li>
                                                        <Link href="/page-account"><a>
                                                            <i className="fi fi-rs-location-alt mr-10"></i>
                                                            Order Tracking
                                                        </a></Link>
                                                    </li>*/}
                                                {/*<li>
                                                        <Link href="/page-account"><a>
                                                            <i className="fi fi-rs-label mr-10"></i>
                                                            My Voucher
                                                        </a></Link>
                                                    </li>*/}
                                                <li>
                                                    <Link href="/shop-wishlist"><a>
                                                        <i className="fi fi-rs-heart mr-10"></i>
                                                        My Wishlist
                                                    </a></Link>
                                                </li>
                                                {/*<li>
                                                        <Link href="/page-account"><a>
                                                            <i className="fi fi-rs-settings-sliders mr-10"></i>
                                                            Setting
                                                        </a></Link>
                                                    </li>*/}
                                                <li>
                                                    <a onClick={signOutHandler}>
                                                        <i className="fi fi-rs-sign-out mr-10"></i>
                                                        Sign out
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div> }
                                </div>
                            </div>
                        </div> }
                    </div>
                </div>
                { <div
                    className={
                        scroll
                            ? "header-bottom header-bottom-bg-color sticky-bar stick"
                            : "header-bottom header-bottom-bg-color sticky-bar"
                    }
                >
                    <div className="container">
                        <div className="header-wrap header-space-between position-relative">
                            <div className="logo logo-width-1 d-block d-lg-none">
                                <Link href="/">
                                    <a>
                                        <img
                                            src="/assets/imgs/theme/logo.png"
                                            alt="logo"
                                        />
                                    </a>
                                </Link>
                            </div>
                            <div className="header-nav d-none d-lg-flex">
                                <div className="main-categori-wrap d-none d-lg-block">
                                    <a
                                        className="categories-button-active"
                                        onClick={handleToggle}
                                    >
                                        <span className="fi-rs-apps"></span>
                                        
                                    </a>

                                    <div
                                        className={
                                            isToggled
                                                ? "categories-dropdown-wrap categories-dropdown-active-large font-heading open"
                                                : "categories-dropdown-wrap categories-dropdown-active-large font-heading"
                                        }
                                    >
                                        <div className="d-flex categori-dropdown-inner">
                                            <CategoryProduct2/>
                                            <CategoryProduct3/>
                                        </div>
                                    </div>
                                </div>
                                <div className="main-menu main-menu-padding-1 main-menu-lh-2 d-none d-lg-block  font-heading">
                                    <nav>
                                        <ul>
                                            <li className="hot-deals">
                                                <img
                                                    src="/assets/imgs/theme/icons/icon-hot.svg"
                                                    alt="hot deals"
                                                />
                                                <Link href="/products"><a>
                                                    Hot
                                                </a>
                                                </Link>
                                            </li>

                                            <li>
                                                <Link href="/page-about">
                                                    <a>About</a>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/blog-category-grid">
                                                    <a>
                                                        Blog
                                                        <i className="fi-rs-angle-down"></i>
                                                    </a>
                                                </Link>
                                                <ul className="sub-menu">
                                                    <li>
                                                        <Link href="/blog-category-grid">
                                                            <a>
                                                                Blog Category
                                                                Grid
                                                            </a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/blog-category-list">
                                                            <a>
                                                                Blog Category
                                                                List
                                                            </a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/blog-category-big">
                                                            <a>
                                                                Blog Category
                                                                Big
                                                            </a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/blog-category-fullwidth">
                                                            <a>
                                                                Blog Category
                                                                Wide
                                                            </a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/#">
                                                            <a>
                                                                Single Post
                                                                <i className="fi-rs-angle-right"></i>
                                                            </a>
                                                        </Link>
                                                        <ul className="level-menu level-menu-modify">
                                                            <li>
                                                                <Link href="/blog-post-left">
                                                                    <a>
                                                                        Left
                                                                        Sidebar
                                                                    </a>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/blog-post-right">
                                                                    <a>
                                                                        Right
                                                                        Sidebar
                                                                    </a>
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link href="/blog-post-fullwidth">
                                                                    <a>
                                                                        No
                                                                        Sidebar
                                                                    </a>
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                <Link href="/#">
                                                    <a>
                                                        Pages
                                                        <i className="fi-rs-angle-down"></i>
                                                    </a>
                                                </Link>
                                                <ul className="sub-menu">
                                                    <li>
                                                        <Link href="/page-about">
                                                            <a>About Us</a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/page-contact">
                                                            <a>Contact</a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/page-account">
                                                            <a>My Account</a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/page-login-register">
                                                            <a>
                                                                login/register
                                                            </a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/page-purchase-guide">
                                                            <a>
                                                                Purchase Guide
                                                            </a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/page-privacy-policy">
                                                            <a>
                                                                Privacy Policy
                                                            </a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/page-terms">
                                                            <a>
                                                                Terms of Service
                                                            </a>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/page-404">
                                                            <a>404 Page</a>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </li>
                                             <li>
                                                <Link href="/page-contact">
                                                    <a>Contact</a>
                                                </Link>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                            <div className="hotline d-none d-lg-flex">
                                <Icon

                                className="hphone"
                                
                                />

                                <p>
                                    052 730 55 55<span>Telefon Support</span>
                                </p>
                            </div>

                            <div className="header-action-right d-block d-lg-none">
                                <div className="header-action-2">
                                    <div className="header-action-icon-2">
                                        <Link href="/shop-wishlist">
                                            <a>
                                                <img
                                                    alt="Evara"
                                                    src="/assets/imgs/theme/icons/icon-heart.svg"
                                                />
                                                <span className="pro-count white">
                                                    {totalWishlistItems}
                                                </span>
                                            </a>
                                        </Link>
                                    </div>
                                    <div className="header-action-icon-2">
                                        <Link href="/shop-cart">
                                            <a className="mini-cart-icon">
                                                <img
                                                    alt="Evara"
                                                    src="/assets/imgs/theme/icons/icon-cart.svg"
                                                />
                                                <span className="pro-count white">
                                                    {totalCartItems}
                                                </span>
                                            </a>
                                        </Link>
                                    </div>
                                    <div className="header-action-icon-2 d-block d-lg-none" onClick={toggleClick}>
                                        <div className="burger-icon burger-icon-white">
                                            <span className="burger-icon-top"></span>
                                            <span className="burger-icon-mid"></span>
                                            <span className="burger-icon-bottom"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> }
            </header>
        </>
    );
};

const mapStateToProps = (state) => ({
    totalCartItems: state.cart.length,
    totalCompareItems: state.compare.items.length,
    totalWishlistItems: state.wishlist.items.length,
});

const mapDispatchToProps = {
    clearCart,
    clearWishlist,
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
