"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getCartAsync } from "../../redux/thunk";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import ProductItem from "@/components/Products/ProductItem";
import { RootState } from "@/redux/store";
import Loading from "@/components/Loading";

interface CartItem {
  product_id: number;
  name?: string;
  thumb?: string;
  price?: string;
  quantity: number;
  leadTime?: string;
}

const Cart: React.FC = () => {
  const cartDataFromRedux = useSelector(
    (state: RootState) => state.cartItems || []
  );
  const dispatch = useAppDispatch();

  const [totalPrice, setTotalPrice] = useState<string>("0.00");
  const [cartData, setCartData] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(getCartAsync());
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(cartDataFromRedux)) {
      setCartData(cartDataFromRedux);
      const total = cartDataFromRedux.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
      );
      setTotalPrice(total.toFixed(2));
    }
  }, [cartDataFromRedux]);

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen py-28 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:container w-full mx-auto"
      >
        <div className="bg-green-50 rounded-2xl shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">
            Your Shopping Cart
          </h1>

          {cartData.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
              <Link
                href="/"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-colors hover:bg-green-700"
              >
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-5 gap-4 mb-4 font-semibold text-gray-700 border-b pb-2">
                <div className="col-span-2">Product</div>
                <div className="text-center">Price</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Total</div>
              </div>
              <div className="md:hidden grid grid-cols-3 gap-4 mb-4 font-semibold text-gray-700 border-b pb-2">
                <div>Product</div>
                <div className="text-center">Qty</div>
                <div className="text-right">Action</div>
              </div>
              <AnimatePresence>
                {cartData.map((item) => (
                  <ProductItem key={item.product_id} product={item} />
                ))}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12 flex flex-col md:flex-row justify-between items-center"
              >
                <div className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
                  Total: <span className="text-green-600">{totalPrice} €</span>
                </div>
                <Link
                  href="/checkout"
                  className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-all hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-1"
                >
                  Proceed to Checkout
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Cart;
