import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import React from "react";
import HeroSection from "../components/hero/HeroSection";
import AboutClub from "../components/about/AboutClub";
import GalleryGrid from "../components/gallery/GalleryGrid";
import InstagramFeed from "../components/instagram/InstagramFeed";

export default function Home(){

  return(

    <div>

      <Navbar/>

      <HeroSection/>

      <AboutClub/>

      <div className="p-16">
        <h2 className="text-3xl mb-6">Gallery</h2>
        <GalleryGrid/>
      </div>

      <div className="p-16">
        <h2 className="text-3xl mb-6">Instagram</h2>
        <InstagramFeed/>
      </div>

      <Footer/>

    </div>

  );

}