"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Users } from "lucide-react";
import Loading from "@/components/Loading";
import { useGetPackagesQuery } from "@/services/api";

interface MenuItemProps {
  name: string;
  id: number;
  price: number;
  minimumClients: number;
}

const MenuItem: React.FC<MenuItemProps> = ({
  name,
  id,
  price,
  minimumClients,
}) => (
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
      <Link
        href={`/menu/shop?menu=${id}`}
        className="block w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300 text-center"
      >
        Select Package
      </Link>
    </div>
  </div>
);

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
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No packages available at the moment.</p>
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
