import Link from "next/link";
import React, {useEffect, useState} from "react";
import useClickOutside from "../../util/outsideClick";
import CategoryProduct2 from "../ecommerce/Filter/CategoryProduct2";
import CategoryProduct3 from "../ecommerce/Filter/CategoryProduct3";
import Search from "../ecommerce/Search";
import {signOut} from "../../rest/calls";
import Router from "next/router";
import { connect } from "react-redux";
import { clearCart } from '../../redux/action/cart';
import { clearWishlist } from '../../redux/action/wishlistAction';


const MobileMenu = ({
    isToggled,
    toggleClick,
    clearCart,
    clearWishlist
}) => {
    const [isActive, setIsActive] = useState({
        status: false,
        key: "",
    });
    const [auth, setAuth] = useState(false);

    const signOutHandler = () => {
        clearCart();
        clearWishlist();
        signOut();
        Router.push('/')
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    const handleToggle = (key) => {
        if (isActive.key === key) {
            setIsActive({
                status: false,
            });
        } else {
            setIsActive({
                status: true,
                key,
            });
        }
    };

    useEffect(() => {
        let token = localStorage.getItem('token');
        if (!token) {
            return setAuth(false);
        }
        setAuth(true);
    }, [])

    return (
        <>
            <div
                className={
                    isToggled
                        ? "mobile-header-active mobile-header-wrapper-style sidebar-visible"
                        : "mobile-header-active mobile-header-wrapper-style"
                }
            >
                <div className="mobile-header-wrapper-inner">
                    <div className="mobile-header-top">
                        <div className="mobile-header-logo">
                            <Link href="/">
                                <a>
                                    <img
                                        src="/assets/imgs/theme/logo.png"
                                        alt="logo"
                                    />
                                </a>
                            </Link>
                        </div>
                        <div className="mobile-menu-close close-style-wrap close-style-position-inherit">
                            <button
                                className="close-style search-close"
                                onClick={toggleClick}
                            >
                                <i className="icon-top"></i>
                                <i className="icon-bottom"></i>
                            </button>
                        </div>
                    </div>
                    <div className="mobile-header-content-area">
                        <div className="mobile-search search-style-3 mobile-header-border">
                            <Search />
                        </div>
                        <div className="mobile-menu-wrap mobile-header-border">
                            <div className="main-categori-wrap mobile-header-border">
                                <Link href="#">
                                    <a className="categori-button-active-2 mb-3">
                                        <span className="fi-rs-apps"></span> Browse
                                        Categories
                                    </a>
                                </Link>

                                <CategoryProduct2/>
                                <CategoryProduct3/>
                            </div>
                        </div>
                        <div className="mobile-header-info-wrap mobile-header-border">
                            { !auth && (
                                <>
                                    <div className="single-mobile-header-info">
                                        <Link href="/page-login">
                                            <a>Log In</a>
                                        </Link>
                                    </div>
                                    <div className="single-mobile-header-info">
                                        <Link href="/page-register">
                                            <a>Sign up</a>
                                        </Link>
                                    </div>
                                </>
                            )}
                            { auth && (
                                <>
                                    <div className="single-mobile-header-info">
                                        <Link href="/page-account">
                                            <a>My account</a>
                                        </Link>
                                    </div>
                                    <div className="single-mobile-header-info">
                                        <Link href="/page-login">
                                            <a onClick={signOutHandler}>Logout</a>
                                        </Link>
                                    </div>
                                </>
                            )}
                            <div className="single-mobile-header-info">
                                <Link href="#">
                                    <a>(+01) - 2345 - 6789 </a>
                                </Link>
                            </div>
                        </div>
                        <div className="mobile-social-icon">
                            <h5 className="mb-15 text-grey-4">Follow Us</h5>
                            <Link href="#">
                                <a>
                                    <img
                                        src="/assets/imgs/theme/icons/icon-facebook.svg"
                                        alt=""
                                    />
                                </a>
                            </Link>
                            <Link href="#">
                                <a>
                                    <img
                                        src="/assets/imgs/theme/icons/icon-twitter.svg"
                                        alt=""
                                    />
                                </a>
                            </Link>
                            <Link href="#">
                                <a>
                                    <img
                                        src="/assets/imgs/theme/icons/icon-instagram.svg"
                                        alt=""
                                    />
                                </a>
                            </Link>
                            <Link href="#">
                                <a>
                                    <img
                                        src="/assets/imgs/theme/icons/icon-pinterest.svg"
                                        alt=""
                                    />
                                </a>
                            </Link>
                            <Link href="#">
                                <a>
                                    <img
                                        src="/assets/imgs/theme/icons/icon-youtube.svg"
                                        alt=""
                                    />
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const mapDispatchToProps = {
    clearCart,
    clearWishlist
}

export default connect(null, mapDispatchToProps)(MobileMenu);
