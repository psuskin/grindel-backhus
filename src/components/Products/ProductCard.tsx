import { Product } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  addMainProductToAsync,
  editProductAsyncData,
  DeleteFromCartAsync,
} from "@/redux/thunk";
import { toast } from "sonner";
import { FiMinus, FiPlus } from "react-icons/fi";

interface ProductCardProps {
  product: Product & { quantity: number; cart_id?: string };
  activeCategoryName: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  activeCategoryName,
}) => {
  const dispatch = useAppDispatch();
  const [localQuantity, setLocalQuantity] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setLocalQuantity(Number(product.quantity) || 0);
  }, [product.quantity]);

  const updateQuantity = async (newQuantity: number) => {
    if (isUpdating) return;
    setIsUpdating(true);
    setLocalQuantity(newQuantity);
    const toastId = toast.loading("Updating cart...");
    try {
      if (newQuantity === 0) {
        await dispatch(DeleteFromCartAsync({
          product_id: product.product_id,
          cart_id: product.cart_id,
          quantity: 0,
        }));
        toast.success("Item removed from cart", { id: toastId });
      } else if (product.cart_id) {
        await dispatch(editProductAsyncData({
          product_id: product.product_id,
          cart_id: product.cart_id,
          quantity: newQuantity,
        }));
        toast.success("Cart updated", { id: toastId });
      } else {
        await dispatch(addMainProductToAsync({ ...product, quantity: newQuantity }));
        toast.success("Item added to cart", { id: toastId });
      }
    } catch (error) {
      console.error("Failed to update quantity", error);
      setLocalQuantity(Number(product.quantity) || 0);
      toast.error("Failed to update cart. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChoose = () => updateQuantity(1);
  const handleIncrement = () => updateQuantity(localQuantity + 1);
  const handleDecrement = () => {
    if (localQuantity > 0) {
      updateQuantity(localQuantity - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-[4/3]">
        {product.thumb ? (
          <Image
            src={product.thumb}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
          {product.price}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-auto">
          {localQuantity > 0 ? (
            <div className="flex items-center justify-between bg-gray-100 rounded-full p-1">
              <button 
                onClick={handleDecrement}
                className="w-8 h-8 flex items-center justify-center bg-white text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 shadow-sm"
                disabled={isUpdating}
              >
                <FiMinus className="w-4 h-4" />
              </button>
              <span className="font-medium text-lg text-gray-800 w-8 text-center">
                {localQuantity}
              </span>
              <button 
                onClick={handleIncrement}
                className="w-8 h-8 flex items-center justify-center bg-white text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 shadow-sm"
                disabled={isUpdating}
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleChoose}
              className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              disabled={isUpdating}
            >
             Choose
            </button>
          )}
          <Link
            href={`/menu/shop/${product.product_id}?menuName=${encodeURIComponent(
              activeCategoryName
            )}`}
            className="mt-3 block text-center text-sm text-green-600 hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
