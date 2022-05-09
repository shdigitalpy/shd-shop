import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import Link from "next/link"
import Router from 'next/router';
import { signUp } from "../rest/calls";
import { useTranslation } from 'react-i18next';

function Register({ auth }) {

    const [errorMsg, setErrorMsg] = useState(null);

    const submitHandler = async (e) => {
        e.preventDefault();
        setErrorMsg(null);

        const data = {
            first_name: e.target.firstName.value,
            last_name: e.target.lastName.value,
            // username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password1.value,
            password2: e.target.password2.value,
        };

        signUp(data)
            .then(() => {
                // if (res) await Router.push('/');
                window.location.href = '/';
            }).catch(err => {
                setErrorMsg("Invalid user details");
            });
    };

    useEffect(() => {
        if (auth) {
            Router.push('/');
        }
    }, []);

    const {t} = useTranslation();

    return (
        <>
            <Layout parent="Home" sub="Pages" subChild="Login & Register" authPage>
            <div className="page-content pb-150">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-8 col-lg-10 col-md-12 m-auto">
                            <div className="row">
                                <div className="col-lg-6 pr-30 d-none d-lg-block">
                                    <img className="border-radius-15" src="assets/imgs/page/login-1.png" alt="" />
                                </div>
                                <div className="col-lg-6 col-md-8">
                                    <div className="login_wrap widget-taber-content background-white">
                                        <div className="padding_eight_all bg-white p-5 mt-50">
                                            <div className="heading_s1">
                                                <h1 className="mb-5">{t("register")}</h1>
                                                <p className="mb-30">{t("register-already")} <Link href="/page-login"><a>{t("register-login")}</a></Link></p>
                                            </div>
                                            <form onSubmit={submitHandler}>
                                                <div className="form-group">
                                                    <input type="text" required name="firstName" placeholder={t("register-firstname")} autoFocus />
                                                </div>
                                                <div className="form-group">
                                                    <input type="text" required name="lastName" placeholder={t("register-lastname")} />
                                                </div>
                                                {/*<div className="form-group">
                                                    <input type="text" required maxLength={150} name="username" placeholder="Username *" />
                                                </div>*/}
                                                <div className="form-group">
                                                    <input type="email" required name="email" placeholder={t("register-email")} />
                                                </div>
                                                <div className="form-group">
                                                    <input required type="password" name="password1" placeholder={t("register-pw1")} />
                                                </div>
                                                <div className="form-group">
                                                    <input required type="password" name="password2" placeholder={t("register-pw2")} />
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
                                                {/*<div className="login_footer form-group mb-50">
                                                    <div className="chek-form">
                                                        <div className="custome-checkbox">
                                                            <input className="form-check-input" type="checkbox" name="checkbox" id="exampleCheckbox1" value="" />
                                                            <label className="form-check-label" for="exampleCheckbox1"><span>Remember me</span></label>
                                                        </div>
                                                    </div>
                                                    <a className="text-muted" href="#">Forgot password?</a>
                                                </div>*/}
                                                <div className="form-group">
                                                    <button type="submit" className="btn btn-heading btn-block hover-up" name="login">{t("register-create")}</button>
                                                </div>
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

export default Register;
