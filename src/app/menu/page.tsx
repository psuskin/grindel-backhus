"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Users } from "lucide-react";
import Loading from "@/components/Loading";
import { useGetPackagesQuery } from "@/services/api";
import { useRouter } from "next/navigation";
import { menuContents } from "@/constants/menuContents";
import GuestsCountModal from "@/components/Modals/GuestsCountModal";

interface MenuItemProps {
  name: string;
  id: number;
  price: number;
  minimumClients: number;
  productId: number;
}

const MenuItem: React.FC<MenuItemProps> = ({
  name,
  id,
  price,
  minimumClients,
}) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleSelectPackage = () => {
    setShowModal(true);
  };

  const handleGuestCountSubmit = (guestCount: number) => {
    setShowModal(false);
    router.push(`/menu/shop?menu=${id}&guests=${guestCount}`);
  };

  return (
    <>
      <div className="group flex flex-col justify-between bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-lg border border-gray-200 h-full">
        {/* Image Container - Fixed aspect ratio */}
        <div className="relative w-full aspect-[16/9]">
          <Image
            src="/images/menu.jpg"
            alt={name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-700 ease-out group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80"></div>

          {/* Title and Min Clients */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
            <div className="flex items-center text-white/90 text-sm">
              <Users className="w-4 h-4 mr-1.5" />
              <span>
                Min. {minimumClients} {minimumClients === 1 ? "Person" : "Personen"}
              </span>
            </div>
          </div>
        </div>

        {/* Content Container with flex-grow to push button to bottom */}
        <div className="flex flex-col flex-grow p-6">
          {/* Price Section */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold text-green-600">
              {price?.toFixed(2)} €
            </span>
            <span className="text-sm text-gray-500">/ Person</span>
          </div>

          {/* Package Contents with scrollable area if needed */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Paket beinhaltet
            </h4>
            <MenuContents menuId={id} />
          </div>

          {/* Button Section - Always at bottom */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <button
              onClick={handleSelectPackage}
              className="w-full bg-green-600 text-white py-3.5 rounded-xl font-medium
                       transition-all duration-300 
                       hover:bg-green-700 hover:shadow-md hover:shadow-green-600/20
                       active:scale-[0.98] relative overflow-hidden group/button"
            >
              <span className="relative z-10 flex items-center justify-center">
                Paket auswählen
              </span>
            </button>
          </div>
        </div>
      </div>

      <GuestsCountModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        packageData={{ id, name, minimumClients }}
        onSubmit={handleGuestCountSubmit}
      />
    </>
  );
};

// Updated MenuContents for consistent spacing
const MenuContents: React.FC<{ menuId: number }> = ({ menuId }) => {
  const content = menuContents[menuId];

  if (!content?.contents?.length) return null;

  return (
    <div className="grid grid-cols-1 gap-2">
      {content.contents.map((content, index) => (
        <div
          key={index}
          className="flex items-center py-2 px-3 rounded-[10px] bg-gray-50"
        >
          <div className="mr-3 flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 text-xs font-medium">
            {content.count}×
          </div>
          <span className="text-gray-700 text-sm">{content.name}</span>
        </div>
      ))}
    </div>
  );
};

const Menu = () => {
  const { data, isLoading, error } = useGetPackagesQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <div>Fehler beim Laden der Pakete. Bitte versuchen Sie es später erneut.</div>;
  }

  const packages = Array.isArray(data) ? data : data?.packages || [];

  return (
    <div className="max-w-7xl min-h-screen mx-auto px-4 py-16 mt-28">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
        Catering Pakete
      </h1>
      <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto text-lg">
        Wählen Sie aus unserer Auswahl an Catering-Paketen für Ihr Event.
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
          Derzeit sind keine Pakete verfügbar.
        </p>
      )}
      <div className="bg-green-50 rounded-2xl p-8 text-center border border-green-100">
        <p className="text-gray-700 text-lg max-w-3xl mx-auto">
          Lieferung, Aufbau, Reinigung und Abholung kostenlos, in ganz Deutschland! Getränke, Equipment und Personal können optional bestellt werden.
        </p>
      </div>
    </div>
  );
};

export default Menu;
