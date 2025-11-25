
export default function Hero() {
    return (
        <section id="hero" className="relative w-full bg-white">
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-slate-50 to-white" />

            <div className="pointer-events-none absolute inset-0 hidden 2xl:block">
                <div className="relative top-40 left-48">
                    <img
                        src="/assets/images/hero/Icon 1.png"
                        alt="Hero icon"
                        className="h-38 w-38 drop-shadow-xl"
                    />
                </div>

                <div className="relative top-92 left-16">
                    <img
                        src="/assets/images/hero/Icon 2.png"
                        alt="Hero icon"
                        className="h-42 w-42 drop-shadow-xl"
                    />
                </div>

                <div className="relative -bottom-10 left-72">
                    <img
                        src="/assets/images/hero/Icon 3.png"
                        alt="Hero icon"
                        className="h-32 w-32 drop-shadow-xl"
                    />
                </div>

                <div className="relative bottom-82 left-320">
                    <img
                        src="/assets/images/hero/Icon 4.png"
                        alt="Hero icon"
                        className="h-32 w-32 drop-shadow-xl"
                    />
                </div>

                <div className="relative bottom-72 left-290">
                    <img
                        src="/assets/images/hero/Icon 5.png"
                        alt="Hero icon"
                        className="h-32 w-32 drop-shadow-xl"
                    />
                </div>

                <div className="relative bottom-60 left-325">
                    <img
                        src="/assets/images/hero/Icon 6.png"
                        alt="Hero icon"
                        className="h-32 w-32 drop-shadow-xl"
                    />
                </div>

                <div className="relative -top-40 left-70">
                    <img
                        src="/assets/images/hero/Icon 7.png"
                        alt="Hero icon"
                        className="h-32 w-32 drop-shadow-xl"
                    />
                </div>

                <div className="relative bottom-185 left-365">
                    <img
                        src="/assets/images/hero/Icon 8.png"
                        alt="Hero icon"
                        className="h-32 w-32 drop-shadow-xl"
                    />
                </div>
            </div>

            <div className="pointer-events-none absolute inset-0 ">
                <div className="relative inset-x-0 top-20 z-0 w-full ">
                    <img
                        src="/assets/images/hero/Vector 2.png"
                        alt=""
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="relative top-15 w-100 mx-auto md:w-150 md:-top-85 xl:-top-235 xl:w-250 2xl:-top-280">
                    <img
                        src="/assets/images/hero/Vector.png"
                        alt="Hero background"
                        className="h-ful w-full object-cover"
                    />
                </div>

                <div className="relative bottom-170 h-170 mx-auto z-10 w-full md:bottom-320 md:mx-auto md:h-250 md:w-full xl:-top-580 xl:w-full xl:h-350 2xl:-top-650">
                    <img
                        src="/assets/images/hero/Mask group.png"
                        alt="Hero background"
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="relative -top-250 mx-auto w-full 0 z-15 md:-top-470 md:w-150 xl:-top-770 xl:w-200 2xl:-top-880 2xl:w-250">
                    <img
                        src="/assets/images/hero/icon 9.png"
                        alt="Hero background"
                        className="h-ful w-full object-cover"
                    />
                </div> 
            </div>

            <div className="relative -mt-25 mx-auto flex min-h-[520px] max-w-5xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-10">
                <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                    Build Your Transaction <br /> By <span className="text-blue-600">WarungKu</span> APP.
                </h1>
                <p className="pt-8 text-base font-medium text-slate-600 sm:text-lg">
                    application from group 6 to solve the problem of recording shop stock
                </p>
            </div>
        </section>
    );
}