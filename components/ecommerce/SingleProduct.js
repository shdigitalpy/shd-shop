import Link from "next/link";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/action/cart";
import { addToCompare } from "../../redux/action/compareAction";
import { openQuickView } from "../../redux/action/quickViewAction";
import { addToWishlist, deleteFromWishlist } from "../../redux/action/wishlistAction";

const SingleProduct = ({
    product,
    addToCart,
    addToCompare,
    addToWishlist,
    deleteFromWishlist,
    openQuickView,
    wishlist,
}) => {
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleCart = (product) => {
        addToCart(product);
        toast("Product added to Cart !");
    };

    const handleCompare = (product) => {
        addToCompare(product);
        toast("Added to Compare list !");
    };

    const handleWishlist = (product) => {
        addToWishlist(product);
        setIsWishlisted(true);
        toast("Added to Wishlist !");
    };

    const removeWishlist = (product) => {
        deleteFromWishlist(product.id);
        setIsWishlisted(false);
        toast("Removed From Wishlist !");
    };

    useEffect(() => {
        const wishlisted = wishlist.items.find(item => item.id === product.id);
        setIsWishlisted(!!wishlisted);
    }, []);

    return (
        <>
            <div className="product-cart-wrap mb-30">
                <div className="product-img-action-wrap">
                    <div className="product-img product-img-zoom">
                        <Link
                            href="/products/[slug]"
                            as={`/products/${product.slug}`}
                        >
                            <a>
                                { product.product_image[0] && <img
                                    className="default-img"
                                    src={product.product_image[0].image}
                                    alt={product.product_image[0].alt}
                                /> }
                                { product.product_image[1] && <img
                                    className="hover-img"
                                    src={product.product_image[1].image}
                                    alt={product.product_image[1].alt}
                                /> }
                            </a>
                        </Link>
                    </div>
                    <div className="product-action-1">
                        <a
                            aria-label="Quick view"
                            className="action-btn hover-up"
                            data-bs-toggle="modal"
                            onClick={(e) => openQuickView(product)}
                        >
                            <i className="fi-rs-eye"></i>
                        </a>
                        { !isWishlisted && (
                            <a
                                aria-label="Add To Wishlist"
                                className="action-btn hover-up"
                                onClick={(e) => handleWishlist(product)}
                            >
                                <i className="fi-rs-heart"></i>
                            </a>
                        )}
                        { isWishlisted && (
                            <a
                                aria-label="Remove from Wishlist"
                                className="action-btn hover-up"
                                onClick={(e) => removeWishlist(product)}
                            >
                                <i className="fi-rs-trash"></i>
                            </a>
                        )}
                       {/* <a
                            aria-label="Compare"
                            className="action-btn hover-up"
                            onClick={(e) => handleCompare(product)}
                        >
                            <i className="fi-rs-shuffle"></i>
                        </a>*/}
                    </div>

                    <div className="product-badges product-badges-position product-badges-mrg">
                        {!!product.trending && <span className="hot">Aktion</span>}
                        {!!product.created && <span className="new">NEU</span>}
                        {!!(product.totalSell > 100) && (
                            <span className="best">Best Sell</span>
                        )}
                        { !!(product.discount) && (
                            <>
                                {product.discount.isActive && (
                                    <span className="sale">Sale</span>
                                )}
                                {product.discount.percentage >= 5 && (
                                    <span className="hot">
                                {product.discount.percentage}%
                            </span>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className="product-content-wrap">
                    <div className="product-category">
                        <Link href="/products">
                            <a>{product.brand}</a>
                        </Link>
                    </div>
                    <h2>
                        <Link
                            href="/products/[slug]"
                            as={`/products/${product.slug}`}
                        >
                            <a>{product.title}</a>
                        </Link>
                    </h2>

                    <div className="product-rate-cover">
                        { product.count_review ? (
                            <>
                                <div className="product-rate d-inline-block">
                                    <div
                                        className="product-rating"
                                        style={{ width: `${(product.total_stars / 5) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="font-small ml-5 text-muted">
                                {" "}
                                    ({product.count_review})
                                </span>
                            </>
                        ) : <p>Not rated</p>}
                    </div>

                    {/*<div>
                        <span className="font-small text-muted">
                            By <Link href="/vendor/1"><a>NestFood</a></Link>
                        </span>
                    </div>*/}

                    <div className="product-card-bottom">
                        <div className="product-price">
                            <span>CHF {product.price} </span>
                            <span className="old-price">{product.oldPrice && `CHF ${product.oldPrice}`}</span>
                        </div>
                        <div className="add-cart">
                            <a
                                className="add"
                                onClick={(e) => handleCart(product)}
                            >
                                <i className="fi-rs-shopping-cart mr-5"></i> Add
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = state => {
    return {
        wishlist: state.wishlist,
    }
};

const mapDispatchToProps = {
    addToCart,
    addToCompare,
    addToWishlist,
    deleteFromWishlist,
    openQuickView,
};

export default connect(mapStateToProps, mapDispatchToProps)(SingleProduct);
