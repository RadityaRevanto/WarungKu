import Image from "next/image";
import Hero from "@/src/components/sections/hero";
import Navbar from "@/src/components/layouts/navbar";
import Produk from "../components/sections/produk";
import About from "../components/sections/about";

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <Hero />
      <Produk />
      <About />
    </div>
  );
}
