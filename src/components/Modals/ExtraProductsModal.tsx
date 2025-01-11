"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useAddExtraMutation } from "@/services/api";
import {
  selectSelectedProduct,
  selectIsAddingExtra,
  setIsAddingExtra,
  setError,
  clearSelectedProduct,
  selectShowModal,
  hideExtraModal,
  setExtraMode,
} from "@/redux/slices/extraSlice";
import { toast } from "sonner";

interface ExtraProductsModalProps {
  onNext: () => void;
}

const ExtraProductsModal: React.FC<ExtraProductsModalProps> = ({ onNext }) => {
  const dispatch = useDispatch();
  const selectedProduct = useSelector(selectSelectedProduct);
  const isAddingExtra = useSelector(selectIsAddingExtra);
  const [addExtra] = useAddExtraMutation();
  const isOpen = useSelector(selectShowModal);

  const handleAddExtra = async () => {
    if (!selectedProduct.id) {
      toast.error("Kein Produkt ausgewählt");
      return;
    }

    dispatch(setIsAddingExtra(true));
    try {
      const response = await addExtra({
        product_id: selectedProduct.id,
      }).unwrap();

      if (response.success) {
        toast.success("Extra erfolgreich hinzugefügt");
        dispatch(clearSelectedProduct());
        dispatch(hideExtraModal());
      }
    } catch (error) {
      console.error("Error adding extra:", error);
      dispatch(setError("Fehler beim Hinzufügen des Extras"));
      toast.error("Fehler beim Hinzufügen des Extras");
    } finally {
      dispatch(setIsAddingExtra(false));
    }
  };

  const handleClose = () => {
    dispatch(hideExtraModal());
  };

  const handleNext = () => {
    dispatch(hideExtraModal());
    onNext();
  };

  const handleContinueSelecting = () => {
    console.log("Enabling extra mode");
    dispatch(setExtraMode(true));
    dispatch(hideExtraModal());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-[5px] p-8 max-w-lg w-full shadow-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Kategorie vollständig!
              </h3>
              <p className="text-gray-600">
                Sie haben die erforderliche Anzahl an Produkten für diese
                Kategorie ausgewählt. Möchten Sie weitere Produkte hinzufügen
                oder zur nächsten Kategorie wechseln?
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleContinueSelecting}
                disabled={isAddingExtra}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-200 
                         rounded-md font-medium text-gray-700 hover:bg-gray-50 
                         transition-all duration-200 disabled:opacity-50"
              >
                Weiter auswählen
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-6 py-3 bg-green-600 rounded-md font-medium 
                         text-white hover:bg-green-700 transition-all duration-200 
                         flex items-center justify-center gap-2"
              >
                Nächste Kategorie
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 
                       rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExtraProductsModal;
