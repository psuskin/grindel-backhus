// redux/reducers/index.ts

import {
    ADD_TO_CART,
    SUBTRACT_FROM_CART,
    GET_CART_SUCCESS,
    UPDATE_CART_DATA,
    ADD_QUANTITY,
    DELETE_FROM_CART,
    ADD_MAIN_PRODUCT,
    EDIT_PRODUCT,
    SET_SELECTED_CITY,
    SET_SELECTED_DELIVERY_METHOD,
    SET_SELECTED_RESTAURANT,
    CartActionTypes
} from "../actions";

interface CartItem {
    product_id: number;
    quantity: number;
    price: string;
    // Add other properties as needed
}

interface Restaurant {
    id: number;
    name: string;
    // Add other properties as needed
}

interface CartState {
    cartItems: CartItem[] | null;
    selectedRestaurant: Restaurant | null;
    selectedCity: string | null;
    selectedDeliveryMethod: string | null;
}

const initialState: CartState = {
    cartItems: null,
    selectedRestaurant: null,
    selectedCity: null,
    selectedDeliveryMethod: null,
};

const reducer = (state = initialState, action: CartActionTypes): CartState => {
    switch (action.type) {
        case ADD_TO_CART:
        case ADD_MAIN_PRODUCT:
        case ADD_QUANTITY:
        case EDIT_PRODUCT:
        case UPDATE_CART_DATA:
        case DELETE_FROM_CART:
            return {
                ...state,
                cartItems: Array.isArray(action.payload)
                    ? action.payload as unknown as CartItem[]
                    : action.payload ? [action.payload as unknown as CartItem]
                        : null,
            };
        case SET_SELECTED_CITY:
            return {
                ...state,
                selectedCity: action.payload,
            };
        case SET_SELECTED_DELIVERY_METHOD:
            return {
                ...state,
                selectedDeliveryMethod: action.payload,
            };
        case SET_SELECTED_RESTAURANT:
            return {
                ...state,
                selectedRestaurant: action.payload,
            };

        case SUBTRACT_FROM_CART:
            // Implement subtraction logic here if needed
            return state;

        case GET_CART_SUCCESS:
            return {
                ...state,
                cartItems: action.payload as unknown as CartItem[],
            };

        default:
            return state;
    }
};

export default reducer;