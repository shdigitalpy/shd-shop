import React, { useEffect, useState } from "react";
import Cat1Tab from '../elements/FeaturedTab';
import Cat2Tab from '../elements/NewArrivalTab';
import Cat3Tab from '../elements/TrendingTab';
import { connect } from 'react-redux';
import Loading from '../elements/Loading';
// import Link from 'next/link'
import { useTranslation } from 'react-i18next';


function CategoryTab({ allProducts }) {
    const [active, setActive] = useState("1");
    const [catAll, setCatAll] = useState([]);
    const [cat1, setCat1] = useState([]);
    const [cat2, setCat2] = useState([]);
    const [cat3, setCat3] = useState([]);

    const catPAll = async () => {
        const catAllItem = [...allProducts].slice(0, 10);
        setCatAll(catAllItem);
        setActive("1");
    };
    const catP1 = async () => {
        const cat1Item = allProducts.filter((item) => item.featured);
        setCat1(cat1Item);
        setActive("2");
    };

    const catP2 = async () => {
        const cat2Item = allProducts.filter((item) => item.trending);
        setCat2(cat2Item);
        setActive("3");
    };
    const catP3 = async () => {
        const cat3Item = allProducts.filter((item) => {
            const dateCreation = new Date(item.created);
            const dateToday = new Date();
            const diffTime = Math.abs(dateCreation - dateToday);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 30;
        });
        setCat3(cat3Item);
        setActive("4");
    };

    useEffect(() => {
        catPAll();
    }, [allProducts]);


    const {t} = useTranslation();

    return (
        <>
            <div className="section-title style-2 wow animate__animated animate__fadeIn">
                <h3>Beliebte Produkte</h3>
                <ul className="nav nav-tabs links" id="myTab" role="tablist">
                    
                    <li className="nav-item" role="presentation">
                        <button
                            className={
                                active === "2" ? "nav-link active" : "nav-link"
                            }
                            onClick={catP1}
                        >
                            {t("main-featured")}
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={
                                active === "3" ? "nav-link active" : "nav-link"
                            }
                            onClick={catP2}
                        >
                            {t("main-popular")}
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={
                                active === "4" ? "nav-link active" : "nav-link"
                            }
                            onClick={catP3}
                        >
                           {t("main-newadded")}
                        </button>
                    </li>
                </ul>
            </div>

            { allProducts.length ? (
                <div className="tab-content wow fadeIn animated">
                    <div
                        className={
                            active === "1"
                                ? "tab-pane fade show active"
                                : "tab-pane fade"
                        }
                    >
                        <div className="product-grid-4 row">
                            <Cat1Tab products={catAll} />
                        </div>
                    </div>

                    <div
                        className={
                            active === "2"
                                ? "tab-pane fade show active"
                                : "tab-pane fade"
                        }
                    >
                        <div className="product-grid-4 row">
                            <Cat1Tab products={cat1} />
                        </div>
                    </div>

                    <div
                        className={
                            active === "3"
                                ? "tab-pane fade show active"
                                : "tab-pane fade"
                        }
                    >
                        <div className="product-grid-4 row">
                            <Cat3Tab products={cat2} />
                        </div>
                    </div>

                    <div
                        className={
                            active === "4"
                                ? "tab-pane fade show active"
                                : "tab-pane fade"
                        }
                    >
                        <div className="product-grid-4 row">
                            <Cat2Tab products={cat3} />
                        </div>
                    </div>
                </div>
            ) : <Loading /> }
        </>
    );
}

const mapStateToProps = state => ({
    allProducts: state.products.items,
});

export default connect(mapStateToProps)(CategoryTab);
