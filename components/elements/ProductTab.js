import React, { useState } from "react";
// import ProfileIcon from '../../public/assets/imgs/theme/icons/profile-icon.png';

const ProductTab = ({ product, users }) => {
    const [activeIndex, setActiveIndex] = useState(1);

    const reviewedUsers = product.review_product.map(review => {
        const profile = users.find(user => user.id === review.user);
        return {
            ...review,
            picture: profile && profile.picture,
        }
    });

    let reviewsCountOneStar = 0;
    let reviewsCountTwoStar = 0;
    let reviewsCountThreeStar = 0;
    let reviewsCountFourStar = 0;
    let reviewsCountFiveStar = 0;

    product.review_product.map(review => {
        switch (review.stars) {
            case 1:
                reviewsCountOneStar++;
                break;

            case 2:
                reviewsCountTwoStar++;
                break;

            case 3:
                reviewsCountThreeStar++;
                break;

            case 4:
                reviewsCountFourStar++;
                break;

            case 5:
                reviewsCountFiveStar++;
                break;

            default:
                return;
        }
    });

    const handleOnClick = (index) => {
        setActiveIndex(index);
    };

    return (
        <div className="product-info">
            <div className="tab-style3">
                <ul className="nav nav-tabs text-uppercase">
                    <li className="nav-item">
                        <a className={activeIndex === 1 ? "nav-link active" : "nav-link"} id="Description-tab" data-bs-toggle="tab" onClick={() => handleOnClick(1)}>
                            Description
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className={activeIndex === 2 ? "nav-link active" : "nav-link"} id="Additional-info-tab" data-bs-toggle="tab" onClick={() => handleOnClick(2)}>
                            Additional info
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className={activeIndex === 3 ? "nav-link active" : "nav-link"} id="Reviews-tab" data-bs-toggle="tab" onClick={() => handleOnClick(3)}>
                            Reviews ({product.review_product.length})
                        </a>
                    </li>
                </ul>
                <div className="tab-content shop_info_tab entry-main-content">
                    <div className={activeIndex === 1 ? "tab-pane fade show active" : "tab-pane fade"} id="Description">
                        <div className="">
                            <p>{ product.text }</p>
                        </div>
                    </div>
                    <div className={activeIndex === 2 ? "tab-pane fade show active" : "tab-pane fade"} id="Additional-info">
                        <table className="font-md">
                            <tbody>
                                <tr className="stand-up">
                                    <th>Stand Up</th>
                                    <td>
                                        <p>35″L x 24″W x 37-45″H(front to back wheel)</p>
                                    </td>
                                </tr>
                                <tr className="folded-wo-wheels">
                                    <th>Folded (w/o wheels)</th>
                                    <td>
                                        <p>32.5″L x 18.5″W x 16.5″H</p>
                                    </td>
                                </tr>
                                <tr className="folded-w-wheels">
                                    <th>Folded (w/ wheels)</th>
                                    <td>
                                        <p>32.5″L x 24″W x 18.5″H</p>
                                    </td>
                                </tr>
                                <tr className="door-pass-through">
                                    <th>Door Pass Through</th>
                                    <td>
                                        <p>24</p>
                                    </td>
                                </tr>
                                <tr className="frame">
                                    <th>Frame</th>
                                    <td>
                                        <p>Aluminum</p>
                                    </td>
                                </tr>
                                <tr className="weight-wo-wheels">
                                    <th>Weight (w/o wheels)</th>
                                    <td>
                                        <p>20 LBS</p>
                                    </td>
                                </tr>
                                <tr className="weight-capacity">
                                    <th>Weight Capacity</th>
                                    <td>
                                        <p>60 LBS</p>
                                    </td>
                                </tr>
                                <tr className="width">
                                    <th>Width</th>
                                    <td>
                                        <p>24″</p>
                                    </td>
                                </tr>
                                <tr className="handle-height-ground-to-handle">
                                    <th>Handle height (ground to handle)</th>
                                    <td>
                                        <p>37-45″</p>
                                    </td>
                                </tr>
                                <tr className="wheels">
                                    <th>Wheels</th>
                                    <td>
                                        <p>12″ air / wide track slick tread</p>
                                    </td>
                                </tr>
                                <tr className="seat-back-height">
                                    <th>Seat back height</th>
                                    <td>
                                        <p>21.5″</p>
                                    </td>
                                </tr>
                                <tr className="head-room-inside-canopy">
                                    <th>Head room (inside canopy)</th>
                                    <td>
                                        <p>25″</p>
                                    </td>
                                </tr>
                                <tr className="pa_color">
                                    <th>Color</th>
                                    <td>
                                        <p>{ product.variations.join(', ') }</p>
                                    </td>
                                </tr>
                                <tr className="pa_size">
                                    <th>Size</th>
                                    <td>
                                        <p>M, S</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={activeIndex === 3 ? "tab-pane fade show active" : "tab-pane fade"} id="Reviews">
                        <div className="comments-area">
                            <div className="row">
                                <div className="col-lg-8">
                                    <h4 className="mb-30">Customer questions & answers</h4>
                                    <div className="comment-list">
                                        { reviewedUsers.map((review, index) => (
                                            <div className="single-comment justify-content-between d-flex" key={index}>
                                                <div className="user justify-content-between d-flex">
                                                    <div className="thumb text-center">
                                                        <img src={ review.picture } alt="Avatar" />
                                                        <h6>
                                                            <a href="#" style={{ textTransform: "Capitalize"}}>{ review.username }</a>
                                                        </h6>
                                                    </div>
                                                    <div className="desc">
                                                        <div className="product-rate d-inline-block">
                                                            <div
                                                                className="product-rating"
                                                                style={{
                                                                    width: `${(review.stars / 5) * 100}%`
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <p>{ review.text }</p>
                                                        <div className="d-flex justify-content-between">
                                                            <div className="d-flex align-items-center">
                                                                <p className="font-xs mr-30">{ new Date(review.date).toLocaleDateString() }</p>
                                                                {/*<a href="#" className="text-brand btn-reply">
                                                                    Reply
                                                                    <i className="fi-rs-arrow-right"></i>
                                                                </a>*/}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <h4 className="mb-30">Customer reviews</h4>
                                    <div className="d-flex mb-30">
                                        <div className="product-rate d-inline-block mr-15">
                                            <div
                                                className="product-rating"
                                                style={{
                                                    width: `${(product.total_stars / 5) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                        <h6>{product.total_stars} out of 5</h6>
                                    </div>
                                    <div className="progress">
                                        <span>5 star</span>
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{
                                                width: product.review_product.length ? `${(reviewsCountFiveStar / product.review_product.length) * 100}%` : '0%'
                                            }}
                                            aria-valuenow={(reviewsCountFiveStar / product.review_product.length) * 100}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            {product.review_product.length ? Math.floor((reviewsCountFiveStar / product.review_product.length) * 100) : 0}%
                                        </div>
                                    </div>
                                    <div className="progress">
                                        <span>4 star</span>
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{
                                                width: product.review_product.length ? `${(reviewsCountFourStar / product.review_product.length) * 100}%` : '0%'
                                            }}
                                            aria-valuenow={(reviewsCountFourStar / product.review_product.length) * 100}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            {product.review_product.length ? Math.floor((reviewsCountFourStar / product.review_product.length) * 100) : 0}%
                                        </div>
                                    </div>
                                    <div className="progress">
                                        <span>3 star</span>
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{
                                                width: product.review_product.length ? `${(reviewsCountThreeStar / product.review_product.length) * 100}%` : '0%'
                                            }}
                                            aria-valuenow={(reviewsCountThreeStar / product.review_product.length) * 100}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            {product.review_product.length ? Math.floor((reviewsCountThreeStar / product.review_product.length) * 100) : 0}%
                                        </div>
                                    </div>
                                    <div className="progress">
                                        <span>2 star</span>
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{
                                                width:product.review_product.length ?  `${(reviewsCountTwoStar / product.review_product.length) * 100}%` : '0%'
                                            }}
                                            aria-valuenow={(reviewsCountTwoStar / product.review_product.length) * 100}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            {product.review_product.length ? Math.floor((reviewsCountTwoStar / product.review_product.length) * 100) : 0}%
                                        </div>
                                    </div>
                                    <div className="progress mb-30">
                                        <span>1 star</span>
                                        <div
                                            className="progress-bar"
                                            role="progressbar"
                                            style={{
                                                width:product.review_product.length ?  `${(reviewsCountOneStar / product.review_product.length) * 100}%` : '0%'
                                            }}
                                            aria-valuenow={(reviewsCountOneStar / product.review_product.length) * 100}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        >
                                            {product.review_product.length ? Math.floor((reviewsCountOneStar / product.review_product.length) * 100) : 0}%
                                        </div>
                                    </div>
                                    <a href="#" className="font-xs text-muted">
                                        How are ratings calculated?
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="comment-form">
                            <h4 className="mb-15">Add a review</h4>
                            <div className="product-rate d-inline-block mb-30"></div>
                            <div className="row">
                                <div className="col-lg-8 col-md-12">
                                    <form className="form-contact comment_form" action="#" id="commentForm">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <textarea className="form-control w-100" name="comment" id="comment" cols="30" rows="9" placeholder="Write Comment"></textarea>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <input className="form-control" name="name" id="name" type="text" placeholder="Name" />
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-group">
                                                    <input className="form-control" name="email" id="email" type="email" placeholder="Email" />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group">
                                                    <input className="form-control" name="website" id="website" type="text" placeholder="Website" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <button type="submit" className="button button-contactForm">
                                                Submit Review
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductTab;
