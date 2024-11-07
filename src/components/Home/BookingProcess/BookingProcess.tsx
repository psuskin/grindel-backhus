"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const CateringBookingProcess = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: "🍽️",
      title: "Wähle das Menü",
      description:
        "Wähle Dein Menü: Basic, Classic, Premium, à La Carte oder Special Package.",
      image: "/images/menu.jpg",
    },
    {
      icon: "🥗",
      title: "Gerichte & mehr",
      description:
        "Wähle Deine Gerichte, Getränke & Zubehör. Schritt für Schritt, wir helfen Dir dabei.",
      image: "/images/menu3.jpg",
    },
    {
      icon: "🚚",
      title: "Liefer- & Bezahl-Details",
      description:
        "Nenne uns Deine Bestell-Details: Ausfüllen, abschicken & wir kümmern uns um den Rest.",
      image: "/images/menu.jpg",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            Buche jetzt Dein Grindel Backhus Catering
          </h2>
          <p className="text-xl text-gray-600">
            Catering bestellen war noch nie so einfach! Stelle Dir Dein
            individuelles Wunsch-Buffet zusammen.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between mb-20">
          <div className="lg:w-1/2 mb-10 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src="/images/menu3.jpg"
                alt="Grindel Backhus Catering Interface"
                width={600}
                height={400}
                className="rounded-lg shadow-md"
              />
            </motion.div>
          </div>
          <div className="lg:w-1/2 lg:pl-16">
            <h3 className="text-3xl font-semibold text-gray-800 mb-6">
              Einfach, Schnell, Zuverlässig
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Wir liefern Dir für jedes besondere Ereignis bundesweit
              hochwertiges Catering zu einem fairen Preis – vertraue den Grindel
              Backhus Catering Erfahrungen und buche jetzt!
            </p>
            <button className="bg-green-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-green-700 transition duration-300">
              Jetzt buchen
            </button>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Wie funktioniert Grindel Backhus catering?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`bg-white p-8 rounded-lg border text-center cursor-pointer ${
                  index === activeStep ? "ring-2 ring-green-500" : ""
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div className="text-5xl mb-4">{step.icon}</div>
                <h4 className="text-2xl font-semibold text-gray-800 mb-3">
                  {step.title}
                </h4>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-green-100 p-8 rounded-xl shadow-inner"
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <Image
                src={steps[activeStep].image}
                alt={steps[activeStep].title}
                width={500}
                height={300}
                className="rounded-lg shadow-md"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h4 className="text-3xl font-semibold text-gray-800 mb-4">
                {steps[activeStep].title}
              </h4>
              <p className="text-lg text-gray-600 mb-6">
                {steps[activeStep].description}
              </p>
              <button className="bg-green-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-green-700 transition duration-300 shadow-md">
                Mehr erfahren
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CateringBookingProcess;
