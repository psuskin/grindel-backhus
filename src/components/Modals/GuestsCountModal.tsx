"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useDeletePackageMutation } from "@/services/api";

interface GuestsCountModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: {
    id: number;
    name: string;
    minimumClients: number;
  };
  onSubmit: (guestCount: number) => void;
}

const GuestsCountModal: React.FC<GuestsCountModalProps> = ({
  isOpen,
  onClose,
  packageData,
  onSubmit,
}) => {
  const [guestCount, setGuestCount] = useState(packageData.minimumClients);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [deletePackage] = useDeletePackageMutation();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleSubmit = async () => {
    if (guestCount < packageData.minimumClients) {
      setError(`Mindestens ${packageData.minimumClients} Gäste erforderlich`);
      return;
    }

    try {
      await deletePackage({}).unwrap();

      onSubmit(guestCount);
    } catch (error) {
      console.error("Error clearing unfinished packages:", error);
      onSubmit(guestCount);
    }
  };

  const handleGuestCountChange = (value: string) => {
    const count = parseInt(value);
    setGuestCount(count);
    if (count < packageData.minimumClients) {
      setError(`Mindestens ${packageData.minimumClients} Gäste erforderlich`);
    } else {
      setError("");
    }
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-[5px] p-8 max-w-lg w-full shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {packageData.name}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Anzahl der Gäste
                  </label>
                  <input
                    type="number"
                    min={packageData.minimumClients}
                    value={guestCount}
                    onChange={(e) => handleGuestCountChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>

                <p className="text-sm text-gray-500">
                  Mindestanzahl der Gäste: {packageData.minimumClients}
                </p>

                <button
                  onClick={handleSubmit}
                  disabled={!!error || !guestCount}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-xl font-medium 
                           hover:bg-green-700 transition-colors 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Weiter zur Auswahl
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GuestsCountModal;
