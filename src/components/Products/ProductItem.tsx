import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { editProductAsyncData, DeleteFromCartAsync } from "../../redux/thunk";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { TrashIcon } from "lucide-react";

interface ProductItemProps {
  product_id: number;
  name: string;
  thumb: string;
  price: string;
  quantity: number;
  leadTime?: string;
}

const ProductItem = ({ product }: { product: any }) => {
  const dispatch = useAppDispatch();

  const handleIncrement = () => {
    dispatch(
      editProductAsyncData({
        ...product,
        quantity: Number(product.quantity) + 1,
      })
    );
  };

  const handleDecrement = () => {
    if (Number(product.quantity) > 1) {
      dispatch(
        editProductAsyncData({
          ...product,
          quantity: Number(product.quantity) - 1,
        })
      );
    } else {
      handleRemove();
    }
  };

  const handleRemove = () => {
    dispatch(DeleteFromCartAsync(product));
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-4 md:grid-cols-5 gap-4 items-center py-4 border-b border-gray-200"
    >
      <div className="col-span-2 flex items-center space-x-4">
        <div className="relative w-16 h-16 md:w-20 md:h-20 overflow-hidden rounded-lg">
          <Image
            src={product?.thumb || "/images/placeholder.png"}
            alt={product.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-sm md:text-lg text-gray-800">
            {product.name}
          </h3>
          {product.leadTime && (
            <p className="text-xs md:text-sm text-gray-500">
              Lead time: {product.leadTime}
            </p>
          )}
        </div>
      </div>
      <div className="text-center hidden md:block">
        <p className="font-medium text-gray-800">{product.price}</p>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex items-center bg-green-100 rounded-full p-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleDecrement}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm"
          >
            -
          </motion.button>
          <span className="mx-3 font-medium">{product.quantity}</span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleIncrement}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm"
          >
            +
          </motion.button>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <p className="hidden md:block font-semibold text-md md:text-lg text-gray-800">
          {(parseFloat(product.price) * product.quantity).toFixed(2)}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRemove}
          className="text-red-500 hover:text-red-600 transition-colors"
        >
          <TrashIcon className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductItem;
