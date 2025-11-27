
"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface Testimonial {
    id: number;
    name: string;
    text: string;
    avatar: string;
    hasQuotes?: boolean;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: "Robin Ayala Doe",
        text: "any individuals have eaten in this kitchen and have proceeded to lead typical, solid lives. The route to a man's heart is through his stomach.",
        avatar: "/assets/images/clientt/avatar.jpeg",
        hasQuotes: false,
    },
    {
        id: 2,
        name: "John De marli",
        text: "any individuals have eaten in this kitchen and have proceeded to lead typical, solid lives. The route to a man's heart is through his stomach.",
        avatar: "/assets/images/clientt/avatar.jpeg",
        hasQuotes: true,
    },
    {
        id: 3,
        name: "Rowhan Smith",
        text: "any individuals have eaten in this kitchen and have proceeded to lead typical, solid lives. The route to a man's heart is through his stomach.",
        avatar: "/assets/images/clientt/avatar.jpeg",
        hasQuotes: true,
    },
    {
        id: 4,
        name: "Rowhan Smith",
        text: "any individuals have eaten in this kitchen and have proceeded to lead typical, solid lives. The route to a man's heart is through his stomach.",
        avatar: "/assets/images/clientt/avatar.jpeg",
        hasQuotes: true,
    },
    {
        id: 5,
        name: "Rowhan Smith",
        text: "any individuals have eaten in this kitchen and have proceeded to lead typical, solid lives. The route to a man's heart is through his stomach.",
        avatar: "/assets/images/clientt/avatar.jpeg",
        hasQuotes: true,
    },
];

export default function Client() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth >= 1280);
        };

        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    const nextSlide = () => {
        if (isDesktop) {
            // Di desktop, geser 1 card (karena menampilkan 3 sekaligus)
            setCurrentIndex((prev) => {
                const maxIndex = testimonials.length - 3;
                return prev >= maxIndex ? maxIndex : prev + 1;
            });
        } else {
            // Di mobile, geser 1 card
            setCurrentIndex((prev) => {
                const maxIndex = testimonials.length - 1;
                return prev >= maxIndex ? maxIndex : prev + 1;
            });
        }
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? 0 : prev - 1));
    };

    const getTransform = () => {
        if (isDesktop) {
            // Di desktop, setiap card adalah 33.333% dari container
            return `translateX(-${currentIndex * (60 / 2)}%)`;
        } else {
            // Di mobile, setiap card adalah 100% dari container
            return `translateX(-${currentIndex * 100}%)`;
        }
    };

    return (
        <section id="about" className="relative min-h-screen w-full overflow-hidden bg-[url(/assets/images/clientt/bg-client.png)] bg-cover bg-center bg-no-repeat py-16 md:py-24 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center gap-12 xl:px-8">
                    <div className="mx-auto mt-7 xl:mx-0 xl:mt-0 xl:max-w-3xl text-center">
                        <h1 className="font-semibold text-4xl text-center md:text-6xl">
                            What Our Happy Client Say
                        </h1>
                        <p className="text-center font-semibold text-slate-600 mt-5 px-5 md:text-xl md:px-15 md:mt-15 xl:px-0 xl:mt-15">
                            Things that make it the best place to start WarungKu
                        </p>
                    </div>
                    <div className="w-full mt-0">
                        <div className="relative overflow-hidden">
                            {/* Mobile: 1 card, Desktop: 3 cards */}
                            <div
                                className="flex gap-4 xl:gap-6 transition-transform duration-500 ease-in-out"
                                style={{
                                    transform: getTransform()
                                }}
                            >
                                {testimonials.map((testimonial) => (
                                    <div
                                        key={testimonial.id}
                                        className="min-w-full xl:min-w-[33.333%] px-2 sm:px-4 md:px-6 flex-shrink-0"
                                    >
                                        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 max-w-xs sm:max-w-sm md:max-w-md mx-auto xl:max-w-lg xl:mx-0">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-4">
                                                    <Image
                                                        src={testimonial.avatar}
                                                        alt={testimonial.name}
                                                        width={96}
                                                        height={96}
                                                        className="object-cover rounded-full"
                                                        onError={(e) => {
                                                            // Fallback jika gambar tidak ada
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='50' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3E%3F%3C/text%3E%3C/svg%3E";
                                                        }}
                                                    />
                                                </div>

                                                <div className="flex gap-1 mb-4">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            className="w-5 h-5 md:w-6 md:h-6 text-purple-600"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>

                                                <h3 className="font-bold text-lg md:text-xl text-slate-900 mb-4">
                                                    {testimonial.name}
                                                </h3>

                                                <div className="relative w-full">
                                                    {testimonial.hasQuotes && (
                                                        <div className="absolute -left-2 -top-6 sm:-left-4 sm:-top-8 md:-left-6 md:-top-10">
                                                            <span className="text-4xl sm:text-6xl md:text-8xl font-serif text-purple-200 leading-none">
                                                                "
                                                            </span>
                                                        </div>
                                                    )}
                                                    <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed px-1 sm:px-2">
                                                        {testimonial.text}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button
                                onClick={prevSlide}
                                className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${currentIndex === 0
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/30"
                                    }`}
                                disabled={currentIndex === 0}
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${(isDesktop && currentIndex >= testimonials.length - 3) || (!isDesktop && currentIndex >= testimonials.length - 1)
                                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                        : "bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/30"
                                    }`}
                                disabled={(isDesktop && currentIndex >= testimonials.length - 3) || (!isDesktop && currentIndex >= testimonials.length - 1)}
                                aria-label="Next testimonial"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}