// import fetch from 'isomorphic-unfetch'
import filterProductList from '../../util/filterProduct'
import searchItemsByText from '../../util/searchItemsByText'
import * as Types from '../constants/actionTypes'
import { getProducts } from "../../rest/calls";

// Fetch Product fetchProduct
export const fetchProducts = (searchTerm, filters, callback) => async dispatch => {
    const products = await getProducts();

    window.products = products;

    if (products) {
        const searchedItems = searchItemsByText(searchTerm, products);
        const filteredList = filterProductList(searchedItems, filters);

        dispatch({
            type: Types.FETCHED_PRODUCT,
            payload: { products: filteredList }
        });

        if (callback) callback();
    }
}


// Fetch More Product
export const fetchMoreProduct = (url, total) => async dispatch => {
    try {

        const sendRequest = await fetch(url)
        const data = await sendRequest.json()

        // const searchedItems = searchItemsByText(searchTerm,data)
        // const filteredList  = filterProductList(searchedItems,filters)

        dispatch({
            type: Types.FETCHED_MORE_PRODUCT,
            payload: { products: data, total }
        })

    } catch (error) {
        console.log(error)
    }

}


// Fetch Product By Catagory

export const fetchByCatagory = async (url, filters) => {
    try {

        const sendRequest = await fetch(url)
        const data = await sendRequest.json()
        const filteredList = filterProductList(data, filters)

        return filteredList

    } catch (error) {
        console.log(error)
    }
}
