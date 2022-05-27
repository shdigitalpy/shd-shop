import axios from "./index";

export const signUp = async ({ first_name, last_name, email, password, password2 }) => {
    try {
        const request = await axios.post('/register/', {
            first_name,
            last_name,
            email,
            password,
            password2,
        });
        const response = await request.data;
        if (response) {
            return await signIn({ username: email, password });
        }
    } catch (err) {
        console.log(err);
    }
};

export const createAuthToken = async ({ username, password }) => {
    try {
        const request = await axios.post('/api-token-auth/', { username, password });
        const response = await request.data;

        const token = response.auth_token || '';
        localStorage.setItem('token', token);
        return response;
    } catch (err) {
        console.log(err);
    }
};

export const signIn = async ({ username, password }) => {
    try {
        const request = await axios.post('/auth/token', { username, password });
        const response = await request.data;
        // console.log("token", response)

        const token = response.token || '';
        const id = response.id || '';
        localStorage.setItem('token', token);
        localStorage.setItem('userID', id);
        return response;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const signOut = async () => {
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('shipping-address');
        localStorage.removeItem('billing-address');
        // return await request.data;
        // const request = await axios.post('/auth/token/logout/');
    } catch (err) {
        console.log(err);
    }
};

export const setPassword = async ({ new_password }) => {
    try {
        const id = localStorage.getItem("userID");
        const request = await axios.patch(`/users/${id}/`, { password: new_password });
        return await request.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const updateProfile = async ({ first_name, last_name, username, phone, password }) => {
    try {
        const id = localStorage.getItem("userID");
        const request = await axios.patch(`/users/${id}/`, {
            first_name,
            last_name,
            username,
            phone,
            password
        });
        return await request.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const getProducts = async () => {
    try {
        const request = await axios.get('/products');
        return request.data;
    } catch (err) {
        console.log(err);
    }
};

export const getUsers = async () => {
    try {
        const request = await axios.get('/users');
        return request.data;
    } catch (err) {
        console.log(err);
    }
};

export const getCurrentUser = async () => {
    try {
        const id = localStorage.getItem("userID");
        const request = await axios.get(`/users/${id}`);
        return request.data;
    } catch (err) {
        console.log(err);
    }
};

export const getUser = async (id) => {
    try {
        const request = await axios.get(`/users/${id}`);
        return request.data;
    } catch (err) {
        console.log(err);
    }
};

export const getOrders = async () => {
    try {
        const request = await axios.get('/orders');
        return request.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const createOrder = async ({ user, invoice_address, shipping_address, stripe_session_id, products }) => {
    try {
        const request = await axios.post('/orders/', {
            user,
            products,
            invoice_address,
            shipping_address,
            stripe_session_id,
        });
        console.log("order created ", request.data)
        return await request.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const getCategories = async () => {
    try {
        const request = await axios.get('/category');
        return request.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const getCoupons = async () => {
    try {
        const request = await axios.get('/coupons');
        // console.log("coupons request done", request.data)
        return request.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const getShippingCost = async (cartData) => {
    try {
        const request = await axios.post('/shippingcost/', cartData);
        return request.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
};


