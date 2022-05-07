import React, {useEffect, useState} from "react";
import Layout from "../components/layout/Layout";
import Link from "next/link"
import {signIn} from "../rest/calls";
import Router from "next/router";


function Login({ auth }) {
    const [errorMsg, setErrorMsg] = useState(null);

    const submitHandler = async (e) => {
        e.preventDefault();
        setErrorMsg(null);

        const data = {
            username: e.target.username.value,
            password: e.target.password.value,
        };

        signIn(data)
            .then(() => {
                // if (res) await Router.push('/');
                window.location.href = '/';
            }).catch(err => {
                setErrorMsg("Invalid username or password");
            });
    };

    useEffect(() => {
        if (auth) {
            Router.push('/');
        }
    }, []);

    return (
        <>
            <Layout parent="Home" sub="Pages" subChild="Login & Register" authPage>
            <div className="page-content pb-150 pt-150">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-8 col-lg-10 col-md-12 m-auto">
                            <div className="row">
                                <div className="col-lg-6 pr-30 d-none d-lg-block">
                                    <img className="border-radius-15" src="assets/imgs/page/login-1.png" alt="" />
                                </div>
                                <div className="col-lg-6 col-md-8">
                                    <div className="login_wrap widget-taber-content background-white">
                                        <div className="padding_eight_all bg-white p-5">
                                            <div className="heading_s1">
                                                <h1 className="mb-5">Anmelden</h1>
                                                <p className="mb-30">Noch kein Konto? <Link href="/page-register"><a>Jetzt registrieren.</a></Link></p>
                                            </div>
                                            <form onSubmit={submitHandler}>
                                                <div className="form-group">
                                                    <input type="text" required name="username" placeholder="Benutzername *" autoFocus />
                                                </div>
                                                <div className="form-group">
                                                    <input required type="password" name="password" placeholder="Passwort *" />
                                                </div>
                                                {/*<div className="login_footer form-group">
                                                    <div className="chek-form">
                                                        <input type="text" required="" name="email" placeholder="Security code *" />
                                                    </div>
                                                    <span className="security-code">
                                                        <b className="text-new">8</b>
                                                        <b className="text-hot">6</b>
                                                        <b className="text-sale">7</b>
                                                        <b className="text-best">5</b>
                                                    </span>
                                                </div>*/}
                                                <div className="login_footer form-group mb-1">
                                                    <div className="chek-form">
                                                        {/*<div className="custome-checkbox">
                                                            <input className="form-check-input" type="checkbox" name="checkbox" id="exampleCheckbox1" value="" />
                                                            <label className="form-check-label" for="exampleCheckbox1"><span>Remember me</span></label>
                                                        </div>*/}
                                                        <div className="form-group">
                                                            <button type="submit" className="btn btn-heading btn-block hover-up" name="login">Log in</button>
                                                        </div>
                                                    </div>
                                                    {/*<a className="text-muted" href="#">Forgot password?</a>*/}
                                                </div>
                                                { !!errorMsg && <span className="d-block text-start text-danger">{ errorMsg }</span> }
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </Layout>
        </>
    );
}

export default Login;
