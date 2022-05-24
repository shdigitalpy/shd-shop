import React, { useState } from "react";
import Head from "next/head";
import Breadcrumb from "./Breadcrumb";
import Footer from "./Footer";
import Header from "./Header";
import MobileMenu from "./MobileMenu";
import { motion } from 'framer-motion';

const transition = { duration: 2, delay: 0.1, ease: [.43, 0.13,-0.23, 0.96]}


const Layout = ({
    children,
    parent,
    sub,
    subChild,
    category,
    noBreadcrumb,
    headerStyle,
    authPage = false,
}) => {
    const [isToggled, setToggled] = useState(false);
    const toggleClick = () => {
        setToggled(!isToggled);
        isToggled
            ? document
                  .querySelector("body")
                  .classList.remove("mobile-menu-active")
            : document
                  .querySelector("body")
                  .classList.add("mobile-menu-active");
    };

    return (
        <>
            <Head>
                <title>Bio Hundeshop</title>
                <meta name="description" content="Bio Hunde Online Shop" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {isToggled && <div className="body-overlay-1" onClick={toggleClick}></div>}

            <motion.div
                    initial="pageInitial"
                    animate="pageAnimate"
                    transition={transition}
                    variants={{
                      pageInitial: {
                        opacity: 0
                      },
                      pageAnimate: {
                        opacity: 1
                      },
                    }}>
            <Header headerStyle={headerStyle} isToggled={isToggled} toggleClick={toggleClick} authPage={authPage} />
            <MobileMenu isToggled={isToggled} toggleClick={toggleClick} />
            <main className="main">
                { !authPage && <Breadcrumb parent={parent} sub={sub} subChild={subChild} category={category} noBreadcrumb={noBreadcrumb} /> }
                {children}
            </main>
            </motion.div>
            <Footer />
        </>
    );
};

export default Layout;
