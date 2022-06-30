import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { connect } from "react-redux";
import Layout from "../components/layout/Layout";

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
import {getCurrentUser, getCoupons, getShippingCost, initPayment} from "../rest/calls";


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
    const [transactionID, setTransactionID] = useState(null);

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
        /*const { data: { id } } = await axios.post('/api/checkout_sessions', {
            items: cartItems.map(item => ({
                price: item.stripe_price_id,
                quantity: item.quantity,
            })),
            discounts: appliedCoupon ? [{coupon: appliedCoupon.id}] : null,
            shippingCost: shippingCost * 100,
        });

        const stripe = window.Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        await stripe.redirectToCheckout({ sessionId: id });*/

        let amount = price();
        if (amount > 0) {
            amount -= discountAmount;

            if (shippingCost) {
                amount += shippingCost;
            }

            amount = amount.toFixed(2);
        }
        amount *= 100;

        const data = await initPayment({
            currency: 'CHF',
            amount,
            discount: discountAmount,
            coupon_code: appliedCoupon,
        });

        if (data?.transactionId) {
            setTransactionID(data.transactionId);
            localStorage.setItem('txn_id', data.transactionId);
            window.location = `https://api.sandbox.datatrans.com/v1/start/${data.transactionId}`;
        }
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


    const scrollToRef = useRef();
    const myRef = useRef(null)
    const executeScroll = () => scrollToRef(myRef)


    return (
        <>
            <Layout parent="Home" sub="Shop" subChild="Cart">
                <section className="mt-50 mb-50">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 mb-40">
                                <h1 className="heading-2 mb-10">Warenkorb</h1>
                                <div className="d-flex justify-content-between">
                                    <h6 className="text-body">
                                        { cartItems.lenght > 1 ?

                                            `Es ist`

                                            :

                                            `Es sind`

                                        }{" "}
                                        <span className="text-brand">{ cartItems.length }</span>{" "}
                                        { cartItems.lenght > 1 ?

                                            `Produkte im Warenkorb`

                                            :

                                            `Produkt im Warenkorb`

                                        }
                                    </h6>

                                </div>
                            </div>
                        </div>

                        {/*<div className={`payment-iframe ${transactionID ? 'show' : ''}`}>
                            <iframe src={`${transactionID ? `https://pay.sandbox.datatrans.com/v1/start/${transactionID}` : ''}`}/>
                        </div>*/}
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
                                                    Produkte
                                                </th>
                                                <th scope="col">Stückpreis</th>
                                                <th scope="col">Anzahl</th>
                                                <th scope="col">Zwischentotal</th>
                                                <th scope="col" className="end">
                                                    Entfernen
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
                                                        <p className="text-dark font-sm font-weight-bold">{item.variant && `(${item.variant})`}</p>
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
                                                            CHF {item.price.toFixed(2)}
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
                                                                        item
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
                                                                        item
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
                                                            CHF {(item.quantity * item.price).toFixed(2)}
                                                        </h4>
                                                    </td>
                                                    <td
                                                        className="action"
                                                        data-title="Remove"
                                                    >
                                                        <a
                                                            onClick={(e) =>
                                                                deleteFromCart(
                                                                    item
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
                                                            Warenkorb leeren
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>


                                        </tbody>
                                    </table>
                                </div>

                                <div>


                                </div>

                                <div className="cart-action text-end">


                                <h4 className="text-brand">Total: CHF {price()}</h4>
                                <br />





                                    {cartItems.length <= 0 ?

                                        null

                                        :

                                        <>
                                    { !auth &&
                                    <Link href="/page-login" >
                                        <a className="btn " style={{ marginRight: "0.5rem" }}>

                                            Zur Kasse
                                        </a>
                                    </Link>
                                 }

                                { auth &&

                                        <a onClick={() => scrollTo(300,500)} className="btn " style={{ marginRight: "0.5rem" }}>

                                            Zur Kasse
                                        </a>

                                 }
                                 </>



                             }





                                    <Link href="/">
                                        <a className="" style={{ textDecoration: "underline" }}>
                                            <i className="fi-rs-shopping-bag mr-10"></i>
                                           Weiter einkaufen
                                        </a>
                                    </Link>
                                </div>

                                <div className="divider center_icon mt-50 mb-50">
                                    <i className="fi-rs-fingerprint"></i>
                                </div>
                                { !auth && <div className="font-xl text-center">
                                    <Link href="/page-login">
                                        <a>
                                            <i className="fi fi-rs-user"></i> Anmelden
                                        </a>
                                    </Link>
                                </div> }
                                { auth && <div className="row mb-50" ref={scrollToRef}>
                                    <div className="col-lg-6 col-md-12">
                                        <div className="heading_s1 mb-3">
                                            <h4>Lieferung</h4>
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
                                                        <h6 className="mb-3">Adresse</h6>

                                                        <div className="form-row">
                                                            <div className="form-group col-md-9">
                                                                <input
                                                                    required
                                                                    defaultValue={shippingAddress?.street}
                                                                    placeholder="Strasse"
                                                                    name="street"
                                                                    type="text"
                                                                />
                                                            </div>

                                                            <div className="form-group col-md-3">
                                                                <input
                                                                    required
                                                                    defaultValue={shippingAddress?.number}
                                                                    placeholder="Nr."
                                                                    name="number"
                                                                    type="text"
                                                                />
                                                            </div>
                                                        </div>



                                                        <div className="form-row">
                                                            <div className="form-group col-lg-3">
                                                                <input
                                                                    required
                                                                    defaultValue={shippingAddress?.zipcode}
                                                                    placeholder="PLZ"
                                                                    name="zipcode"
                                                                    type="text"
                                                                />
                                                            </div>
                                                            <div className="form-group col-lg-9">
                                                                <input
                                                                    required
                                                                    defaultValue={shippingAddress?.city}
                                                                    placeholder="Stadt"
                                                                    name="city"
                                                                    type="text"
                                                                />
                                                            </div>

                                                        </div>

                                                        <div className="form-row row">


                                                            <div className="form-group col-lg-6">
                                                                <div className="custom_select full-height">
                                                                    <select className="form-control select-active" name="country" defaultValue={shippingAddress?.country} required>

                                                                        <option value="CH">
                                                                            Schweiz
                                                                        </option>

                                                                    </select>
                                                                </div>
                                                            </div>

                                                        </div>

                                                        <div className="custome-checkbox mb-3">
                                                            <input className="form-check-input" type="checkbox" checked={billingAddressSame}
                                                                   id="flexCheckDefault" onChange={e => setBillingAddressSame(e.target.checked)} />
                                                                <label className="form-check-label"
                                                                       htmlFor="flexCheckDefault">
                                                                    Rechnungsadresse ist gleich wie Lieferadresse
                                                                </label>
                                                        </div>

                                                        { !billingAddressSame && (
                                                            <>
                                                                <h6 className="my-3">{t("cart-billing-address")}</h6>

                                                                <div className="form-row">
                                                                    <div className="form-group col-lg-9">
                                                                        <input
                                                                            required
                                                                            defaultValue={billingAddress?.street}
                                                                            placeholder="Strasse"
                                                                            name="b_address_street"
                                                                            type="text"
                                                                        />
                                                                    </div>

                                                                    <div className="form-group col-lg-3">
                                                                        <input
                                                                            required
                                                                            defaultValue={billingAddress?.number}
                                                                            placeholder="Nr."
                                                                            name="b_address_number"
                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="form-row">

                                                                </div>

                                                                <div className="form-row">
                                                                    <div className="form-group col-lg-3">
                                                                        <input
                                                                            required
                                                                            defaultValue={billingAddress?.zipcode}
                                                                            placeholder="PLZ"
                                                                            name="b_address_zipcode"
                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                    <div className="form-group col-lg-9">
                                                                        <input
                                                                            required
                                                                            defaultValue={billingAddress?.city}
                                                                            placeholder="Stadt"
                                                                            name="b_address_city"
                                                                            type="text"
                                                                        />
                                                                    </div>
                                                                </div>



                                                                <div className="form-row row">

                                                                    <div className="form-group col-lg-6">
                                                                        <div className="custom_select full-height">
                                                                            <select className="form-control select-active" name="b_address_country" defaultValue={billingAddress?.country} required>

                                                                                <option value="CH">
                                                                                    Schweiz
                                                                                </option>

                                                                            </select>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </>
                                                        )}

                                                        <div className="form-row">
                                                            <div className="form-group col-lg-12">
                                                                <button className="btn btn-sm me-2" type="submit">
                                                                    <i className="fi-rs-check mr-5" />
                                                                    { !!(shippingAddress && billingAddress) ? `Ändern` : `Speichern` }
                                                                </button>

                                                                { !!(shippingAddress && billingAddress) && (
                                                                    <button className="btn btn-sm" onClick={() => setShowAddressForm(false)}>
                                                                        <i className="fi-rs-cross mr-5" />
                                                                        Abbrechen
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
                                                        <h6 className="mb-2">Adresse</h6>
                                                        <div>
                                                            { shippingAddress?.street } { shippingAddress?.number } <br/>
                                                            { shippingAddress?.country } - { shippingAddress?.zipcode } { shippingAddress?.city } <br/>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-6">
                                                { (billingAddress && !showAddressForm) && (
                                                    <div className="px-2 text-dark checkout-address">
                                                        <h6 className="mb-2">Rechnungsadresse</h6>
                                                        <div>
                                                            { billingAddress?.street } { billingAddress?.number } <br/>
                                                            { billingAddress?.country } - { billingAddress?.zipcode } { billingAddress?.city } <br/>


                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                             { !showAddressForm && (
                                                 <div className="form-group mt-3">
                                                     <button className="btn btn-sm" onClick={addressChangeClickHandler}>
                                                         <i className="fi-rs-pencil mr-5"></i>
                                                         Ändern
                                                     </button>
                                                 </div>
                                             )}
                                        </div>

                                        { (price() > 0 && coupons) && (
                                            <div className="mb-30 mt-50">
                                                <div className="heading_s1 mb-3">
                                                    <h4>Gutschein</h4>
                                                </div>
                                                <div className="total-amount">
                                                    <div className="left">
                                                        <div className="coupon">
                                                            <form className="apply-coupon" onSubmit={applyCouponHandler}>
                                                                <input
                                                                    type="text"
                                                                    name="coupon"
                                                                    placeholder="Gutscheincode eingeben"
                                                                />
                                                                <button
                                                                    className="btn  btn-md"
                                                                    name="login"
                                                                    type="submit"
                                                                >
                                                                    Abschicken
                                                                </button>
                                                            </form>
                                                            { couponValid !== null && (
                                                                <>
                                                                    { couponValid && <small className="text-success">Gutschein angewendet</small> }
                                                                    { couponValid === false && <small className="text-danger">Ungültiger Gutscheincode</small> }
                                                                </>
                                                            )}

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-lg-6 col-md-12">
                                        <div className="border p-md-4 p-30 border-radius cart-totals">
                                            <div className="heading_s1 mb-3">
                                                <h4>Zusammenfassung</h4>
                                            </div>
                                            <br />
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <tbody>
                                                        <tr>
                                                            <td className="cart_total_label">
                                                                Zwischentotal
                                                            </td>
                                                            <td className="cart_total_amount">
                                                                <span className="font-lg fw-900 text-brand">
                                                                    CHF {price()}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                        { (price() > 0 && appliedCoupon) && (
                                                            <tr>
                                                                <td className="cart_total_label">
                                                                    Rabatt
                                                                </td>
                                                                <td className="cart_total_amount">
                                                                    <span className="font-lg fw-900 text-brand">
                                                                        {/*<i className="fisal mr-5"/>*/}
                                                                        - CHF { discountAmount }
                                                                        <small className="text-black-50 font-sm"> ({appliedCoupon.percentage}% günstiger)</small>
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        )}
                                                        <tr>
                                                            <td className="cart_total_label">
                                                                Lieferkosten
                                                            </td>
                                                            <td className="cart_total_amount text-brand">
                                                                <strong>
                                                                    <span className="font-lg fw-900 text-brand">
                                                                        { (shippingCost === null) ? `Berechnung` : `CHF ${shippingCost.toFixed(2)}` }
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
                                                                            <span>CHF {(price() - discountAmount + (shippingCost || 0)).toFixed(2)}</span>
                                                                            : <span>CHF {price()}</span>
                                                                        }
                                                                    </span>
                                                                </strong>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>


                                            <div className="custome-checkbox mb-3">
                                            <br />
                                            <br />


                                            <br />
                                            <br />
                                            <input className="form-check-input" type="checkbox" required
                                            id="flexCheckAGB" />
                                            <label className="form-check-label"
                                            htmlFor="flexCheckAGB">
                                                Ich akzeptiere die allgemeinen Geschäftsbedingungen.
                                                                </label>
                                                        </div>



                                            { (price() > 0) && (
                                                <button type="submit" className="btn" style={{ width: "100%" }} onClick={redirectToCheckout}>
                                                    <i className="fi-rs-box-alt mr-10"></i>
                                                    Jetzt kaufen
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
