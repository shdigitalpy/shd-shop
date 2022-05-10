import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { updateProductFilters } from "../../../redux/action/productFiltersAction";
import { useTranslation } from 'react-i18next';

const SortSelect = ({ updateProductFilters }) => {
    const Router = useRouter();
    const searchTerm = Router.query.search;

    const [featured, setFeatured] = useState("");

    useEffect(() => {
        const filters = {
            featured,
        };

        updateProductFilters(filters);
    }, [searchTerm, featured]);

    const seleceOption = (e) => {
        setFeatured(e.target.value);
    };

    const {t} = useTranslation();

    return (
        <>
            <div className="sort-by-product-wrap">
                <div className="sort-by">
                    <span>
                        <i className="fi-rs-apps-sort"></i>
                        {t("products-sort")}
                    </span>
                </div>
                <div className="sort-by-dropdown-wrap custom-select">
                    <select onChange={(e) => seleceOption(e)}>
                        <option value="">Standard</option>
                        <option value="featured">{t("products-featured")}</option>
                        <option value="trending">{t("products-trending")}</option>
                        <option value="lowToHigh">{t("products-lowtohigh")}</option>
                        <option value="highToLow">{t("products-hightolow")}</option>
                    </select>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state) => ({
    products: state.products.items,
});

const mapDidpatchToProps = {
    updateProductFilters,
};

export default connect(mapStateToProps, mapDidpatchToProps)(SortSelect);
