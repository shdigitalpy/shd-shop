import Link from "next/link";
import React, { useEffect } from "react";
import { useState } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
    addToCart,
    decreaseQuantity,
    increaseQuantity,
} from "../../redux/action/cart";
import { addToCompare } from "../../redux/action/compareAction";
import { addToWishlist, deleteFromWishlist } from "../../redux/action/wishlistAction";
import ProductTab from "../elements/ProductTab";
import RelatedSlider from "../sliders/Related";
import ThumbSlider from "../sliders/Thumb";
import { useTranslation } from 'react-i18next';




const ProductDetails = ({
    product,
    users,
    cartItems,
    addToCompare,
    addToCart,
    addToWishlist,
    deleteFromWishlist,
    increaseQuantity,
    decreaseQuantity,
    quickView,
    wishlist,
}) => {
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const {t} = useTranslation();

    const handleCart = (product) => {
        addToCart(product);
        toast(`${t("toastify-cart")}`);
    };

    const handleCompare = (product) => {
        addToCompare(product);
        toast(`${t("toastify-compare")}`);
    };

    const handleWishlist = (product) => {
        addToWishlist(product);
        setIsWishlisted(true);
        toast(`${t("toastify-wishlist")}`);
    };

    const removeWishlist = (product) => {
        deleteFromWishlist(product.id);
        setIsWishlisted(false);
        toast(`${t("toastify-wishlist-del")}`);
    };

    useEffect(() => {
        const wishlisted = wishlist.items.find(item => item.id === product.id);
        setIsWishlisted(!!wishlisted);
    }, []);

    const inCart = cartItems.find((cartItem) => cartItem.id === product.id);

    console.log("attribut", product)

    return (
        <>
            <section className="mt-50 mb-50">
                <div className="container">
                    <div className="row flex-row-reverse">
                        <div className="col-xl-10 col-lg-12 m-auto">
                            <div className="product-detail accordion-detail">
                                <div className="row mb-50  mt-30">
                                    <div className="col-md-6 col-sm-12 col-xs-12 mb-md-0 mb-sm-5">
                                        

                                        <div className="detail-gallery">
                                            

                                            <div className="product-image-slider">
                                                <ThumbSlider product={product} />
                                            </div>
                                        </div>


                                    </div>
                                    <div className="col-md-6 col-sm-12 col-xs-12">
                                        <div className="detail-info  pr-30 pl-30">
                                            <span className="stock-status out-stock"> {t("product-saleoff")} </span>
                                            <h2 className="title-detail">{product.title}</h2>
                                            <div className="product-detail-rating">
                                                <div className="product-rate-cover text-end">
                                                    <div className="product-rate d-inline-block">
                                                        <div className="product-rating" style={{ width: `${(product.total_stars / 5) * 100}%` }}></div>
                                                    </div>
                                                    <span className="font-small ml-5 text-muted"> ({product.count_review} {t("product-review")})</span>
                                                </div>
                                            </div>
                                            <div className="clearfix product-price-cover">
                                                <div className="product-price primary-color float-left">
                                                    <span className="current-price  text-brand">CHF {product.price}</span>
                                                    

                                                    {product.oldPrice == null ?


                                                        <p></p>

                                                        : 

                                                        <span>{ product.discount && <span className="save-price font-md color3 ml-15">{product.discount.percentage}% {t("product-off")}</span> }
                                                        <span className="old-price font-md ml-15"> CHF {product.oldPrice} </span> 
                                                        </span>
                                                        }


                                                    
                                                </div>
                                            </div>

                                            <div className="short-desc mb-30">
                                                <p className="font-lg">{product.desc}</p>
                                            </div>
                                            <div className="attr-detail attr-color mb-15">
                                                <strong className="mr-10">Gewicht</strong>
                                                <ul className="list-filter color-filter">
                                                    {product.attribut_product.map((clr, i) => (
                                                        <li key={i}>
                                                            <a href="#">
                                                                <span style={{padding: "1rem",}}>{clr.name}</span>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                                </div>
                                                <div className="attr-detail attr-color mb-15">
                                                <strong className="mr-10">Grösse</strong>
                                                <ul className="list-filter color-filter">
                                                    {product.attribut_product.map((clr, i) => (
                                                        <li key={i}>
                                                            <a href="#">
                                                                <span style={{padding: "1rem",}}>{clr.name}</span>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            {/*<div className="attr-detail attr-size">
                                                <strong className="mr-10">Size</strong>
                                                <ul className="list-filter size-filter font-small">
                                                    <li className="active">
                                                        <a>M</a>
                                                    </li>
                                                    <li>
                                                        <a>L</a>
                                                    </li>
                                                    <li>
                                                        <a>XL</a>
                                                    </li>
                                                    <li>
                                                        <a>XXL</a>
                                                    </li>
                                                </ul>
                                            </div>*/}
                                            <div className="bt-1 border-color-1 mt-30 mb-30"></div>
                                            <div className="detail-extralink">
                                                <div className="detail-qty border radius">
                                                    <a onClick={(e) => (!inCart ? setQuantity(quantity > 1 ? quantity - 1 : 1) : decreaseQuantity(product?.id))} className="qty-down">
                                                        <i className="fi-rs-angle-small-down"></i>
                                                    </a>
                                                    <span className="qty-val">{inCart?.quantity || quantity}</span>
                                                    <a onClick={() => (!inCart ? setQuantity(quantity + 1) : increaseQuantity(product.id))} className="qty-up">
                                                        <i className="fi-rs-angle-small-up"></i>
                                                    </a>
                                                </div>
                                                <div className="product-extra-link2">
                                                    <button
                                                        onClick={(e) =>
                                                            handleCart({
                                                                ...product,
                                                                quantity: quantity || 1
                                                            })
                                                        }
                                                        className="button button-add-to-cart"
                                                    >
                                                       {t("product-addcart")}
                                                    </button>
                                                    { !isWishlisted && (
                                                        <a aria-label="Add To Wishlist" className="action-btn hover-up" onClick={(e) => handleWishlist(product)}>
                                                            <i className="fi-rs-heart"></i>
                                                        </a>
                                                    )}
                                                    { isWishlisted && (
                                                        <a aria-label="Remove From Wishlist" className="action-btn hover-up" onClick={(e) => removeWishlist(product)}>
                                                            <i className="fi-rs-trash"></i>
                                                        </a>
                                                    )}
                                                    {/*<a aria-label="Compare" className="action-btn hover-up" onClick={(e) => handleCompare(product)}>
                                                        <i className="fi-rs-shuffle"></i>
                                                    </a>*/}
                                                </div>
                                            </div>
                                            <ul className="product-meta font-xs color-grey mt-50">
                                                <li className="mb-5">
                                                    SKU:
                                                    <a href="#">{product.id}</a>
                                                </li>
                                                <li className="mb-5">
                                                    Tags:
                                                    { product.tags.map((tag, i) => (
                                                        <a href="#" rel="tag" className="me-1" key={i}>
                                                            { tag },
                                                        </a>
                                                    ))}
                                                </li>
                                                <li>
                                                    Shipping time:
                                                    <span className="in-stock text-success ml-5">{product.shipping_time}</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {quickView ? null : (
                                    <>
                                        <ProductTab product={product} users={users} />
                                        <div className="row mt-60">
                                            <div className="col-12">
                                                <h3 className="section-title style-1 mb-30">Related products</h3>
                                            </div>
                                            <div className="col-12">
                                                <div className="row related-products position-relative">
                                                    <RelatedSlider />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

const mapStateToProps = (state) => ({
    cartItems: state.cart,
    wishlist: state.wishlist,
});

const mapDispatchToProps = {
    addToCompare,
    addToWishlist,
    deleteFromWishlist,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
