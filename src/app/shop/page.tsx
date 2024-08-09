"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/types/product";

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [sortBy, setSortBy] = useState("standard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (category: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: value,
    }));
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const applyFilters = (products: Product[]) => {
    return products;
  };

  const applySorting = (products: Product[]) => {
    return products.slice().sort((a, b) => {
      if (sortBy === "price-asc")
        return (
          parseFloat(a.price.replace("$", "")) -
          parseFloat(b.price.replace("$", ""))
        );
      if (sortBy === "price-desc")
        return (
          parseFloat(b.price.replace("$", "")) -
          parseFloat(a.price.replace("$", ""))
        );
      return 0; // Standard sorting
    });
  };

  const filteredProducts = applySorting(applyFilters(products));

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row mt-16">
      <aside className="w-full md:w-1/4 bg-gray-100 p-6 rounded-lg shadow-md mb-6 md:mb-0">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Filter</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-md font-bold text-gray-700 mb-2">
              Kategorien stöbern
            </h3>
            <div className="space-y-2">
              <select
                className="w-full p-2 border rounded bg-white text-gray-700"
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="all">All</option>
                {/* Add categories dynamically based on your products */}
              </select>
            </div>
          </div>
          <div>
            <h3 className="text-md font-bold text-gray-700 mb-2">
              Nach Allergenen filtern
            </h3>
            {/* Add allergen filter options */}
          </div>
        </div>
      </aside>
      <main className="w-full md:w-3/4 p-6">
        <div className="flex justify-end mb-4">
          <select
            className="px-4 py-2 border rounded bg-white text-gray-700"
            onChange={handleSortChange}
            value={sortBy}
          >
            <option value="standard">Standard</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Image
        src={product.thumb}
        alt={product.name}
        width={228}
        height={228}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.description}</p>
        <p className="text-gray-600 mb-4">{product.price}</p>
        {product.special && (
          <p className="text-red-500 mb-4">Special: {product.special}</p>
        )}
        <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          In den Warenkorb
        </button>
      </div>
    </div>
  );
};

export default Shop;
