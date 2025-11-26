

export default function About() {
    return (
        <section id="about" className="relative min-h-screen w-full overflow-hidden bg-[url(/assets/images/about/bg-about.png)] bg-cover bg-center bg-no-repeat py-16 md:py-24 lg:py-32">
            <div className="container mx-auto px-4">
                <div className="xl:flex xl:items-center xl:justify-center xl:gap-12 xl:px-8">
                    <div className="mx-auto -mt-15 md:w-140 xl:mx-0 xl:mt-0 xl:flex-shrink-0 xl:w-auto">
                        <img
                            src="/assets/images/about/icon-about.png"
                            alt="About decor"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="mx-auto mt-7 xl:mx-0 xl:mt-0 xl:flex-1 xl:max-w-2xl">
                        <h1 className="font-semibold text-4xl text-center md:text-6xl xl:text-left">
                            About WarungKu
                        </h1>
                        <p className="text-justify font-semibold text-slate-600 mt-5 px-5 md:text-xl md:px-15 md:mt-15 xl:px-0 xl:mt-15">
                            WarungKu adalah solusi manajemen toko yang dibuat khusus untuk membantu penjaga toko dan pemilik usaha kecil mengontrol operasional harian tanpa ribet. Dari memantau stok, mengatur produk, sampai melihat penjualan harian semua bisa kamu lakukan dalam satu aplikasi.
                            <br />
                            <br />
                            Tidak perlu lagi catatan manual yang berantakan. WarungKu menghadirkan cara yang lebih cepat, akurat, dan efisien untuk menjaga toko tetap berjalan lancar setiap hari.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}