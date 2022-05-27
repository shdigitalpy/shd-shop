import React, { useEffect, useState } from "react";
import ProductDetails from "../../../components/ecommerce/ProductDetails";
import Layout from '../../../components/layout/Layout';
import { connect } from "react-redux";
import {getCategories, getUsers} from '../../../rest/calls';
import { fetchProducts } from "../../../redux/action/product";

const ProductId = (
    {
        product,
        fetchProducts,
    }) => {
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCat, setActiveCat] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const result = await getUsers();
            setUsers(result);
        }

        getCategories()
            .then(res => {
                setCategories(res);
            });

        fetchProducts();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (categories.length > 1 && product) {
            const active = categories.find(cat => cat.slug === product.category1);
            setActiveCat(active);
        }
    }, [categories, product]);

    return (
        <>
            { product && (
                <Layout parent="Home" sub="Shop" category={activeCat?.name} catSlug={activeCat?.slug} subChild={product.title}>
                    

            <div className="container">
                        <ProductDetails product={product} users={users} />
                    </div>
                </Layout>
            )}
        </>
    );
};



ProductId.getInitialProps = async (params) => {
    return { slug: params.query.slug };
};

const mapStateToProps = (state, params) => {
    return {
        product: state.products.items.find(item => item.slug === params.slug),
    }
};

const mapDispatchToProps = {
    fetchProducts: fetchProducts,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductId);
