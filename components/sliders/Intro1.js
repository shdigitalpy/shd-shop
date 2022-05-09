import SwiperCore, { Navigation, Pagination } from "swiper";
import { useTranslation } from 'react-i18next';
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

SwiperCore.use([Navigation, Pagination]);

const Intro1 = () => {
    const {t} = useTranslation();

    return (
        <>
            <Swiper
                slidesPerView={1}
                spaceBetween={0}
                loop={true}
                pagination={true}
                navigation={{
                    prevEl: ".custom_prev_i1",
                    nextEl: ".custom_next_i1",
                }}
                className="hero-slider-1 style-4 dot-style-1 dot-style-1-position-1"
            >
                <SwiperSlide>
                    <div
                        className="single-hero-slider single-animation-wrap"
                        style={{
                            backgroundImage:
                                "url(assets/imgs/slider/slider-1.png)",
                        }}
                    >
                        <div className="slider-content">
                            <h1 className="display-2 mb-40">
                                {/*Don’t miss amazing
                                <br />
                                grocery deals*/}
                                {t("main-banner-heading-1")}
                            </h1>
                            <h2 className="mb-65">
                                {t("newsletter")}
                            </h2>
                            
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div
                        className="single-hero-slider single-animation-wrap"
                        style={{
                            backgroundImage:
                                "url(assets/imgs/slider/slider-2.png)",
                        }}
                    >
                        <div className="slider-content">
                            <h1 className="display-2 mb-40">
                                {t("main-banner-heading-2")}
                            </h1>
                            <p className="mb-65">
                                {t("banner-discount")}
                            </p>
                            <form className="form-subcriber d-flex">
                                <input
                                    type="email"
                                    placeholder={t("newsletter-input-placeholder")}
                                />
                                <button className="btn" type="submit">
                                    {t("newsletter-subscribe")}
                                </button>
                            </form>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>

            <div className="slider-arrow hero-slider-1-arrow">
                <span className="slider-btn slider-prev slick-arrow custom_prev_i1">
                    <i className="fi-rs-angle-left"></i>
                </span>
                <span className="slider-btn slider-next slick-arrow custom_next_i1">
                    <i className="fi-rs-angle-right"></i>
                </span>
            </div>
        </>
    );
};

export default Intro1;
