import React, { useState, useEffect } from 'react';
import Link from "next/link";
import useSWR from 'swr';
import Layout from "./../components/layout/Layout";
import { connect } from "react-redux";
import { clearCart } from "../redux/action/cart";
import {useRouter} from "next/router";
import {fetcher} from "../util/util";
import {getCurrentUser, createOrder} from "../rest/calls";
import Loading from "../components/elements/Loading";

const Success = ({ cart, clearCart, auth, validateRedirect }) => {
    const [ready, setReady] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);
    const { query: { session_id } } = useRouter();

    const { data, error } = useSWR(() => `/api/checkout_sessions/${session_id}`, fetcher);

    const saveOrderHandler = async () => {
        const user = await getCurrentUser();

        const shippingAddress = JSON.parse(localStorage.getItem('shipping-address'));
        const billingAddress = JSON.parse(localStorage.getItem('billing-address'));

        const data = {
            user: user.id,
            stripe_session_id: session_id,
            invoice_address: shippingAddress,
            shipping_address: billingAddress,
            products: cart.map(item => ({
                id: item.id,
                quantity: item.quantity,
            })),
        };

        createOrder(data)
            .then(res => {
                orderSuccessHandler();
            })
            .catch(err => {
                console.error("Order placed with stripe but unable to save to database. Error message: ", err.message);
                setOrderSuccess(false);
            });
    };

    const orderSuccessHandler = () => {
        clearCart();
        setOrderSuccess(true);
    }

    useEffect( () => {
        if (data) {
            saveOrderHandler();
        }
    }, [data]);

    useEffect(() => {
        validateRedirect();

        setTimeout(() => {
            setReady(true);
        }, 1500);
    }, []);

    /*useEffect(() => {
        saveOrderHandler();
    }, [])*/

    /*useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        const query = new URLSearchParams(window.location.search);
        if (query.get('success')) {
            clearCart();
            console.log('Order placed! You will receive an email confirmation.');
        }
    }, []);*/
    return (
        <>
            <Layout noBreadcrumb="d-none">
                { ((session_id && orderSuccess === null) || !ready) && (
                    <div className="text-center py-5">
                        <Loading />
                        <strong>Processing order. Please wait...</strong>
                    </div>
                )}

                { ready && (
                    <>
                        { (session_id && orderSuccess) && (
                            <div className="text-center py-5">
                                { !!(session_id && data) && (
                                    <>
                                        <h1>Order successful!</h1>
                                        <Link href="/">Click here to go to homepage</Link>
                                    </>
                                )}
                            </div>
                        )}

                        { (session_id && orderSuccess === false) && (
                            <div className="text-center py-5">
                                <h1>Unable to place your order. Please try again!</h1>
                                <Link href="/">Click here to go to homepage</Link>
                            </div>
                        )}

                        { !session_id && (
                            <div className="text-center py-5">
                                <h1>Invalid request. Something went wrong!</h1>
                                <Link href="/">Click here to go to homepage</Link>
                            </div>
                        )}
                    </>
                )}
            </Layout>
        </>
    );
};

const mapStateToProps = state => {
    return {
        cart: state.cart,
    }
}

const mapDispatchToProps = {
    clearCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(Success);
