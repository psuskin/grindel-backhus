// redux/thunk/index.ts

import axios from "axios";
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../store';
import {
  addToCart,
  subtractFromCart,
  getCartSuccess,
  deleteFromCart,
  addToQuantity,
  addToMainProduct,
  editProductAsync as editProductAction,
  setSelectedCity,
  setSelectedDeliveryMethod,
  setSelectedRestaurant,
  CartActionTypes
} from "../actions";

interface CartItem {
  product_id?: string;
  quantity: number;
  cart_id?: string;
  id_product?: string;
  attributes?: any;
  image?: string;

}

interface Restaurant {
  id: number;
  name: string;
}

type ThunkResult<R> = ThunkAction<R, RootState, undefined, CartActionTypes>;

export const addToCartAsync = (item: CartItem): ThunkResult<void> => {
  return async (dispatch) => {
    try {
      const response = await axios.post("/api/add-to-cart", {
        id: item.product_id,
        quantity: 1,
        cartId: item.cart_id ? item.cart_id : 0,
      });
      dispatch(addToCart(response.data));
      dispatch(getCartAsync());
    } catch (error) {
      console.error("Add to cart error", error);
    }
  };
};

export const addMainProductToAsync = (item: CartItem): ThunkResult<void> => {
  return async (dispatch) => {
    try {
      const response = await axios.post("/api/add-main-product", {
        id: item.product_id,
        quantity: item.quantity,
      });
      dispatch(addToMainProduct(response.data));
      dispatch(getCartAsync()); 
    } catch (error) {
      console.error("Add main product error", error);
    }
  };
};

export const editProductAsyncData = (item: CartItem): ThunkResult<void> => {
  return async (dispatch) => {
    try {
      const response = await axios.post("/api/edit-product", {
        id: item.cart_id,
        quantity: Number(item.quantity), 
      });

      dispatch(editProductAction(response.data));
      dispatch(getCartAsync());
    } catch (error) {
      console.error("Edit product error", error);
    }
  };
};

export const addToQuantityAsync = (item: CartItem): ThunkResult<void> => {
  return async (dispatch) => {
    try {
      const response = await axios.post("/api/add-to-cart", {
        id: item.id_product,
        quantity: 1,
        attributes: item.attributes,
      });
      dispatch(addToQuantity(response.data));
      dispatch(getCartAsync());
    } catch (error) {
      console.error("Add to quantity error", error);
    }
  };
};

export const subtractFromCartAsync = (item: CartItem): ThunkResult<void> => {
  return async (dispatch) => {
    try {
      const newQuantity = Math.max(1, Number(item.quantity) - 1);
      const response = await axios.post("/api/edit-product", {
        id: item.cart_id,
        quantity: newQuantity,
      });
      console.log(response);
      dispatch(subtractFromCart(response.data));
      dispatch(getCartAsync());
    } catch (error) {
      console.error("Subtract from cart error", error);
    }
  };
};

export const DeleteFromCartAsync = (item: CartItem): ThunkResult<void> => {
  return async (dispatch) => {
    try {
      const response = await axios.post("/api/edit-product", {
        id: item.cart_id,
        quantity: 0,
      });
      dispatch(deleteFromCart(response.data));
      dispatch(getCartAsync());
    } catch (error) {
      console.error("Delete from cart error", error);
    }
  };
};



export const getCartAsync = (): ThunkResult<void> => {
  return async (dispatch) => {
    try {
      const response = await axios.get("/api/get-cart");
      const responseData = response.data;

      const updatedContents = await Promise.all(
        responseData.products.map(async (ele: CartItem) => {
          if (ele && !ele.image) {
            const productResponse = await axios.post("/api/get-product-by-id", {
              productId: ele.product_id,
            });
            return {
              ...ele,
              image: productResponse.data.products.thumb,
            };
          } else {
            return ele;
          }
        })
      );

      const updatedData = {
        ...responseData,
        products: updatedContents,
      };

      dispatch(getCartSuccess(updatedData.products)); 
    } catch (err) {
      console.error("GET CART ERROR", err);
    }
  };
};


export const setSelectedCityAsync = (selectedCity: string): ThunkResult<void> => {
  return (dispatch) => {
    dispatch(setSelectedCity(selectedCity));
  };
};

export const setSelectedDeliveryMethodAsync = (selectedDeliveryMethod: string): ThunkResult<void> => {
  return (dispatch) => {
    dispatch(setSelectedDeliveryMethod(selectedDeliveryMethod));
  };
};

export const setSelectedRestaurantAsync = (selectedRestaurant: Restaurant): ThunkResult<void> => {
  return (dispatch) => {
    try {
      dispatch(setSelectedRestaurant(selectedRestaurant));
    } catch (error) {
      console.error("Error setting selected restaurant:", error);
    }
  };
};