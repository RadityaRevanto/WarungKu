import Image from "next/image";


export default function Hero() {
    return (
        <section id="hero" className="w-full">
            <div className="flex flex-col items-center justify-center text-center pt-40 pb-20 px-4 sm:px-6 lg:px-8">
            <h1 className="text-6xl font-bold">Build Your Transaction <br /> By WarungKu APP.</h1>
            <p className="pt-8 font-medium text-slate-600">application from group 6 to solve the problem of recording shop stock</p>
            </div>
        </section>
    );
}
