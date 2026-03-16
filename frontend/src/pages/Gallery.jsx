import Navbar from "../components/layout/Navbar";
import GalleryGrid from "../components/gallery/GalleryGrid";
import React from "react";

export default function Gallery(){

  return(

    <div>

      <Navbar/>

      <div className="p-16">

        <h1 className="text-3xl mb-6">Gallery</h1>

        <GalleryGrid/>

      </div>

    </div>

  );

}