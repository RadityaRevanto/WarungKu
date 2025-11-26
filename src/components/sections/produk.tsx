import { IconShield, IconFolder, IconHeart } from "@tabler/icons-react";

export default function Produk() {
    return (
        <section id="Produk" className="relative w-full bg-white mt-65 md:mt-140 lg:mt-160 xl:mt-180 2xl:mt-210">
            <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                {/* Logo Partners Section */}
                <div className="mb-16 flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
                    <div className="text-2xl font-semibold text-slate-400">
                        Aditya Eka Narayan
                    </div>
                    <div className="flex items-center gap-2 text-2xl font-semibold text-slate-400">
                        Aisha Dwi Rahmawati
                    </div>
                    <div className="text-2xl font-semibold text-slate-400">
                        Raditya Revanto
                    </div>
                    <div className="flex items-center gap-2 text-2xl font-semibold text-slate-400">
                        Clarista Felisya Wijaya
                    </div>
                </div>

                {/* Main Heading Section */}
                <div className="mb-16 text-center mt-30 mb-30">
                    <h2 className="mb-4 text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl">
                        The Product We Work With
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg font-medium text-slate-500 sm:text-xl">
                        WarungKu Delivered Blazing Fast Performance, Striking Word Solution
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8 md:[&>div:not(:last-child)]:border-r md:[&>div:not(:last-child)]:border-slate-200 md:[&>div:not(:last-child)]:pr-8 md:[&>div:not(:first-child)]:pl-8">
                    {/* Feature 1: Core PHP */}
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                            <IconShield className="h-10 w-10 text-green-600" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-slate-900">Core REACT</h3>
                        <p className="text-base text-slate-500">
                            Create customized popups and show the right message at the right time to increase your conversion rate.
                        </p>
                    </div>

                    {/* Feature 2: Easy Customizable */}
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
                            <IconFolder className="h-10 w-10 text-orange-600" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-slate-900">Easy Customizable</h3>
                        <p className="text-base text-slate-500">
                            Create customized popups and show the right message at the right time to increase your conversion rate.
                        </p>
                    </div>

                    {/* Feature 3: Fast Support */}
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100">
                            <IconHeart className="h-10 w-10 text-pink-600" />
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-slate-900">Fast Support</h3>
                        <p className="text-base text-slate-500">
                            Create customized popups and show the right message at the right time to increase your conversion rate.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}