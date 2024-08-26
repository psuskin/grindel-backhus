// redux/actions/index.ts

// Action Types
export const ADD_TO_CART = "ADD_TO_CART";
export const SUBTRACT_FROM_CART = "SUBTRACT_FROM_CART";
export const GET_CART_SUCCESS = "GET_CART_SUCCESS";
export const DELETE_FROM_CART = "DELETE_FROM_CART";
export const UPDATE_CART_DATA = "UPDATE_CART_DATA";
export const ADD_QUANTITY = "ADD_QUANTITY";
export const ADD_MAIN_PRODUCT = "ADD_MAIN_PRODUCT";
export const EDIT_PRODUCT = "EDIT_PRODUCT";
export const SET_SELECTED_CITY = "SET_SELECTED_CITY";
export const SET_SELECTED_DELIVERY_METHOD = "SET_SELECTED_DELIVERY_METHOD";
export const SET_SELECTED_RESTAURANT = "SET_SELECTED_RESTAURANT";

// Define types for your actions
export interface CartItem {
    addedExtras: any;
    product_id: number;
    quantity: number;
   
}

interface Restaurant {
    id: number;
    name: string;
}

// Action Creators
export const addToCart = (item: CartItem) => ({
    type: ADD_TO_CART as typeof ADD_TO_CART,
    payload: item,
});

export const addToMainProduct = (item: CartItem) => ({
    type: ADD_MAIN_PRODUCT as typeof ADD_MAIN_PRODUCT,
    payload: item,
});

export const editProductAsync = (item: CartItem) => ({
    type: EDIT_PRODUCT as typeof EDIT_PRODUCT,
    payload: item,
});

export const addToQuantity = (item: CartItem) => ({
    type: ADD_QUANTITY as typeof ADD_QUANTITY,
    payload: item,
});

export const subtractFromCart = (item: CartItem) => ({
    type: SUBTRACT_FROM_CART as typeof SUBTRACT_FROM_CART,
    payload: item,
});

export const getCartSuccess = (cartItems: CartItem[]) => ({
    type: GET_CART_SUCCESS as typeof GET_CART_SUCCESS,
    payload: cartItems,
});

export const deleteFromCart = (item: CartItem) => ({
    type: DELETE_FROM_CART as typeof DELETE_FROM_CART,
    payload: item,
});

export const updateCartData = (updatedCartData: CartItem[]) => ({
    type: UPDATE_CART_DATA as typeof UPDATE_CART_DATA,
    payload: updatedCartData,
});

export const setSelectedCity = (selectedCity: string) => ({
    type: SET_SELECTED_CITY as typeof SET_SELECTED_CITY,
    payload: selectedCity,
});

export const setSelectedDeliveryMethod = (selectedDeliveryMethod: string) => ({
    type: SET_SELECTED_DELIVERY_METHOD as typeof SET_SELECTED_DELIVERY_METHOD,
    payload: selectedDeliveryMethod,
});

export const setSelectedRestaurant = (selectedRestaurant: Restaurant) => ({
    type: SET_SELECTED_RESTAURANT as typeof SET_SELECTED_RESTAURANT,
    payload: selectedRestaurant,
});

// Define a union type for all possible action types
export type CartActionTypes =
    | ReturnType<typeof addToCart>
    | ReturnType<typeof addToMainProduct>
    | ReturnType<typeof editProductAsync>
    | ReturnType<typeof addToQuantity>
    | ReturnType<typeof subtractFromCart>
    | ReturnType<typeof getCartSuccess>
    | ReturnType<typeof deleteFromCart>
    | ReturnType<typeof updateCartData>
    | ReturnType<typeof setSelectedCity>
    | ReturnType<typeof setSelectedDeliveryMethod>
    | ReturnType<typeof setSelectedRestaurant>;