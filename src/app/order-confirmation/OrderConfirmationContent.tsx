"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  Download,
  Mail,
  Package2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const OrderConfirmationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  useEffect(() => {
    if (!orderNumber) {
      router.push("/");
    }
  }, [orderNumber, router]);

  if (!orderNumber) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Success Icon */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Main Content Card */}
          <Card className="border-green-100">
            <CardContent className="pt-6 px-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Bestellung erfolgreich aufgegeben!
                </h1>
                <p className="text-gray-600">
                  Vielen Dank für Ihre Bestellung bei Grindel Restaurant
                </p>
              </div>

              {/* Order Info */}
              <div className="bg-green-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Bestellnummer</span>
                  <span className="font-semibold text-gray-900">
                    #{orderNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bestelldatum</span>
                  <span className="font-semibold text-gray-900">
                    {new Date().toLocaleDateString("de-DE")}
                  </span>
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-4 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Nächste Schritte
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-gray-900 font-medium">
                        Bestätigungs-E-Mail
                      </p>
                      <p className="text-sm text-gray-600">
                        Sie erhalten in Kürze eine Bestätigungs-E-Mail mit allen
                        Details
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Package2 className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                    <div>
                      <p className="text-gray-900 font-medium">
                        Bestellübersicht
                      </p>
                      <p className="text-sm text-gray-600">
                        Eine PDF-Übersicht Ihrer Bestellung wurde an Ihre E-Mail
                        gesendet
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  asChild
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Link href="/">
                    Zurück zur Startseite
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-green-200 hover:bg-green-50"
                >
                  <Link href="/menu">
                    Weitere Bestellung aufgeben
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support Info */}
          <div className="text-center text-sm text-gray-600">
            <p>Haben Sie Fragen zu Ihrer Bestellung?</p>
            <p className="mt-1">
              Kontaktieren Sie uns unter{" "}
              <a
                href="mailto:info@grindelbackhaus.de"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                info@grindelbackhaus.de
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmationContent;
