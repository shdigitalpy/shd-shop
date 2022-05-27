import React, { useState } from "react";
import SwiperCore, { Navigation, Thumbs } from "swiper";
import "swiper/css/thumbs";
import { Swiper, SwiperSlide } from "swiper/react";
import Zoom from "react-img-zoom";

SwiperCore.use([Navigation, Thumbs]);

const ThumbSlider = ({ product }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div>
            <Swiper
                style={{
                    "--swiper-navigation-color": "#34421e",
                    "--swiper-pagination-color": "#34421e",
                }}
                loop={true}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                className="mySwiper2"
            >
                {product.product_gallery.map((item, i) => (
                    <SwiperSlide key={i}>
                        <img itemProp="image" src={item.image} alt={item.alt} />
                        
                        {/*<Zoom
                            img={item.image}

                            zoomScale={2}
                            width={550}
                            height={500}
                            transitionTime={0.5}

                        />*/}

                    </SwiperSlide>
                ))}
            </Swiper>
            <Swiper
                onSwiper={setThumbsSwiper}
                loop={false}
                spaceBetween={10}
                slidesPerView={5}
                freeMode={true}
                watchSlidesProgress={true}
                className="mySwiper"
            >
                {product.product_gallery.map((item, i) => (
                    <SwiperSlide key={i}>
                        <img src={item.image} alt={item.alt} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ThumbSlider;
