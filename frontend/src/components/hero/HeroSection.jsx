import { motion } from "framer-motion";
import React from "react";

export default function HeroSection() {

return (

<section className="h-screen bg-black text-white flex items-center justify-center">

<div className="text-center">

<motion.h1
initial={{opacity:0,y:50}}
animate={{opacity:1,y:0}}
transition={{duration:1}}
className="text-5xl font-bold"
>

Experience Premium Horse Riding

</motion.h1>

<p className="mt-6 text-gray-300">

Book your riding slot and enjoy a professional riding experience.

</p>

<button className="mt-6 bg-orange-500 px-6 py-3 rounded-lg">

Book Now

</button>

</div>

</section>

);

}