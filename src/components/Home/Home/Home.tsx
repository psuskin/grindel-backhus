import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <div className="relative bg-gray-900 overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 parallax"
        style={{ backgroundImage: "url(/images/heroImage.jpg)" }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Catering Hamburg by Grindel Backhus
        </h1>
        <p className="mt-6 max-w-3xl text-xl text-gray-300">
          Fresh & fine dishes delivered directly. We&apos;ve been Hamburg&apos;s
          catering experts for over 15 years, offering everything from delicious
          finger food to comprehensive catering solutions.
        </p>

        {/* Features */}
        <div className="mt-10 max-w-sm sm:max-w-none sm:flex sm:justify-center">
          <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
            {[
              "15 years of experience",
              "Fresh & Healthy",
              "Large selection",
              "Climate neutral",
              "Inexpensive",
              "From 150 €",
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center text-base text-gray-300"
              >
                <svg
                  className="flex-shrink-0 h-6 w-6 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-3">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-10">
          <Link
            href="/menu"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-150 ease-in-out"
          >
            To the Catering Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
