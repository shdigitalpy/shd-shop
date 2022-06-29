import * as Types from '../constants/actionTypes'
import storage from '../../util/localStorage';

export const addToCart = product => dispatch => {
    dispatch({
        type: Types.ADD_TO_CART,
        payload: { product }
    })
}


export const deleteFromCart = product => dispatch => {
    dispatch({
        type: Types.DELETE_FROM_CART,
        payload: { product }
    })
}

export const increaseQuantity = product => dispatch => {
    dispatch({
        type: Types.INCREASE_QUANTITY,
        payload: { product }
    })
}


export const decreaseQuantity = product => dispatch => {
    dispatch({
        type: Types.DECREASE_QUANTITY,
        payload: { product }
    })
}

/*export const updateAttribute = (productId, attribute) => dispatch => {
    console.log("entered action", productId, attribute)
    dispatch({
        type: Types.UPDATE_ATTRIBUTE,
        payload: { productId, attribute }
    })
}*/


export const openCart = () => dispatch => {
    dispatch({
        type: Types.OPEN_CART,
    })
}

export const clearCart = () => dispatch => {
    dispatch({
        type: Types.CLEAR_CART,
    })
}

export const closeCart = () => dispatch => {
    dispatch({
        type: Types.CLOSE_CART,
    })
}



