import { Product } from "@/types/product";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { addMainProductToAsync } from "@/redux/thunk";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleAddToCart = async () => {
    const toastId = toast.loading("Adding products to the cart...");
    try {
      await dispatch(
        addMainProductToAsync({
          product_id: product.product_id,
          quantity: 1,
        })
      );
      toast.success("Product added successfully to the cart", { id: toastId });
      router.push(`/menu/shop/${product.product_id}`);
    } catch (error) {
      toast.error("Failed to add product to the cart", { id: toastId });
      console.error("Add to cart error:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3]">
        <Image
          src={product.thumb}
          alt={product.name}
          width={400}
          height={300}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-lg font-bold mb-4 mt-auto">{product.price}</p>
        <button
          onClick={handleAddToCart}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-4 rounded w-full"
        >
          In den Warenkorb
        </button>
      </div>
    </div>
  );
};

export default ProductCard;