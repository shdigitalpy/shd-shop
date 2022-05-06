import React, { useEffect, useState } from "react";
import "react-input-range/lib/css/index.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import { Provider } from "react-redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "react-responsive-modal/styles.css";
// Swiper Slider
import "swiper/css";
import "swiper/css/navigation";
import Router from 'next/router';
import StorageWrapper from "../components/ecommerce/storage-wrapper";
import "../public/assets/css/main.css";
import store from "../redux/store";
import Preloader from "./../components/elements/Preloader";
import { motion } from 'framer-motion';




function MyApp({ Component, pageProps, router  }) {
    const [loading, setLoading] = useState(false);
    const [auth, setAuth] = useState(null);

    const validateRedirect = () => {
        if (auth === false) {
            Router.push('/page-login');
            return false;
        }

        return true;
    };

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1500);

        if (typeof window !== "undefined") {
            window.WOW = require("wowjs");
        }
        new WOW.WOW().init();

        let token = localStorage.getItem('token');
        console.log("app js token", token)

        if (!token) {
            setAuth(false);
            // return Router.push('/page-login')
        } else {
            setAuth(true);
        }
    }, []);
    return (
        <>
            {!loading ? (
                <Provider store={store}>
                    <StorageWrapper>
                    <motion.div key={router.route} 
                    initial="pageInitial" 
                    animate="pageAnimate" 

                    variants={{
                      pageInitial: {
                        opacity: 0
                      },
                      pageAnimate: {
                        opacity: 1
                      },
                    }}>
                            <Component {...pageProps} auth={auth} validateRedirect={validateRedirect} />
                            </motion.div>
                            <ToastContainer />
                    </StorageWrapper>
                </Provider>
            ) : (
                <Preloader />
            )}
        </>
    );
}

export default MyApp;
