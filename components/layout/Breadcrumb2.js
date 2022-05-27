import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import Link from "next/link"
import Tags from "../ecommerce/Filter/Tags";
import {getCategories} from "../../rest/calls";

const Breadcrumb2 = ({parent, sub, subChild, noBreadcrumb}) => {
    const router = useRouter()
    const [titlex, setTitlex] = useState(null);
    const [categories, setCategories] = useState([]);
    const [activeCat, setActiveCat] = useState(null);

    useEffect(() => {
        setTitlex(router.query.category);
    }, [router.query.category]);

    useEffect(() => {
        getCategories()
            .then(res => {
                setCategories(res);
            });
    }, []);

    useEffect(() => {
        if (categories.length > 1 && titlex) {
            const active = categories.find(cat => cat.slug === titlex);
            setActiveCat(active);
        }
    }, [categories, titlex]);
    return (
        <>
            <div className="page-header mt-30 mb-50">
            <div className="container">
                <div className="archive-header">
                    <div className="row align-items-center">
                        <div className="col-xl-3">
                            <h1 className="mb-15 text-capitalize">{titlex ? titlex : "Alle Produkte"}</h1>
                            <div className="breadcrumb">
                                <Link href="/"><a rel="nofollow"><i className="fi-rs-home mr-5"></i>Home</a></Link>
                                <span></span><Link href="/shop"><a rel="nofollow">Shop</a></Link><span></span> {activeCat?.name}
                            </div>
                        </div>
                        <div className="col-xl-9 text-end d-none d-xl-block">
                            {/*<Tags/>*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default Breadcrumb2;
