"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetCartQuery,
  useEditProductMutation,
  useRemoveProductMutation,
  useDeletePackageMutation,
} from "@/services/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  Loader2,
  ArrowLeft,
  ShoppingBag,
  ChevronLeft,
} from "lucide-react";
import CartPackage from "@/components/Cart/CartPackage";
import { CartProduct, LoadingState, PackageOrder } from "@/types/packageOrders";
import {
  calculateExtrasTotal,
  calculateTotals,
  formatExtrasTotal,
} from "@/components/Cart/CartPriceCalculation";
import CartSkeleton from "@/components/Skeletons/CartSkeleton";

const Cart: React.FC = () => {
  const router = useRouter();
  const {
    data: cartData,
    isLoading: isCartLoading,
    error: cartError,
    refetch,
  } = useGetCartQuery();
  const [editProduct] = useEditProductMutation();
  const [removeProduct] = useRemoveProductMutation();
  const [deletePackage, { isLoading: isDeleting }] = useDeletePackageMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});
  const [deletingPackageId, setDeletingPackageId] = useState<string | null>(
    null
  );

  // Calculate totals
  const extrasTotal = useMemo(() => calculateExtrasTotal(cartData), [cartData]);
  const formattedExtrasTotal = useMemo(
    () => formatExtrasTotal(extrasTotal),
    [extrasTotal]
  );
  const { subTotal, totalPrice } = useMemo(
    () => calculateTotals(cartData, extrasTotal),
    [cartData, extrasTotal]
  );

  const handleIncrement = async (item: CartProduct) => {
    if (!item?.cart_id) {
      toast.error("Ungültiges Produkt");
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [item.cart_id]: true }));

    try {
      const newQuantity = Number(item.quantity) + 1;
      const response = await editProduct({
        id: item.cart_id,
        quantity: newQuantity,
      }).unwrap();

      await refetch();
      if (response.success) {
        toast.success("Artikelmenge erhöht");
      }
    } catch (error) {
      toast.error("Fehler beim Erhöhen der Artikelmenge");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [item.cart_id]: false }));
    }
  };

  const handleDecrement = async (item: CartProduct) => {
    if (Number(item.quantity) > 1) {
      try {
        const newQuantity = Number(item.quantity) - 1;
        const response = await editProduct({
          id: item.cart_id,
          quantity: newQuantity,
        }).unwrap();
        await refetch();

        if (response.success) {
          toast.success("Artikelmenge verringert");
        }
      } catch (error) {
        toast.error("Fehler beim Verringern der Artikelmenge");
      }
    } else {
      handleRemove(item);
    }
  };

  const handleRemove = async (item: CartProduct) => {
    try {
      const response = await removeProduct({
        id: item.cart_id,
        quantity: 0,
      }).unwrap();
      await refetch();

      if (response.success) {
        toast.success("Artikel entfernt");
      }
    } catch (error) {
      toast.error("Fehler beim Entfernen des Artikels");
    }
  };

  const handleDeletePackage = async (
    packageId: string,
    packageName: string
  ) => {
    try {
      setDeletingPackageId(packageId);
      console.log("Deleting package:", packageId);
      await deletePackage({ id: packageId }).unwrap();
      toast.success(`${packageName} wurde entfernt`);
      await refetch();
    } catch (error) {
      console.error("Delete package error:", error);
      toast.error("Fehler beim Entfernen des Pakets");
    } finally {
      setDeletingPackageId(null);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Möchten Sie wirklich den gesamten Warenkorb leeren?")) {
      try {
        await deletePackage({}).unwrap();
        toast.success("Warenkorb wurde erfolgreich geleert");
      } catch (error) {
        toast.error("Fehler beim Leeren des Warenkorbs");
      }
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const formattedPackages = Array.isArray(cartData?.cart?.order)
        ? cartData.cart.order
        : Object.values(cartData?.cart?.order || {});

      const packagesWithGuests = formattedPackages.map((pkg: any) => ({
        ...pkg,
        guests: pkg.guests || null,
      }));

      localStorage.setItem(
        "checkoutData",
        JSON.stringify({
          packages: packagesWithGuests,
          totals: cartData?.totals,
        })
      );

      router.push("/checkout");
    } catch (error) {
      toast.error("Fehler beim Weiterleiten zur Kasse");
      setIsProcessing(false);
    }
  };

  if (isCartLoading) return <CartSkeleton />;
  if (cartError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl text-red-500 mb-2">
            Fehler beim Laden des Warenkorbs
          </h2>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-first text-black rounded-xl"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  const cartItems = Array.isArray(cartData?.cart?.order)
    ? cartData.cart.order
    : Object.values(cartData?.cart?.order || {});

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          {/* Cart Header - New Design */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-green-50 p-2 rounded-lg mr-3">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-medium text-gray-800">
                  Your Cart
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {cartItems.length}{" "}
                  {cartItems.length === 1 ? "Paket" : "Pakete"}
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push("/menu")}
              className="group flex items-center text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
            >
              <div className="flex items-center justify-center bg-gray-50 group-hover:bg-green-50 w-8 h-8 rounded-lg mr-2 transition-colors">
                <ArrowLeft className="h-4 w-4" />
              </div>
              Continue Shopping
            </button>
          </div>

          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              <AnimatePresence mode="wait">
                {cartItems.map((pkg: PackageOrder, index: number) => (
                  <CartPackage
                    key={`${pkg.package}-${index}`}
                    pkg={pkg}
                    cartData={cartData}
                    onIncrement={handleIncrement}
                    onDecrement={handleDecrement}
                    onRemove={handleRemove}
                    loadingStates={loadingStates}
                    isDeleting={isDeleting && deletingPackageId === pkg.id}
                    handleDeletePackage={() =>
                      handleDeletePackage(pkg.id!, pkg.package)
                    }
                  />
                ))}
              </AnimatePresence>

              {/* Totals and Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-12 border-t pt-6"
              >
                <div className="flex flex-col md:flex-row justify-between items-start">
                  {/* Totals Section */}
                  <div className="w-full md:w-auto mb-6 md:mb-0">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">
                      Order Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center min-w-[240px]">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-lg font-medium text-gray-800">
                          {subTotal}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Extras:</span>
                        <span className="text-lg font-medium text-gray-800">
                          {formattedExtrasTotal}
                        </span>
                      </div>
                      <div className="h-px bg-gray-200 my-2"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-800">
                          Total:
                        </span>
                        <span className="text-xl font-semibold text-green-600">
                          {totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <div className="w-full md:w-auto">
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-12 py-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing...</span>
                        </div>
                      ) : (
                        "Proceed to Checkout"
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyCart = () => {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-center py-12"
    >
      <p className="text-xl text-gray-600 mb-6">Your cart is empty</p>
      <button
        onClick={() => router.push("/menu")}
        className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
      >
        Browse Menu
      </button>
    </motion.div>
  );
};
export default Cart;
