

import Image from "next/image";

export default function Choseus() {
    return (
        <section id="choseus" className="relative min-h-screen w-full overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="xl:flex xl:flex-row-reverse xl:items-center xl:justify-center xl:gap-12 xl:px-8">
                    <div className="mx-auto md:w-140 xl:mx-0 xl:mt-0 xl:flex-shrink-0 xl:w-200">
                        <Image
                            src="/assets/images/choseus/icon-choseus.png"
                            alt="About decor"
                            width={800}
                            height={800}
                            loading="lazy"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="mx-auto mt-7 xl:mx-0 xl:mt-0 xl:flex-1 xl:max-w-2xl">
                        <h1 className="font-semibold text-4xl text-center md:text-6xl xl:text-left">
                            Why Choose Us?
                        </h1>
                        <p className="text-justify font-semibold text-slate-600 mt-5 px-5 md:text-2xl md:px-15 md:mt-10 xl:px-0 xl:mt-15">
                            WarungKu delivered blazing fast performance, striking word Create customized popups and show the right message at the 
                        </p>
                        <div className="mt-5 px-5 md:text-2xl md:mt-10 xl:px-0 xl:mt-7">
                            <ul className="space-y-3">
                                <li className="flex items-center text-slate-600 font-semibold">
                                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                                    Easy to Use
                                </li>
                                <li className="flex items-center text-slate-600 font-semibold">
                                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                                    Good Support
                                </li>
                                <li className="flex items-center text-slate-600 font-semibold">
                                    <span className="w-2 h-2 bg-purple-600 rounded-full mr-3"></span>
                                    Amazing System
                                </li>
                            </ul>
                            <button className="mt-7 bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}