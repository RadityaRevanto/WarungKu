import Image from "next/image";
import Hero from "@/src/components/sections/hero";
import Navbar from "@/src/components/layouts/navbar";
import Produk from "../components/sections/produk";
import About from "../components/sections/about";
import Choseus from "../components/sections/chose-us";

export default function Home() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden relative">
      <Navbar />
      <Hero />
      <Produk />
      <About />
      <Choseus />
    </div>
  );
}
