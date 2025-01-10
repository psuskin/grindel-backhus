import CateringBookingProcess from "@/components/Home/BookingProcess/BookingProcess";
import CateringOverview from "@/components/Home/CateringOverview/CateringOverview";
import Home from "@/components/Home/Home/Home";
import React from "react";

const HomePage = () => {
  return (
    <>
      <Home />
      <CateringBookingProcess />
      {/* <CateringOverview /> */}
    </>
  );
};

export default HomePage;
