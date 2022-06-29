import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Layout from "./../components/layout/Layout";
import { connect } from "react-redux";
import { clearCart } from "../redux/action/cart";
import {getCurrentUser, createOrder} from "../rest/calls";
import Loading from "../components/elements/Loading";

const Success = ({ cart, clearCart, auth, validateRedirect }) => {
    const [ready, setReady] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);
    const [txnID, setTxnID] = useState('');

    const saveOrderHandler = async (dataTransTxnID) => {
        const user = await getCurrentUser();

        const shippingAddress = JSON.parse(localStorage.getItem('shipping-address'));
        const billingAddress = JSON.parse(localStorage.getItem('billing-address'));

        const data = {
            user: user.id,
            datatrans_trans_id: dataTransTxnID,
            invoice_address: shippingAddress,
            shipping_address: billingAddress,
            products: cart.map(item => ({
                id: item.id,
                variant: item.variant,
                price: item.price,
                quantity: item.quantity,
            })),
        };

        createOrder(data)
            .then(res => {
                orderSuccessHandler();
            })
            .catch(err => {
                console.error(err.message);
                setOrderSuccess(false);
            });
    };

    const orderSuccessHandler = () => {
        clearCart();
        setOrderSuccess(true);
        localStorage.removeItem('txn_id');
    }

    useEffect( () => {
        const dataTransTxnID = localStorage.getItem('txn_id');
        if (dataTransTxnID && cart.length > 0) {
            setTxnID(dataTransTxnID);
            saveOrderHandler(dataTransTxnID);
        }
    }, [cart]);

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
                { ((txnID && orderSuccess === null) || !ready) && (
                    <div className="text-center py-5">
                        <Loading />
                        <strong>Processing order. Please wait...</strong>
                    </div>
                )}

                { ready && (
                    <>
                        { (txnID && orderSuccess) && (
                            <div className="text-center py-5">
                                { !!(txnID && orderSuccess) && (
                                    <>
                                        <h1>Order successful!</h1>
                                        <Link href="/">Click here to go to homepage</Link>
                                    </>
                                )}
                            </div>
                        )}

                        { (txnID && orderSuccess === false) && (
                            <div className="text-center py-5">
                                <h1>Unable to place your order. Please try again!</h1>
                                <Link href="/">Click here to go to homepage</Link>
                            </div>
                        )}

                        { (txnID === '') && (
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
