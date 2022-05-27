import React, { useEffect, useState } from "react";
import ProductDetails from "../../components/ecommerce/ProductDetails";
import Layout from '../../components/layout/Layout';
import { connect } from "react-redux";
import { getUsers } from '../../rest/calls';
import { fetchProducts } from "../../redux/action/product";
import Head from "next/head";

const ProductId = (
    {
        product,
        fetchProducts,
    }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const result = await getUsers();
            setUsers(result);
        }

        fetchProducts();
        fetchUsers();
    }, []);


    
    return (
        <>
            { product && (
                <Layout parent="Home" sub="Shop" subChild={product.title}>
                
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
