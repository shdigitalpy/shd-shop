import React, { useState } from "react";
import Head from "next/head";
import Breadcrumb from "./Breadcrumb";
import Footer from "./Footer";
import Header from "./Header";
import MobileMenu from "./MobileMenu";
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const transition = { duration: 2, delay: 0.1, ease: [.43, 0.13,-0.23, 0.96]}



const Layout = ({
    children,
    parent,
    sub,
    subChild,
    category,
    catSlug,
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

     const router = useRouter();
      const site = 'https://www.bio-hundeshop.ch'
      const canonicalURL = site + router.asPath;
      const currentURL = canonicalURL;
      {/*const siteen = site + "/en"*/}

    return (
        <>
            <Head>

                {/* Viewport, Favicon */}
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1.0, user-scalable=0"
                />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />
                
                <link rel="shortcut icon" type="image/x-icon" href="/favicon-32x32.ico" />
                <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
          
                <meta name="msapplication-square310x310logo" content="/mstile-310x310.png" />
                <meta name="msapplication-TileColor" content="#000000" />


                {/* Title, Description */}
                <title>Bio Hundeshop</title>
                <meta name="description" content="Bio Hunde Online Shop" />
                 

                {/* Canonical, hreflang */}
                <link rel="canonical" href={canonicalURL} />
                 {/*<link rel="alternate" hrefLang="en-US" href={siteen} />
                <link rel="alternate" hrefLang="de-DE" href={sitede} />*/}

                {/* Open Graph 
                <meta property="og:url" content={currentURL} key="ogurl" />
                <meta property="og:image" content={previewImage.src} key="ogimage" />
                <meta property="og:site_name" content={name} key="ogsitename" />
                <meta property="og:title" content={siteTitle} key="ogtitle" />
                <meta
                  property="og:description"
                  content={siteDescription}
                  key="ogdesc"
                />*/}
    
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
                { !authPage && <Breadcrumb parent={parent} sub={sub} subChild={subChild} category={category} catSlug={catSlug} noBreadcrumb={noBreadcrumb} /> }
                {children}
            </main>
            </motion.div>
            <Footer />
        </>
    );
};

export default Layout;
