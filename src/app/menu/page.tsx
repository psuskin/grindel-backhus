import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MenuItemProps {
  title: string;
  description: string;
  items: number;
  dishes: number;
  price: number;
  isBestseller?: boolean;
  imageSrc: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  description,
  items,
  dishes,
  price,
  isBestseller,
  imageSrc,
}) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
    {isBestseller && (
      <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
        Bestseller
      </div>
    )}
    <div className="h-48">
      <Image
        src={imageSrc}
        alt={title}
        width={500}
        height={500}
        objectFit="cover"
      />
      <div className="flex items-center justify-center">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
      </div>
    </div>
    <div className="p-6">
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <ul className="mb-6 space-y-2">
        <li className="flex items-center">
          <svg
            className="w-5 h-5 text-green-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <span className="text-gray-700">{items} Choose finger food</span>
        </li>
        <li className="flex items-center">
          <svg
            className="w-5 h-5 text-green-600 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <span className="text-gray-700">{dishes} available dishes</span>
        </li>
      </ul>
      <div className="flex justify-between items-end mb-6">
        <div>
          <div className="text-3xl font-bold text-emerald-600">
            {price.toFixed(2)} €
          </div>
          <div className="text-sm text-gray-500">per person, plus VAT</div>
        </div>
        <div className="text-sm text-gray-500">from 15 people</div>
      </div>
      <Link
        href="/menu/shop"
        className="block w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-300 text-center"
      >
        Select dishes
      </Link>
    </div>
  </div>
);

const Menu = () => (
  <div className="max-w-5xl mx-auto px-4 py-10 mt-28">
    <h1 className="text-5xl font-bold text-center mb-4">Finger food menus</h1>
    <p className="text-center text-gray-600 mb-2 max-w-2xl mx-auto">
      Cold finger food snacks served on sustainable disposable plates.
    </p>
    <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
      Choose between four, five and six appetizers per person.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <MenuItem
        title="Finger food basic"
        description="Clear but inexpensive!"
        items={4}
        dishes={23}
        price={14.9}
        imageSrc="/images/menu.jpg"
      />
      <MenuItem
        title="Finger food classic"
        description="The standard finger food menu"
        items={5}
        dishes={42}
        price={18.9}
        isBestseller={true}
        imageSrc="/images/menu.jpg"
      />
      <MenuItem
        title="Finger food premium"
        description="Lots of choice for special occasions!"
        items={6}
        dishes={53}
        price={24.9}
        imageSrc="/images/menu.jpg"
      />
    </div>
    <p className="text-center text-gray-600 text-sm max-w-3xl mx-auto">
      Delivery, assembly, cleaning and collection free of charge, throughout
      Germany! Drinks, equipment and staff can be booked optionally.
    </p>
  </div>
);

export default Menu;
