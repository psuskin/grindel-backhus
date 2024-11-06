"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
import Loading from "@/components/Loading";
import {
  useGetPackagesQuery,
  useGetMenuContentQuery,
  useGetCartQuery,
} from "@/services/api";
import { useRouter } from "next/navigation";
import toast from "sonner";

interface MenuItemProps {
  name: string;
  id: number;
  price: number;
  minimumClients: number;
  productId: number;
}

const MenuContents: React.FC<{ menuId: number }> = ({ menuId }) => {
  const { data: menuContent } = useGetMenuContentQuery(menuId.toString());

  if (!menuContent?.contents?.length) return null;

  return (
    <div className="flex-grow">
      <div className="space-y-2">
        {menuContent.contents.map((content: any, index: number) => (
          <div key={index} className="flex items-center text-sm text-gray-600">
            <div className="w-1.5 h-1.5 rounded-full bg-green-600 mr-2"></div>
            <span className="font-medium text-gray-700">{content.count}×</span>
            <span className="ml-1.5">{content.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({
  name,
  id,
  price,
  minimumClients,
}) => {
  const router = useRouter();
  const { data: menuContent, isLoading: isMenuLoading } =
    useGetMenuContentQuery(id.toString());
  const { data: cartData, refetch: refetchCart } = useGetCartQuery();

  const handleSelectPackage = async () => {
    try {
      // First, fetch menu content
      await fetch("/api/get-menu-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ menu: id.toString() }),
      });

      // Wait for cart to update
      await refetchCart();

      // Verify the correct menu is in cart
      const updatedCart = await refetchCart().unwrap();
      if (updatedCart?.cart?.menu?.id === id) {
        router.push(`/menu/shop?menu=${id}`);
      } else {
        console.error("Failed to select package. Please try again.");
      }
    } catch (error) {
      console.error("Error selecting package:", error);
      console.error("Failed to select package. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl border border-green-100">
      <div className="relative h-56">
        <Image
          src="/images/menu.jpg"
          alt={name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white">{name}</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-6">
          <MenuContents menuId={id} />
        </div>

        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="text-3xl font-bold text-green-700">
              {price.toFixed(2)} €
            </div>
            <div className="text-sm text-gray-500">per person, plus VAT</div>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="w-4 h-4 mr-1" />
            Min. {minimumClients} {minimumClients === 1 ? "person" : "people"}
          </div>
        </div>
        <button
          onClick={handleSelectPackage}
          disabled={isMenuLoading}
          className={`block w-full ${
            isMenuLoading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
          } text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-300 text-center`}
        >
          {isMenuLoading ? "Loading..." : "Select Package"}
        </button>
      </div>
    </div>
  );
};

const Menu = () => {
  const { data, isLoading, error } = useGetPackagesQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error loading packages. Please try again later.</div>;
  }

  // Ensure packages is an array
  const packages = Array.isArray(data) ? data : data?.packages || [];
  console.log(packages);
  return (
    <div className="max-w-7xl min-h-screen mx-auto px-4 py-16 mt-28">
      <h1 className="text-5xl font-bold text-center mb-4 text-gray-800">
        Catering Packages
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
        Choose from our selection of catering packages to suit your event.
      </p>
      {packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {packages.map((pkg: MenuItemProps) => (
            <MenuItem
              key={pkg.id}
              name={pkg.name}
              id={pkg.id}
              price={pkg.price}
              minimumClients={pkg.minimumClients}
              productId={pkg.productId}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No packages available at the moment.
        </p>
      )}
      <div className="bg-green-50 rounded-xl p-8 text-center">
        <p className="text-gray-700 text-lg max-w-3xl mx-auto">
          Delivery, assembly, cleaning and collection free of charge, throughout
          Germany! Drinks, equipment and staff can be booked optionally.
        </p>
      </div>
    </div>
  );
};

export default Menu;
