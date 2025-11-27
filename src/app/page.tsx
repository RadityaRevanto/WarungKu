import Image from "next/image";
import Hero from "@/src/components/sections/hero";
import Navbar from "@/src/components/layouts/navbar";
import Produk from "../components/sections/produk";
import About from "../components/sections/about";
import Choseus from "../components/sections/chose-us";
import Client from "../components/sections/client";
import Footer from "../components/sections/footer";

export default function Home() {
  return (
    <div className="w-full min-h-screen overflow-x-hidden relative">
      <Navbar />
      <Hero />
      <Produk />
      <About />
      <Choseus />
      <Client />
      <section id="footer">
        <Footer />
      </section>
    </div>
  );
}
