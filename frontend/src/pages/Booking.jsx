import Navbar from "../components/layout/Navbar";
import BookingForm from "../components/booking/BookingForm";
import React from "react";

export default function Booking(){

  return(

    <div>

      <Navbar/>

      <div className="p-16">

        <h1 className="text-3xl mb-6">Book Your Ride</h1>

        <BookingForm/>

      </div>

    </div>

  );

}