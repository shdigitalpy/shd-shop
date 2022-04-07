import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import Layout from "../components/layout/Layout";
import { loadStripe } from '@stripe/stripe-js';

import Link from "next/link";
import {
    clearCart,
    closeCart,
    decreaseQuantity,
    deleteFromCart,
    increaseQuantity,
    openCart,
} from "../redux/action/cart";
import getStripe from "../lib/get-stripe";
import {getCurrentUser, getCoupons, getShippingCost} from "../rest/calls";


// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
/*const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);*/

const Cart = ({
    openCart,
    cartItems,
    activeCart,
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    deleteFromCart,
    clearCart,
    auth,
}) => {
    const [selectExisting, setSelectExisting] = useState("");
    const [currentUser, setCurrentUser] = useState({});
    const [shippingAddress, setShippingAddress] = useState(null);
    const [billingAddress, setBillingAddress] = useState(null);
    const [billingAddressSame, setBillingAddressSame] = useState(true);
    const [showAddressForm, setShowAddressForm] = useState(true);
    const [coupons, setCoupons] = useState(null);
    const [shippingCost, setShippingCost] = useState(null);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponValid, setCouponValid] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    const price = () => {
        let price = 0;
        cartItems.forEach((item) => (price += item.price * item.quantity));

        return price.toFixed(2);
    };

    const addressSubmitHandler = (e) => {
        e.preventDefault();

        const shippingData = {
            number: e.target.number.value,
            street: e.target.street.value,
            city: e.target.city.value,
            country: e.target.country.value,
            zipcode: e.target.zipcode.value,
        };

        setShippingAddress(shippingData);

        if (!billingAddressSame) {
            const billingData = {
                number: e.target.b_address_number.value,
                street: e.target.b_address_street.value,
                city: e.target.b_address_city.value,
                country: e.target.b_address_country.value,
                zipcode: e.target.b_address_zipcode.value,
            };

            setBillingAddress(billingData);
        } else {
            setBillingAddress(shippingData);
        }

    }

    const addressChangeClickHandler = () => {
        if (JSON.stringify(shippingAddress) !== JSON.stringify(billingAddress)) {
            setBillingAddressSame(false);
        }

        setShowAddressForm(true);
    };

    const redirectToCheckout = async () => {
        const { data: { id } } = await axios.post('/api/checkout_sessions', {
            items: cartItems.map(item => ({
                price: item.stripe_price_id,
                quantity: item.quantity,
            })),
            discounts: appliedCoupon ? [{coupon: appliedCoupon.id}] : null,
            shippingCost: shippingCost * 100,
        });

        const stripe = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        await stripe.redirectToCheckout({ sessionId: id });
    }

    const fetchCurrentUser = async () => {
        const user = await getCurrentUser();
        setCurrentUser(user);
    };

    const fetchShippingCost = async () => {
        const cartData = {
            user: currentUser.id,
            products: cartItems.map(item => ({
                item: item.id,
                quantity: item.quantity,
            })),
        };

        const { shippingcost }  = await getShippingCost(cartData);
        setShippingCost(shippingcost);
    };

    const fetchCoupons = async () => {
        const data = await getCoupons();

        if (Array.isArray(data)) {
            return setCoupons(data);
        }
        return setCoupons(null);
    };

    const applyCouponHandler = (e) => {
        e.preventDefault();

        const coupon = e.target.coupon.value;
        const filtered = coupons.filter(item => item.code === coupon);

        if (filtered.length) {
            setAppliedCoupon(filtered[0]);
            setCouponValid(true);
        } else {
            setAppliedCoupon(null);
            setCouponValid(false);
        }
    }

    useEffect(() => {
        if (appliedCoupon) {
            const calcDiscount = (price() * appliedCoupon.percentage / 100).toFixed(2);
            setDiscountAmount(calcDiscount);
        } else  {
            setDiscountAmount(0);
        }

        setTimeout(() => {
            setCouponValid(null);
        }, 5000);
    }, [couponValid])

    useEffect(() => {
        if (shippingAddress && billingAddress) {
            localStorage.setItem('shipping-address', JSON.stringify(shippingAddress));
            localStorage.setItem('billing-address', JSON.stringify(billingAddress));
            setShowAddressForm(false);
        }
    }, [shippingAddress, billingAddress]);

    useEffect(() => {
        if (auth) {
            fetchCurrentUser();
            fetchCoupons();

            const sAddressFromLocalStorage = localStorage.getItem('shipping-address');
            const bAddressFromLocalStorage = localStorage.getItem('billing-address');
            if (sAddressFromLocalStorage && bAddressFromLocalStorage) {
                setShippingAddress(JSON.parse(sAddressFromLocalStorage));
                setBillingAddress(JSON.parse(bAddressFromLocalStorage));
                setShowAddressForm(false);
            }
        }
    }, [auth]);

    useEffect(() => {
        if (currentUser.id) {
            if (cartItems.length > 0) {
                setShippingCost(null);
                fetchShippingCost();
            } else {
                setShippingCost(0);
            }
        }
    }, [currentUser, cartItems])

    return (
        <>
            <Layout parent="Home" sub="Shop" subChild="Cart">
                <section className="mt-50 mb-50">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 mb-40">
                                <h1 className="heading-2 mb-10">Your Cart</h1>
                                <div className="d-flex justify-content-between">
                                    <h6 className="text-body">
                                        There are{" "}
                                        <span className="text-brand">{ cartItems.length }</span>{" "}
                                        products in your cart
                                    </h6>
                                    { !!(cartItems.length) && (
                                        <h6 className="text-body">
                                            <a onClick={clearCart} className="text-muted">
                                                <i className="fi-rs-trash mr-5"/>
                                                Clear Cart
                                            </a>
                                        </h6>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="table-responsive shopping-summery">
                                    {cartItems.length <= 0 && "No Products"}
                                    <table
                                        className={
                                            cartItems.length > 0
                                                ? "table table-wishlist"
                                                : "d-none"
                                        }
                                    >
                                        <thead>
                                            <tr className="main-heading">
                                                <th className="custome-checkbox start pl-30" colSpan="2">
                                                    Product
                                                </th>
                                                <th scope="col">Unit Price</th>
                                                <th scope="col">Quantity</th>
                                                <th scope="col">Subtotal</th>
                                                <th scope="col" className="end">
                                                    Remove
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.map((item, i) => (
                                                <tr key={i}>
                                                    <td className="image product-thumbnail">
                                                        <img
                                                            src={
                                                                item.product_image[0].image
                                                            }
                                                            alt={item.product_image[0].alt}
                                                        />
                                                    </td>

                                                    <td className="product-des product-name">
                                                        <h6 className="product-name">
                                                            <Link href={`/products/${item.slug}`}>
                                                                <a>
                                                                    {item.title}
                                                                </a>
                                                            </Link>
                                                        </h6>
                                                        <div className="product-rate-cover">
                                                            <div className="product-rate d-inline-block">
                                                                <div
                                                                    className="product-rating"
                                                                    style={{
                                                                        width: `${(item.total_stars / 5) * 100}%`,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <span className="font-small ml-5 text-muted">
                                                                {" "}
                                                                ({ item.total_stars.toPrecision(2) })
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td
                                                        className="price"
                                                        data-title="Price"
                                                    >
                                                        <h4 className="text-brand">
                                                            ${item.price}
                                                        </h4>
                                                    </td>
                                                    <td
                                                        className="text-center detail-info"
                                                        data-title="Stock"
                                                    ><div className="detail-extralink mr-15">
                                                        <div className="detail-qty border radius ">
                                                            <a
                                                                onClick={(e) =>
                                                                    decreaseQuantity(
                                                                        item.id
                                                                    )
                                                                }
                                                                className="qty-down"
                                                            >
                                                                <i className="fi-rs-angle-small-down"></i>
                                                            </a>
                                                            <span className="qty-val">
                                                                {item.quantity}
                                                            </span>
                                                            <a
                                                                onClick={(e) =>
                                                                    increaseQuantity(
                                                                        item.id
                                                                    )
                                                                }
                                                                className="qty-up"
                                                            >
                                                                <i className="fi-rs-angle-small-up"></i>
                                                            </a>
                                                        </div>
                                                        </div>
                                                    </td>
                                                    <td
                                                        className="text-right"
                                                        data-title="Cart"
                                                    >
                                                        <h4 className="text-body">
                                                            $
                                                            {item.quantity *
                                                                item.price}
                                                        </h4>
                                                    </td>
                                                    <td
                                                        className="action"
                                                        data-title="Remove"
                                                    >
                                                        <a
                                                            onClick={(e) =>
                                                                deleteFromCart(
                                                                    item.id
                                                                )
                                                            }
                                                            className="text-muted"
                                                        >
                                                            <i className="fi-rs-trash"></i>
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="text-end"
                                                >
                                                    {cartItems.length > 0 && (
                                                        <a
                                                            onClick={clearCart}
                                                            className="text-muted"
                                                        >
                                                            <i className="fi-rs-cross-small"></i>
                                                            Clear Cart
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="cart-action text-end">
                                    <Link href="/">
                                        <a className="btn ">
                                            <i className="fi-rs-shopping-bag mr-10"></i>
                                            Continue Shopping
                                        </a>
                                    </Link>
                                </div>
                                <div className="divider center_icon mt-50 mb-50">
                                    <i className="fi-rs-fingerprint"></i>
                                </div>
                                { !auth && <div className="font-xl text-center">
                                    <Link href="/page-login">
                                        <a>
                                            <i className="fi fi-rs-user"></i> Sign in to checkout
                                        </a>
                                    </Link>
                                </div> }
                                { auth && <div className="row mb-50">
                                    <div className="col-lg-6 col-md-12">
                                        <div className="heading_s1 mb-3">
                                            <h4>Address</h4>
                                        </div>
                                        {/*<p className="mt-15 mb-30">
                                            Flat rate:
                                            <span className="font-xl text-brand fw-900">
                                                5%
                                            </span>
                                        </p>*/}

                                        { showAddressForm && (
                                            <form className="field_form shipping_calculator" onSubmit={addressSubmitHandler}>
                                                {/*<div className="form-row">
                                                <div className="form-group col-lg-12">
                                                    <div className="custom_select">
                                                        <select className="form-control" value={selectExisting} onChange={e => setSelectExisting(e.target.value)}>
                                                            <option value="">
                                                                Select address
                                                            </option>
                                                            { currentUser?.city && (
                                                                <option value={`${currentUser?.number}, ${currentUser?.street}, ${currentUser?.city}, ${currentUser?.country}, ${currentUser?.zipcode}`}>
                                                                    {`${currentUser?.number}, ${currentUser?.street}, ${currentUser?.city}, ${currentUser?.country}, ${currentUser?.zipcode}`}
                                                                </option>
                                                            ) }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>*/}

                                                { !selectExisting && (
                                                    <>
                                                        <h6 className="mb-3">Shipping address</h6>
                                                        <div className="form-row">
                                                            <div className="form-group col-lg-12">
                                                                <input
                                                                    required
                                                                    defaultValue={shippingAddress?.number}
                                                                    placeholder="House / Building / Apartment"
                                                                    name="number"
                                                                    type="text"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-row">
                                                            <div className="form-group col-lg-12">
                                                                <input
                                                                    required
                                                                    defaultValue={shippingAddress?.street}
                                                                    placeholder="Street / Locality"
                                                                    name="street"
                                                                    type="text"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-row">
                                                            <div className="form-group col-lg-12">
                                                                <input
                                                                    required
                                                                    defaultValue={shippingAddress?.city}
                                                                    placeholder="City"
                                                                    name="city"
                                                                    type="text"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-row row">
                                                            <div className="form-group col-lg-6">
                                                                <div className="custom_select full-height">
                                                                    <select className="form-control select-active" name="country" defaultValue={shippingAddress?.country} required>
                                                                        <option value="">
                                                                            Country
                                                                        </option>
                                                                        <option value="AX">
                                                                            Aland Islands
                                                                        </option>
                                                                        <option value="AF">
                                                                            Afghanistan
                                                                        </option>
                                                                        <option value="AL">
                                                                            Albania
                                                                        </option>
                                                                        <option value="DZ">
                                                                            Algeria
                                                                        </option>
                                                                        <option value="AD">
                                                                            Andorra
                                                                        </option>
                                                                        <option value="AO">
                                                                            Angola
                                                                        </option>
                                                                        <option value="AI">
                                                                            Anguilla
                                                                        </option>
                                                                        <option value="AQ">
                                                                            Antarctica
                                                                        </option>
                                                                        <option value="AG">
                                                                            Antigua and
                                                                            Barbuda
                                                                        </option>
                                                                        <option value="AR">
                                                                            Argentina
                                                                        </option>
                                                                        <option value="AM">
                                                                            Armenia
                                                                        </option>
                                                                        <option value="AW">
                                                                            Aruba
                                                                        </option>
                                                                        <option value="AU">
                                                                            Australia
                                                                        </option>
                                                                        <option value="AT">
                                                                            Austria
                                                                        </option>
                                                                        <option value="AZ">
                                                                            Azerbaijan
                                                                        </option>
                                                                        <option value="BS">
                                                                            Bahamas
                                                                        </option>
                                                                        <option value="BH">
                                                                            Bahrain
                                                                        </option>
                                                                        <option value="BD">
                                                                            Bangladesh
                                                                        </option>
                                                                        <option value="BB">
                                                                            Barbados
                                                                        </option>
                                                                        <option value="BY">
                                                                            Belarus
                                                                        </option>
                                                                        <option value="PW">
                                                                            Belau
                                                                        </option>
                                                                        <option value="BE">
                                                                            Belgium
                                                                        </option>
                                                                        <option value="BZ">
                                                                            Belize
                                                                        </option>
                                                                        <option value="BJ">
                                                                            Benin
                                                                        </option>
                                                                        <option value="BM">
                                                                            Bermuda
                                                                        </option>
                                                                        <option value="BT">
                                                                            Bhutan
                                                                        </option>
                                                                        <option value="BO">
                                                                            Bolivia
                                                                        </option>
                                                                        <option value="BQ">
                                                                            Bonaire, Saint
                                                                            Eustatius and
                                                                            Saba
                                                                        </option>
                                                                        <option value="BA">
                                                                            Bosnia and
                                                                            Herzegovina
                                                                        </option>
                                                                        <option value="BW">
                                                                            Botswana
                                                                        </option>
                                                                        <option value="BV">
                                                                            Bouvet Island
                                                                        </option>
                                                                        <option value="BR">
                                                                            Brazil
                                                                        </option>
                                                                        <option value="IO">
                                                                            British Indian
                                                                            Ocean Territory
                                                                        </option>
                                                                        <option value="VG">
                                                                            British Virgin
                                                                            Islands
                                                                        </option>
                                                                        <option value="BN">
                                                                            Brunei
                                                                        </option>
                                                                        <option value="BG">
                                                                            Bulgaria
                                                                        </option>
                                                                        <option value="BF">
                                                                            Burkina Faso
                                                                        </option>
                                                                        <option value="BI">
                                                                            Burundi
                                                                        </option>
                                                                        <option value="KH">
                                                                            Cambodia
                                                                        </option>
                                                                        <option value="CM">
                                                                            Cameroon
                                                                        </option>
                                                                        <option value="CA">
                                                                            Canada
                                                                        </option>
                                                                        <option value="CV">
                                                                            Cape Verde
                                                                        </option>
                                                                        <option value="KY">
                                                                            Cayman Islands
                                                                        </option>
                                                                        <option value="CF">
                                                                            Central African
                                                                            Republic
                                                                        </option>
                                                                        <option value="TD">
                                                                            Chad
                                                                        </option>
                                                                        <option value="CL">
                                                                            Chile
                                                                        </option>
                                                                        <option value="CN">
                                                                            China
                                                                        </option>
                                                                        <option value="CX">
                                                                            Christmas Island
                                                                        </option>
                                                                        <option value="CC">
                                                                            Cocos (Keeling)
                                                                            Islands
                                                                        </option>
                                                                        <option value="CO">
                                                                            Colombia
                                                                        </option>
                                                                        <option value="KM">
                                                                            Comoros
                                                                        </option>
                                                                        <option value="CG">
                                                                            Congo
                                                                            (Brazzaville)
                                                                        </option>
                                                                        <option value="CD">
                                                                            Congo (Kinshasa)
                                                                        </option>
                                                                        <option value="CK">
                                                                            Cook Islands
                                                                        </option>
                                                                        <option value="CR">
                                                                            Costa Rica
                                                                        </option>
                                                                        <option value="HR">
                                                                            Croatia
                                                                        </option>
                                                                        <option value="CU">
                                                                            Cuba
                                                                        </option>
                                                                        <option value="CW">
                                                                            CuraÇao
                                                                        </option>
                                                                        <option value="CY">
                                                                            Cyprus
                                                                        </option>
                                                                        <option value="CZ">
                                                                            Czech Republic
                                                                        </option>
                                                                        <option value="DK">
                                                                            Denmark
                                                                        </option>
                                                                        <option value="DJ">
                                                                            Djibouti
                                                                        </option>
                                                                        <option value="DM">
                                                                            Dominica
                                                                        </option>
                                                                        <option value="DO">
                                                                            Dominican
                                                                            Republic
                                                                        </option>
                                                                        <option value="EC">
                                                                            Ecuador
                                                                        </option>
                                                                        <option value="EG">
                                                                            Egypt
                                                                        </option>
                                                                        <option value="SV">
                                                                            El Salvador
                                                                        </option>
                                                                        <option value="GQ">
                                                                            Equatorial
                                                                            Guinea
                                                                        </option>
                                                                        <option value="ER">
                                                                            Eritrea
                                                                        </option>
                                                                        <option value="EE">
                                                                            Estonia
                                                                        </option>
                                                                        <option value="ET">
                                                                            Ethiopia
                                                                        </option>
                                                                        <option value="FK">
                                                                            Falkland Islands
                                                                        </option>
                                                                        <option value="FO">
                                                                            Faroe Islands
                                                                        </option>
                                                                        <option value="FJ">
                                                                            Fiji
                                                                        </option>
                                                                        <option value="FI">
                                                                            Finland
                                                                        </option>
                                                                        <option value="FR">
                                                                            France
                                                                        </option>
                                                                        <option value="GF">
                                                                            French Guiana
                                                                        </option>
                                                                        <option value="PF">
                                                                            French Polynesia
                                                                        </option>
                                                                        <option value="TF">
                                                                            French Southern
                                                                            Territories
                                                                        </option>
                                                                        <option value="GA">
                                                                            Gabon
                                                                        </option>
                                                                        <option value="GM">
                                                                            Gambia
                                                                        </option>
                                                                        <option value="GE">
                                                                            Georgia
                                                                        </option>
                                                                        <option value="DE">
                                                                            Germany
                                                                        </option>
                                                                        <option value="GH">
                                                                            Ghana
                                                                        </option>
                                                                        <option value="GI">
                                                                            Gibraltar
                                                                        </option>
                                                                        <option value="GR">
                                                                            Greece
                                                                        </option>
                                                                        <option value="GL">
                                                                            Greenland
                                                                        </option>
                                                                        <option value="GD">
                                                                            Grenada
                                                                        </option>
                                                                        <option value="GP">
                                                                            Guadeloupe
                                                                        </option>
                                                                        <option value="GT">
                                                                            Guatemala
                                                                        </option>
                                                                        <option value="GG">
                                                                            Guernsey
                                                                        </option>
                                                                        <option value="GN">
                                                                            Guinea
                                                                        </option>
                                                                        <option value="GW">
                                                                            Guinea-Bissau
                                                                        </option>
                                                                        <option value="GY">
                                                                            Guyana
                                                                        </option>
                                                                        <option value="HT">
                                                                            Haiti
                                                                        </option>
                                                                        <option value="HM">
                                                                            Heard Island and
                                                                            McDonald Islands
                                                                        </option>
                                                                        <option value="HN">
                                                                            Honduras
                                                                        </option>
                                                                        <option value="HK">
                                                                            Hong Kong
                                                                        </option>
                                                                        <option value="HU">
                                                                            Hungary
                                                                        </option>
                                                                        <option value="IS">
                                                                            Iceland
                                                                        </option>
                                                                        <option value="IN">
                                                                            India
                                                                        </option>
                                                                        <option value="ID">
                                                                            Indonesia
                                                                        </option>
                                                                        <option value="IR">
                                                                            Iran
                                                                        </option>
                                                                        <option value="IQ">
                                                                            Iraq
                                                                        </option>
                                                                        <option value="IM">
                                                                            Isle of Man
                                                                        </option>
                                                                        <option value="IL">
                                                                            Israel
                                                                        </option>
                                                                        <option value="IT">
                                                                            Italy
                                                                        </option>
                                                                        <option value="CI">
                                                                            Ivory Coast
                                                                        </option>
                                                                        <option value="JM">
                                                                            Jamaica
                                                                        </option>
                                                                        <option value="JP">
                                                                            Japan
                                                                        </option>
                                                                        <option value="JE">
                                                                            Jersey
                                                                        </option>
                                                                        <option value="JO">
                                                                            Jordan
                                                                        </option>
                                                                        <option value="KZ">
                                                                            Kazakhstan
                                                                        </option>
                                                                        <option value="KE">
                                                                            Kenya
                                                                        </option>
                                                                        <option value="KI">
                                                                            Kiribati
                                                                        </option>
                                                                        <option value="KW">
                                                                            Kuwait
                                                                        </option>
                                                                        <option value="KG">
                                                                            Kyrgyzstan
                                                                        </option>
                                                                        <option value="LA">
                                                                            Laos
                                                                        </option>
                                                                        <option value="LV">
                                                                            Latvia
                                                                        </option>
                                                                        <option value="LB">
                                                                            Lebanon
                                                                        </option>
                                                                        <option value="LS">
                                                                            Lesotho
                                                                        </option>
                                                                        <option value="LR">
                                                                            Liberia
                                                                        </option>
                                                                        <option value="LY">
                                                                            Libya
                                                                        </option>
                                                                        <option value="LI">
                                                                            Liechtenstein
                                                                        </option>
                                                                        <option value="LT">
                                                                            Lithuania
                                                                        </option>
                                                                        <option value="LU">
                                                                            Luxembourg
                                                                        </option>
                                                                        <option value="MO">
                                                                            Macao S.A.R.,
                                                                            China
                                                                        </option>
                                                                        <option value="MK">
                                                                            Macedonia
                                                                        </option>
                                                                        <option value="MG">
                                                                            Madagascar
                                                                        </option>
                                                                        <option value="MW">
                                                                            Malawi
                                                                        </option>
                                                                        <option value="MY">
                                                                            Malaysia
                                                                        </option>
                                                                        <option value="MV">
                                                                            Maldives
                                                                        </option>
                                                                        <option value="ML">
                                                                            Mali
                                                                        </option>
                                                                        <option value="MT">
                                                                            Malta
                                                                        </option>
                                                                        <option value="MH">
                                                                            Marshall Islands
                                                                        </option>
                                                                        <option value="MQ">
                                                                            Martinique
                                                                        </option>
                                                                        <option value="MR">
                                                                            Mauritania
                                                                        </option>
                                                                        <option value="MU">
                                                                            Mauritius
                                                                        </option>
                                                                        <option value="YT">
                                                                            Mayotte
                                                                        </option>
                                                                        <option value="MX">
                                                                            Mexico
                                                                        </option>
                                                                        <option value="FM">
                                                                            Micronesia
                                                                        </option>
                                                                        <option value="MD">
                                                                            Moldova
                                                                        </option>
                                                                        <option value="MC">
                                                                            Monaco
                                                                        </option>
                                                                        <option value="MN">
                                                                            Mongolia
                                                                        </option>
                                                                        <option value="ME">
                                                                            Montenegro
                                                                        </option>
                                                                        <option value="MS">
                                                                            Montserrat
                                                                        </option>
                                                                        <option value="MA">
                                                                            Morocco
                                                                        </option>
                                                                        <option value="MZ">
                                                                            Mozambique
                                                                        </option>
                                                                        <option value="MM">
                                                                            Myanmar
                                                                        </option>
                                                                        <option value="NA">
                                                                            Namibia
                                                                        </option>
                                                                        <option value="NR">
                                                                            Nauru
                                                                        </option>
                                                                        <option value="NP">
                                                                            Nepal
                                                                        </option>
                                                                        <option value="NL">
                                                                            Netherlands
                                                                        </option>
                                                                        <option value="AN">
                                                                            Netherlands
                                                                            Antilles
                                                                        </option>
                                                                        <option value="NC">
                                                                            New Caledonia
                                                                        </option>
                                                                        <option value="NZ">
                                                                            New Zealand
                                                                        </option>
                                                                        <option value="NI">
                                                                            Nicaragua
                                                                        </option>
                                                                        <option value="NE">
                                                                            Niger
                                                                        </option>
                                                                        <option value="NG">
                                                                            Nigeria
                                                                        </option>
                                                                        <option value="NU">
                                                                            Niue
                                                                        </option>
                                                                        <option value="NF">
                                                                            Norfolk Island
                                                                        </option>
                                                                        <option value="KP">
                                                                            North Korea
                                                                        </option>
                                                                        <option value="NO">
                                                                            Norway
                                                                        </option>
                                                                        <option value="OM">
                                                                            Oman
                                                                        </option>
                                                                        <option value="PK">
                                                                            Pakistan
                                                                        </option>
                                                                        <option value="PS">
                                                                            Palestinian
                                                                            Territory
                                                                        </option>
                                                                        <option value="PA">
                                                                            Panama
                                                                        </option>
                                                                        <option value="PG">
                                                                            Papua New Guinea
                                                                        </option>
                                                                        <option value="PY">
                                                                            Paraguay
                                                                        </option>
                                                                        <option value="PE">
                                                                            Peru
                                                                        </option>
                                                                        <option value="PH">
                                                                            Philippines
                                                                        </option>
                                                                        <option value="PN">
                                                                            Pitcairn
                                                                        </option>
                                                                        <option value="PL">
                                                                            Poland
                                                                        </option>
                                                                        <option value="PT">
                                                                            Portugal
                                                                        </option>
                                                                        <option value="QA">
                                                                            Qatar
                                                                        </option>
                                                                        <option value="IE">
                                                                            Republic of
                                                                            Ireland
                                                                        </option>
                                                                        <option value="RE">
                                                                            Reunion
                                                                        </option>
                                                                        <option value="RO">
                                                                            Romania
                                                                        </option>
                                                                        <option value="RU">
                                                                            Russia
                                                                        </option>
                                                                        <option value="RW">
                                                                            Rwanda
                                                                        </option>
                                                                        <option value="ST">
                                                                            São Tomé and
                                                                            Príncipe
                                                                        </option>
                                                                        <option value="BL">
                                                                            Saint Barthélemy
                                                                        </option>
                                                                        <option value="SH">
                                                                            Saint Helena
                                                                        </option>
                                                                        <option value="KN">
                                                                            Saint Kitts and
                                                                            Nevis
                                                                        </option>
                                                                        <option value="LC">
                                                                            Saint Lucia
                                                                        </option>
                                                                        <option value="SX">
                                                                            Saint Martin
                                                                            (Dutch part)
                                                                        </option>
                                                                        <option value="MF">
                                                                            Saint Martin
                                                                            (French part)
                                                                        </option>
                                                                        <option value="PM">
                                                                            Saint Pierre and
                                                                            Miquelon
                                                                        </option>
                                                                        <option value="VC">
                                                                            Saint Vincent
                                                                            and the
                                                                            Grenadines
                                                                        </option>
                                                                        <option value="SM">
                                                                            San Marino
                                                                        </option>
                                                                        <option value="SA">
                                                                            Saudi Arabia
                                                                        </option>
                                                                        <option value="SN">
                                                                            Senegal
                                                                        </option>
                                                                        <option value="RS">
                                                                            Serbia
                                                                        </option>
                                                                        <option value="SC">
                                                                            Seychelles
                                                                        </option>
                                                                        <option value="SL">
                                                                            Sierra Leone
                                                                        </option>
                                                                        <option value="SG">
                                                                            Singapore
                                                                        </option>
                                                                        <option value="SK">
                                                                            Slovakia
                                                                        </option>
                                                                        <option value="SI">
                                                                            Slovenia
                                                                        </option>
                                                                        <option value="SB">
                                                                            Solomon Islands
                                                                        </option>
                                                                        <option value="SO">
                                                                            Somalia
                                                                        </option>
                                                                        <option value="ZA">
                                                                            South Africa
                                                                        </option>
                                                                        <option value="GS">
                                                                            South
                                                                            Georgia/Sandwich
                                                                            Islands
                                                                        </option>
                                                                        <option value="KR">
                                                                            South Korea
                                                                        </option>
                                                                        <option value="SS">
                                                                            South Sudan
                                                                        </option>
                                                                        <option value="ES">
                                                                            Spain
                                                                        </option>
                                                                        <option value="LK">
                                                                            Sri Lanka
                                                                        </option>
                                                                        <option value="SD">
                                                                            Sudan
                                                                        </option>
                                                                        <option value="SR">
                                                                            Suriname
                                                                        </option>
                                                                        <option value="SJ">
                                                                            Svalbard and Jan
                                                                            Mayen
                                                                        </option>
                                                                        <option value="SZ">
                                                                            Swaziland
                                                                        </option>
                                                                        <option value="SE">
                                                                            Sweden
                                                                        </option>
                                                                        <option value="CH">
                                                                            Switzerland
                                                                        </option>
                                                                        <option value="SY">
                                                                            Syria
                                                                        </option>
                                                                        <option value="TW">
                                                                            Taiwan
                                                                        </option>
                                                                        <option value="TJ">
                                                                            Tajikistan
                                                                        </option>
                                                                        <option value="TZ">
                                                                            Tanzania
                                                                        </option>
                                                                        <option value="TH">
                                                                            Thailand
                                                                        </option>
                                                                        <option value="TL">
                                                                            Timor-Leste
                                                                        </option>
                                                                        <option value="TG">
                                                                            Togo
                                                                        </option>
                                                                        <option value="TK">
                                                                            Tokelau
                                                                        </option>
                                                                        <option value="TO">
                                                                            Tonga
                                                                        </option>
                                                                        <option value="TT">
                                                                            Trinidad and
                                                                            Tobago
                                                                        </option>
                                                                        <option value="TN">
                                                                            Tunisia
                                                                        </option>
                                                                        <option value="TR">
                                                                            Turkey
                                                                        </option>
                                                                        <option value="TM">
                                                                            Turkmenistan
                                                                        </option>
                                                                        <option value="TC">
                                                                            Turks and Caicos
                                                                            Islands
                                                                        </option>
                                                                        <option value="TV">
                                                                            Tuvalu
                                                                        </option>
                                                                        <option value="UG">
                                                                            Uganda
                                                                        </option>
                                                                        <option value="UA">
                                                                            Ukraine
                                                                        </option>
                                                                        <option value="AE">
                                                                            United Arab
                                                                            Emirates
                                                                        </option>
                                                                        <option value="GB">
                                                                            United Kingdom
                                                                            (UK)
                                                                        </option>
                                                                        <option value="US">
                                                                            USA (US)
                                                                        </option>
                                                                        <option value="UY">
                                                                            Uruguay
                                                                        </option>
                                                                        <option value="UZ">
                                                                            Uzbekistan
                                                                        </option>
                                                                        <option value="VU">
                                                                            Vanuatu
                                                                        </option>
                                                                        <option value="VA">
                                                                            Vatican
                                                                        </option>
                                                                        <option value="VE">
                                                                            Venezuela
                                                                        </option>
                                                                        <option value="VN">
                                                                            Vietnam
                                                                        </option>
                                                                        <option value="WF">
                                                                            Wallis and
                                                                            Futuna
                                                                        </option>
                                                                        <option value="EH">
                                                                            Western Sahara
                                                                        </option>
                                                                        <option value="WS">
                                                                            Western Samoa
                                                                        </option>
                                                                        <option value="YE">
                                                                            Yemen
                                                                        </option>
                                                                        <option value="ZM">
                                                                            Zambia
                                                                        </option>
                                                                        <option value="ZW">
                                                                            Zimbabwe
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="form-group col-lg-6">
                                                                <input
                                                                    required
                                                                    defaultValue={shippingAddress?.zipcode}
                                                                    placeholder="PostCode / ZIP"
                                                                    name="zipcode"
                                                                    type="text"
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="custome-checkbox mb-3">
                                                            <input className="form-check-input" type="checkbox" checked={billingAddressSame}
                                                                   id="flexCheckDefault" onChange={e => setBillingAddressSame(e.target.checked)} />
                                                                <label className="form-check-label"
                                                                       htmlFor="flexCheckDefault">
                                                                    Billing address is same as shipping address
                                                                </label>
                                                        </div>

                                                        { !billingAddressSame && (
                                                            <>
                                                                <h6 className="my-3">Billing address</h6>
                                                                <div className="form-row">
                                                                    <div className="form-group col-lg-12">
                                                                        <input
                                                                            required
                                                                            defaultValue={billingAddress?.number}
                                                                            placeholder="House / Building / Apartment"
                                                                            name="b_address_number"
                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="form-row">
                                                                    <div className="form-group col-lg-12">
                                                                        <input
                                                                            required
                                                                            defaultValue={billingAddress?.street}
                                                                            placeholder="Street / Locality"
                                                                            name="b_address_street"
                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="form-row">
                                                                    <div className="form-group col-lg-12">
                                                                        <input
                                                                            required
                                                                            defaultValue={billingAddress?.city}
                                                                            placeholder="City"
                                                                            name="b_address_city"
                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="form-row row">
                                                                    <div className="form-group col-lg-6">
                                                                        <div className="custom_select full-height">
                                                                            <select className="form-control select-active" name="b_address_country" defaultValue={billingAddress?.country} required>
                                                                                <option value="">
                                                                                    Country
                                                                                </option>
                                                                                <option value="AX">
                                                                                    Aland Islands
                                                                                </option>
                                                                                <option value="AF">
                                                                                    Afghanistan
                                                                                </option>
                                                                                <option value="AL">
                                                                                    Albania
                                                                                </option>
                                                                                <option value="DZ">
                                                                                    Algeria
                                                                                </option>
                                                                                <option value="AD">
                                                                                    Andorra
                                                                                </option>
                                                                                <option value="AO">
                                                                                    Angola
                                                                                </option>
                                                                                <option value="AI">
                                                                                    Anguilla
                                                                                </option>
                                                                                <option value="AQ">
                                                                                    Antarctica
                                                                                </option>
                                                                                <option value="AG">
                                                                                    Antigua and
                                                                                    Barbuda
                                                                                </option>
                                                                                <option value="AR">
                                                                                    Argentina
                                                                                </option>
                                                                                <option value="AM">
                                                                                    Armenia
                                                                                </option>
                                                                                <option value="AW">
                                                                                    Aruba
                                                                                </option>
                                                                                <option value="AU">
                                                                                    Australia
                                                                                </option>
                                                                                <option value="AT">
                                                                                    Austria
                                                                                </option>
                                                                                <option value="AZ">
                                                                                    Azerbaijan
                                                                                </option>
                                                                                <option value="BS">
                                                                                    Bahamas
                                                                                </option>
                                                                                <option value="BH">
                                                                                    Bahrain
                                                                                </option>
                                                                                <option value="BD">
                                                                                    Bangladesh
                                                                                </option>
                                                                                <option value="BB">
                                                                                    Barbados
                                                                                </option>
                                                                                <option value="BY">
                                                                                    Belarus
                                                                                </option>
                                                                                <option value="PW">
                                                                                    Belau
                                                                                </option>
                                                                                <option value="BE">
                                                                                    Belgium
                                                                                </option>
                                                                                <option value="BZ">
                                                                                    Belize
                                                                                </option>
                                                                                <option value="BJ">
                                                                                    Benin
                                                                                </option>
                                                                                <option value="BM">
                                                                                    Bermuda
                                                                                </option>
                                                                                <option value="BT">
                                                                                    Bhutan
                                                                                </option>
                                                                                <option value="BO">
                                                                                    Bolivia
                                                                                </option>
                                                                                <option value="BQ">
                                                                                    Bonaire, Saint
                                                                                    Eustatius and
                                                                                    Saba
                                                                                </option>
                                                                                <option value="BA">
                                                                                    Bosnia and
                                                                                    Herzegovina
                                                                                </option>
                                                                                <option value="BW">
                                                                                    Botswana
                                                                                </option>
                                                                                <option value="BV">
                                                                                    Bouvet Island
                                                                                </option>
                                                                                <option value="BR">
                                                                                    Brazil
                                                                                </option>
                                                                                <option value="IO">
                                                                                    British Indian
                                                                                    Ocean Territory
                                                                                </option>
                                                                                <option value="VG">
                                                                                    British Virgin
                                                                                    Islands
                                                                                </option>
                                                                                <option value="BN">
                                                                                    Brunei
                                                                                </option>
                                                                                <option value="BG">
                                                                                    Bulgaria
                                                                                </option>
                                                                                <option value="BF">
                                                                                    Burkina Faso
                                                                                </option>
                                                                                <option value="BI">
                                                                                    Burundi
                                                                                </option>
                                                                                <option value="KH">
                                                                                    Cambodia
                                                                                </option>
                                                                                <option value="CM">
                                                                                    Cameroon
                                                                                </option>
                                                                                <option value="CA">
                                                                                    Canada
                                                                                </option>
                                                                                <option value="CV">
                                                                                    Cape Verde
                                                                                </option>
                                                                                <option value="KY">
                                                                                    Cayman Islands
                                                                                </option>
                                                                                <option value="CF">
                                                                                    Central African
                                                                                    Republic
                                                                                </option>
                                                                                <option value="TD">
                                                                                    Chad
                                                                                </option>
                                                                                <option value="CL">
                                                                                    Chile
                                                                                </option>
                                                                                <option value="CN">
                                                                                    China
                                                                                </option>
                                                                                <option value="CX">
                                                                                    Christmas Island
                                                                                </option>
                                                                                <option value="CC">
                                                                                    Cocos (Keeling)
                                                                                    Islands
                                                                                </option>
                                                                                <option value="CO">
                                                                                    Colombia
                                                                                </option>
                                                                                <option value="KM">
                                                                                    Comoros
                                                                                </option>
                                                                                <option value="CG">
                                                                                    Congo
                                                                                    (Brazzaville)
                                                                                </option>
                                                                                <option value="CD">
                                                                                    Congo (Kinshasa)
                                                                                </option>
                                                                                <option value="CK">
                                                                                    Cook Islands
                                                                                </option>
                                                                                <option value="CR">
                                                                                    Costa Rica
                                                                                </option>
                                                                                <option value="HR">
                                                                                    Croatia
                                                                                </option>
                                                                                <option value="CU">
                                                                                    Cuba
                                                                                </option>
                                                                                <option value="CW">
                                                                                    CuraÇao
                                                                                </option>
                                                                                <option value="CY">
                                                                                    Cyprus
                                                                                </option>
                                                                                <option value="CZ">
                                                                                    Czech Republic
                                                                                </option>
                                                                                <option value="DK">
                                                                                    Denmark
                                                                                </option>
                                                                                <option value="DJ">
                                                                                    Djibouti
                                                                                </option>
                                                                                <option value="DM">
                                                                                    Dominica
                                                                                </option>
                                                                                <option value="DO">
                                                                                    Dominican
                                                                                    Republic
                                                                                </option>
                                                                                <option value="EC">
                                                                                    Ecuador
                                                                                </option>
                                                                                <option value="EG">
                                                                                    Egypt
                                                                                </option>
                                                                                <option value="SV">
                                                                                    El Salvador
                                                                                </option>
                                                                                <option value="GQ">
                                                                                    Equatorial
                                                                                    Guinea
                                                                                </option>
                                                                                <option value="ER">
                                                                                    Eritrea
                                                                                </option>
                                                                                <option value="EE">
                                                                                    Estonia
                                                                                </option>
                                                                                <option value="ET">
                                                                                    Ethiopia
                                                                                </option>
                                                                                <option value="FK">
                                                                                    Falkland Islands
                                                                                </option>
                                                                                <option value="FO">
                                                                                    Faroe Islands
                                                                                </option>
                                                                                <option value="FJ">
                                                                                    Fiji
                                                                                </option>
                                                                                <option value="FI">
                                                                                    Finland
                                                                                </option>
                                                                                <option value="FR">
                                                                                    France
                                                                                </option>
                                                                                <option value="GF">
                                                                                    French Guiana
                                                                                </option>
                                                                                <option value="PF">
                                                                                    French Polynesia
                                                                                </option>
                                                                                <option value="TF">
                                                                                    French Southern
                                                                                    Territories
                                                                                </option>
                                                                                <option value="GA">
                                                                                    Gabon
                                                                                </option>
                                                                                <option value="GM">
                                                                                    Gambia
                                                                                </option>
                                                                                <option value="GE">
                                                                                    Georgia
                                                                                </option>
                                                                                <option value="DE">
                                                                                    Germany
                                                                                </option>
                                                                                <option value="GH">
                                                                                    Ghana
                                                                                </option>
                                                                                <option value="GI">
                                                                                    Gibraltar
                                                                                </option>
                                                                                <option value="GR">
                                                                                    Greece
                                                                                </option>
                                                                                <option value="GL">
                                                                                    Greenland
                                                                                </option>
                                                                                <option value="GD">
                                                                                    Grenada
                                                                                </option>
                                                                                <option value="GP">
                                                                                    Guadeloupe
                                                                                </option>
                                                                                <option value="GT">
                                                                                    Guatemala
                                                                                </option>
                                                                                <option value="GG">
                                                                                    Guernsey
                                                                                </option>
                                                                                <option value="GN">
                                                                                    Guinea
                                                                                </option>
                                                                                <option value="GW">
                                                                                    Guinea-Bissau
                                                                                </option>
                                                                                <option value="GY">
                                                                                    Guyana
                                                                                </option>
                                                                                <option value="HT">
                                                                                    Haiti
                                                                                </option>
                                                                                <option value="HM">
                                                                                    Heard Island and
                                                                                    McDonald Islands
                                                                                </option>
                                                                                <option value="HN">
                                                                                    Honduras
                                                                                </option>
                                                                                <option value="HK">
                                                                                    Hong Kong
                                                                                </option>
                                                                                <option value="HU">
                                                                                    Hungary
                                                                                </option>
                                                                                <option value="IS">
                                                                                    Iceland
                                                                                </option>
                                                                                <option value="IN">
                                                                                    India
                                                                                </option>
                                                                                <option value="ID">
                                                                                    Indonesia
                                                                                </option>
                                                                                <option value="IR">
                                                                                    Iran
                                                                                </option>
                                                                                <option value="IQ">
                                                                                    Iraq
                                                                                </option>
                                                                                <option value="IM">
                                                                                    Isle of Man
                                                                                </option>
                                                                                <option value="IL">
                                                                                    Israel
                                                                                </option>
                                                                                <option value="IT">
                                                                                    Italy
                                                                                </option>
                                                                                <option value="CI">
                                                                                    Ivory Coast
                                                                                </option>
                                                                                <option value="JM">
                                                                                    Jamaica
                                                                                </option>
                                                                                <option value="JP">
                                                                                    Japan
                                                                                </option>
                                                                                <option value="JE">
                                                                                    Jersey
                                                                                </option>
                                                                                <option value="JO">
                                                                                    Jordan
                                                                                </option>
                                                                                <option value="KZ">
                                                                                    Kazakhstan
                                                                                </option>
                                                                                <option value="KE">
                                                                                    Kenya
                                                                                </option>
                                                                                <option value="KI">
                                                                                    Kiribati
                                                                                </option>
                                                                                <option value="KW">
                                                                                    Kuwait
                                                                                </option>
                                                                                <option value="KG">
                                                                                    Kyrgyzstan
                                                                                </option>
                                                                                <option value="LA">
                                                                                    Laos
                                                                                </option>
                                                                                <option value="LV">
                                                                                    Latvia
                                                                                </option>
                                                                                <option value="LB">
                                                                                    Lebanon
                                                                                </option>
                                                                                <option value="LS">
                                                                                    Lesotho
                                                                                </option>
                                                                                <option value="LR">
                                                                                    Liberia
                                                                                </option>
                                                                                <option value="LY">
                                                                                    Libya
                                                                                </option>
                                                                                <option value="LI">
                                                                                    Liechtenstein
                                                                                </option>
                                                                                <option value="LT">
                                                                                    Lithuania
                                                                                </option>
                                                                                <option value="LU">
                                                                                    Luxembourg
                                                                                </option>
                                                                                <option value="MO">
                                                                                    Macao S.A.R.,
                                                                                    China
                                                                                </option>
                                                                                <option value="MK">
                                                                                    Macedonia
                                                                                </option>
                                                                                <option value="MG">
                                                                                    Madagascar
                                                                                </option>
                                                                                <option value="MW">
                                                                                    Malawi
                                                                                </option>
                                                                                <option value="MY">
                                                                                    Malaysia
                                                                                </option>
                                                                                <option value="MV">
                                                                                    Maldives
                                                                                </option>
                                                                                <option value="ML">
                                                                                    Mali
                                                                                </option>
                                                                                <option value="MT">
                                                                                    Malta
                                                                                </option>
                                                                                <option value="MH">
                                                                                    Marshall Islands
                                                                                </option>
                                                                                <option value="MQ">
                                                                                    Martinique
                                                                                </option>
                                                                                <option value="MR">
                                                                                    Mauritania
                                                                                </option>
                                                                                <option value="MU">
                                                                                    Mauritius
                                                                                </option>
                                                                                <option value="YT">
                                                                                    Mayotte
                                                                                </option>
                                                                                <option value="MX">
                                                                                    Mexico
                                                                                </option>
                                                                                <option value="FM">
                                                                                    Micronesia
                                                                                </option>
                                                                                <option value="MD">
                                                                                    Moldova
                                                                                </option>
                                                                                <option value="MC">
                                                                                    Monaco
                                                                                </option>
                                                                                <option value="MN">
                                                                                    Mongolia
                                                                                </option>
                                                                                <option value="ME">
                                                                                    Montenegro
                                                                                </option>
                                                                                <option value="MS">
                                                                                    Montserrat
                                                                                </option>
                                                                                <option value="MA">
                                                                                    Morocco
                                                                                </option>
                                                                                <option value="MZ">
                                                                                    Mozambique
                                                                                </option>
                                                                                <option value="MM">
                                                                                    Myanmar
                                                                                </option>
                                                                                <option value="NA">
                                                                                    Namibia
                                                                                </option>
                                                                                <option value="NR">
                                                                                    Nauru
                                                                                </option>
                                                                                <option value="NP">
                                                                                    Nepal
                                                                                </option>
                                                                                <option value="NL">
                                                                                    Netherlands
                                                                                </option>
                                                                                <option value="AN">
                                                                                    Netherlands
                                                                                    Antilles
                                                                                </option>
                                                                                <option value="NC">
                                                                                    New Caledonia
                                                                                </option>
                                                                                <option value="NZ">
                                                                                    New Zealand
                                                                                </option>
                                                                                <option value="NI">
                                                                                    Nicaragua
                                                                                </option>
                                                                                <option value="NE">
                                                                                    Niger
                                                                                </option>
                                                                                <option value="NG">
                                                                                    Nigeria
                                                                                </option>
                                                                                <option value="NU">
                                                                                    Niue
                                                                                </option>
                                                                                <option value="NF">
                                                                                    Norfolk Island
                                                                                </option>
                                                                                <option value="KP">
                                                                                    North Korea
                                                                                </option>
                                                                                <option value="NO">
                                                                                    Norway
                                                                                </option>
                                                                                <option value="OM">
                                                                                    Oman
                                                                                </option>
                                                                                <option value="PK">
                                                                                    Pakistan
                                                                                </option>
                                                                                <option value="PS">
                                                                                    Palestinian
                                                                                    Territory
                                                                                </option>
                                                                                <option value="PA">
                                                                                    Panama
                                                                                </option>
                                                                                <option value="PG">
                                                                                    Papua New Guinea
                                                                                </option>
                                                                                <option value="PY">
                                                                                    Paraguay
                                                                                </option>
                                                                                <option value="PE">
                                                                                    Peru
                                                                                </option>
                                                                                <option value="PH">
                                                                                    Philippines
                                                                                </option>
                                                                                <option value="PN">
                                                                                    Pitcairn
                                                                                </option>
                                                                                <option value="PL">
                                                                                    Poland
                                                                                </option>
                                                                                <option value="PT">
                                                                                    Portugal
                                                                                </option>
                                                                                <option value="QA">
                                                                                    Qatar
                                                                                </option>
                                                                                <option value="IE">
                                                                                    Republic of
                                                                                    Ireland
                                                                                </option>
                                                                                <option value="RE">
                                                                                    Reunion
                                                                                </option>
                                                                                <option value="RO">
                                                                                    Romania
                                                                                </option>
                                                                                <option value="RU">
                                                                                    Russia
                                                                                </option>
                                                                                <option value="RW">
                                                                                    Rwanda
                                                                                </option>
                                                                                <option value="ST">
                                                                                    São Tomé and
                                                                                    Príncipe
                                                                                </option>
                                                                                <option value="BL">
                                                                                    Saint Barthélemy
                                                                                </option>
                                                                                <option value="SH">
                                                                                    Saint Helena
                                                                                </option>
                                                                                <option value="KN">
                                                                                    Saint Kitts and
                                                                                    Nevis
                                                                                </option>
                                                                                <option value="LC">
                                                                                    Saint Lucia
                                                                                </option>
                                                                                <option value="SX">
                                                                                    Saint Martin
                                                                                    (Dutch part)
                                                                                </option>
                                                                                <option value="MF">
                                                                                    Saint Martin
                                                                                    (French part)
                                                                                </option>
                                                                                <option value="PM">
                                                                                    Saint Pierre and
                                                                                    Miquelon
                                                                                </option>
                                                                                <option value="VC">
                                                                                    Saint Vincent
                                                                                    and the
                                                                                    Grenadines
                                                                                </option>
                                                                                <option value="SM">
                                                                                    San Marino
                                                                                </option>
                                                                                <option value="SA">
                                                                                    Saudi Arabia
                                                                                </option>
                                                                                <option value="SN">
                                                                                    Senegal
                                                                                </option>
                                                                                <option value="RS">
                                                                                    Serbia
                                                                                </option>
                                                                                <option value="SC">
                                                                                    Seychelles
                                                                                </option>
                                                                                <option value="SL">
                                                                                    Sierra Leone
                                                                                </option>
                                                                                <option value="SG">
                                                                                    Singapore
                                                                                </option>
                                                                                <option value="SK">
                                                                                    Slovakia
                                                                                </option>
                                                                                <option value="SI">
                                                                                    Slovenia
                                                                                </option>
                                                                                <option value="SB">
                                                                                    Solomon Islands
                                                                                </option>
                                                                                <option value="SO">
                                                                                    Somalia
                                                                                </option>
                                                                                <option value="ZA">
                                                                                    South Africa
                                                                                </option>
                                                                                <option value="GS">
                                                                                    South
                                                                                    Georgia/Sandwich
                                                                                    Islands
                                                                                </option>
                                                                                <option value="KR">
                                                                                    South Korea
                                                                                </option>
                                                                                <option value="SS">
                                                                                    South Sudan
                                                                                </option>
                                                                                <option value="ES">
                                                                                    Spain
                                                                                </option>
                                                                                <option value="LK">
                                                                                    Sri Lanka
                                                                                </option>
                                                                                <option value="SD">
                                                                                    Sudan
                                                                                </option>
                                                                                <option value="SR">
                                                                                    Suriname
                                                                                </option>
                                                                                <option value="SJ">
                                                                                    Svalbard and Jan
                                                                                    Mayen
                                                                                </option>
                                                                                <option value="SZ">
                                                                                    Swaziland
                                                                                </option>
                                                                                <option value="SE">
                                                                                    Sweden
                                                                                </option>
                                                                                <option value="CH">
                                                                                    Switzerland
                                                                                </option>
                                                                                <option value="SY">
                                                                                    Syria
                                                                                </option>
                                                                                <option value="TW">
                                                                                    Taiwan
                                                                                </option>
                                                                                <option value="TJ">
                                                                                    Tajikistan
                                                                                </option>
                                                                                <option value="TZ">
                                                                                    Tanzania
                                                                                </option>
                                                                                <option value="TH">
                                                                                    Thailand
                                                                                </option>
                                                                                <option value="TL">
                                                                                    Timor-Leste
                                                                                </option>
                                                                                <option value="TG">
                                                                                    Togo
                                                                                </option>
                                                                                <option value="TK">
                                                                                    Tokelau
                                                                                </option>
                                                                                <option value="TO">
                                                                                    Tonga
                                                                                </option>
                                                                                <option value="TT">
                                                                                    Trinidad and
                                                                                    Tobago
                                                                                </option>
                                                                                <option value="TN">
                                                                                    Tunisia
                                                                                </option>
                                                                                <option value="TR">
                                                                                    Turkey
                                                                                </option>
                                                                                <option value="TM">
                                                                                    Turkmenistan
                                                                                </option>
                                                                                <option value="TC">
                                                                                    Turks and Caicos
                                                                                    Islands
                                                                                </option>
                                                                                <option value="TV">
                                                                                    Tuvalu
                                                                                </option>
                                                                                <option value="UG">
                                                                                    Uganda
                                                                                </option>
                                                                                <option value="UA">
                                                                                    Ukraine
                                                                                </option>
                                                                                <option value="AE">
                                                                                    United Arab
                                                                                    Emirates
                                                                                </option>
                                                                                <option value="GB">
                                                                                    United Kingdom
                                                                                    (UK)
                                                                                </option>
                                                                                <option value="US">
                                                                                    USA (US)
                                                                                </option>
                                                                                <option value="UY">
                                                                                    Uruguay
                                                                                </option>
                                                                                <option value="UZ">
                                                                                    Uzbekistan
                                                                                </option>
                                                                                <option value="VU">
                                                                                    Vanuatu
                                                                                </option>
                                                                                <option value="VA">
                                                                                    Vatican
                                                                                </option>
                                                                                <option value="VE">
                                                                                    Venezuela
                                                                                </option>
                                                                                <option value="VN">
                                                                                    Vietnam
                                                                                </option>
                                                                                <option value="WF">
                                                                                    Wallis and
                                                                                    Futuna
                                                                                </option>
                                                                                <option value="EH">
                                                                                    Western Sahara
                                                                                </option>
                                                                                <option value="WS">
                                                                                    Western Samoa
                                                                                </option>
                                                                                <option value="YE">
                                                                                    Yemen
                                                                                </option>
                                                                                <option value="ZM">
                                                                                    Zambia
                                                                                </option>
                                                                                <option value="ZW">
                                                                                    Zimbabwe
                                                                                </option>
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                    <div className="form-group col-lg-6">
                                                                        <input
                                                                            required
                                                                            defaultValue={billingAddress?.zipcode}
                                                                            placeholder="PostCode / ZIP"
                                                                            name="b_address_zipcode"
                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}

                                                        <div className="form-row">
                                                            <div className="form-group col-lg-12">
                                                                <button className="btn btn-sm me-2" type="submit">
                                                                    <i className="fi-rs-check mr-5" />
                                                                    { !!(shippingAddress && billingAddress) ? "Change" : "Save" }
                                                                </button>

                                                                { !!(shippingAddress && billingAddress) && (
                                                                    <button className="btn btn-sm" onClick={() => setShowAddressForm(false)}>
                                                                        <i className="fi-rs-cross mr-5" />
                                                                        Cancel
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </form>
                                        )}

                                        <div className="row">
                                            <div className="col-6">
                                                { (shippingAddress && !showAddressForm) && (
                                                    <div className="px-2 text-dark checkout-address">
                                                        <h6 className="mb-2">Shipping address</h6>
                                                        <div>
                                                            { shippingAddress?.number }, <br/>
                                                            { shippingAddress?.street }, <br/>
                                                            { shippingAddress?.city }, <br/>
                                                            { shippingAddress?.country },
                                                            { shippingAddress?.zipcode }
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-6">
                                                { (billingAddress && !showAddressForm) && (
                                                    <div className="px-2 text-dark checkout-address">
                                                        <h6 className="mb-2">Billing address</h6>
                                                        <div>
                                                            { billingAddress?.number }, <br/>
                                                            { billingAddress?.street }, <br/>
                                                            { billingAddress?.city }, <br/>
                                                            { billingAddress?.country },
                                                            { billingAddress?.zipcode }
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                             { !showAddressForm && (
                                                 <div className="form-group mt-3">
                                                     <button className="btn btn-sm" onClick={addressChangeClickHandler}>
                                                         <i className="fi-rs-pencil mr-5"></i>
                                                         Change
                                                     </button>
                                                 </div>
                                             )}
                                        </div>

                                        { (price() > 0 && coupons) && (
                                            <div className="mb-30 mt-50">
                                                <div className="heading_s1 mb-3">
                                                    <h4>Apply Coupon</h4>
                                                </div>
                                                <div className="total-amount">
                                                    <div className="left">
                                                        <div className="coupon">
                                                            <form className="apply-coupon" onSubmit={applyCouponHandler}>
                                                                <input
                                                                    type="text"
                                                                    name="coupon"
                                                                    placeholder="Enter coupon code"
                                                                />
                                                                <button
                                                                    className="btn  btn-md"
                                                                    name="login"
                                                                    type="submit"
                                                                >
                                                                    Apply Coupon
                                                                </button>
                                                            </form>
                                                            { couponValid !== null && (
                                                                <>
                                                                    { couponValid && <small className="text-success">Coupon code applied!</small> }
                                                                    { couponValid === false && <small className="text-danger">Invalid coupon code!</small> }
                                                                </>
                                                            )}
                                                            {/*<form onSubmit={applyCouponHandler}>
                                                                <div className="form-row row justify-content-center">
                                                                    <div className="form-group col-lg-6">
                                                                        <input
                                                                            className="font-medium"
                                                                            name="coupon"
                                                                            placeholder="Enter coupon code"
                                                                        />
                                                                    </div>
                                                                    <div className="form-group col-lg-6">
                                                                        <button className="btn btn-sm" type="submit">
                                                                            <i className="fi-rs-label mr-10"/>
                                                                            Apply
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                { couponValid !== null && (
                                                                    <>
                                                                        { couponValid && <small className="text-success">Coupon code applied!</small> }
                                                                        { couponValid === false && <small className="text-danger">Invalid coupon code!</small> }
                                                                    </>
                                                                )}
                                                            </form>*/}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-lg-6 col-md-12">
                                        <div className="border p-md-4 p-30 border-radius cart-totals">
                                            <div className="heading_s1 mb-3">
                                                <h4>Cart Totals</h4>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <tbody>
                                                        <tr>
                                                            <td className="cart_total_label">
                                                                Cart Subtotal
                                                            </td>
                                                            <td className="cart_total_amount">
                                                                <span className="font-lg fw-900 text-brand">
                                                                    $ {price()}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        { (price() > 0 && appliedCoupon) && (
                                                            <tr>
                                                                <td className="cart_total_label">
                                                                    Discount
                                                                </td>
                                                                <td className="cart_total_amount">
                                                                    <span className="font-lg fw-900 text-brand">
                                                                        {/*<i className="fisal mr-5"/>*/}
                                                                        - $ { discountAmount }
                                                                        <small className="text-black-50 font-sm"> ({appliedCoupon.percentage}% off)</small>
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        )}
                                                        <tr>
                                                            <td className="cart_total_label">
                                                                Shipping
                                                            </td>
                                                            <td className="cart_total_amount text-brand">
                                                                <strong>
                                                                    <span className="font-lg fw-900 text-brand">
                                                                        { (shippingCost === null) ? "Calculating..." : `$ ${shippingCost.toFixed(2)}` }
                                                                    </span>
                                                                </strong>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td className="cart_total_label">
                                                                Total
                                                            </td>
                                                            <td className="cart_total_amount">
                                                                <strong>
                                                                    <span className="font-xl fw-900 text-brand">
                                                                        { (price() > 0) ?
                                                                            <span>$ {(price() - discountAmount + (shippingCost || 0)).toFixed(2)}</span>
                                                                            : <span>$ {price()}</span>
                                                                        }
                                                                    </span>
                                                                </strong>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            {/*<form action="/api/checkout_session" method="POST">

                                            </form>*/}
                                            { (price() > 0) && (
                                                <button type="submit" className="btn" style={{ width: "100%" }} onClick={redirectToCheckout}>
                                                    <i className="fi-rs-box-alt mr-10"></i>
                                                    Proceed To CheckOut
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div> }
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
};

const mapStateToProps = (state) => ({
    cartItems: state.cart,
    activeCart: state.counter,
});

const mapDispatchToProps = {
    closeCart,
    increaseQuantity,
    decreaseQuantity,
    deleteFromCart,
    openCart,
    clearCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
