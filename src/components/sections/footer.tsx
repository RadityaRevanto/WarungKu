
export default function Footer() {
  return (
    <footer className="bg-white text-slate-900 py-12 px-4 sm:px-8 md:px-12 lg:px-3 border-t border-slate-200">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 md:flex-row md:justify-between">
        <div className="space-y-4 md:max-w-sm">
          <h3 className="text-2xl font-semibold text-blue-600">WarungKu</h3>
          <p className="text-sm text-slate-600">
            WarungKu membantu UMKM kuliner mengelola pemesanan, stok, dan promosi
            dalam satu dashboard sederhana. Fokus pada rasa, kami bantu urus
            sisanya.
          </p>
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} WarungKu. All rights reserved.</p>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-6 text-sm sm:grid-cols-4">
          <div>
            <h4 className="mb-3 font-semibold text-slate-900">Menu</h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <a href="#" className="transition hover:text-primary">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="transition hover:text-primary">
                  About
                </a>
              </li>
              <li>
                <a href="#choseus" className="transition hover:text-primary">
                  Features
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-slate-900">Layanan</h4>
            <ul className="space-y-2 text-slate-600">
              <li>Integrasi POS</li>
              <li>Pelatihan Tim</li>
              <li>Dukungan 24/7</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-slate-900">Kontak</h4>
            <ul className="space-y-2 text-slate-600">
              <li>KelRPL@warungku.id</li>
              <li>+62 811-2222-3333</li>
              <li>Semarang, Indonesia</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-slate-900">Kontributor</h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <a href="https://portal.dinus.ac.id/show/NjYyOGMzNjcxMjA1NGQ3ZGIzNGEyYzkwZjA5MTcwNWItOTUyNDMtMjEyNzAxODAyMTIzNDgyMDcxMA~~" target="_blank" rel="noreferrer" className="transition hover:text-primary">
                  Aditya Eka Narayan
                </a>
              </li>
              <li>
                <a href="https://portal.dinus.ac.id/show/NTk0Y2FhYzIzYTdjNjFiMmYxMjgzMDM5MGM2YjJiZjItOTMyNjYtMjY2OTk5Nzg2NzEyODM3Mzk5Mg~~" target="_blank" rel="noreferrer" className="transition hover:text-primary">
                  Aisha Dwi Rahmawati
                </a>
              </li>
              <li>
                <a href="https://portal.dinus.ac.id/show/Yzc2NzNkNGY5NGZkOGEzMTc2Y2FjMmIxNWQ3ZTM3NGYtOTM3MjItMjc3MzI1MDQ4NzMyNjc3MzI4OA~~" target="_blank" rel="noreferrer" className="transition hover:text-primary">
                  Raditya Revanto
                </a>
              </li>
              <li>
                <a href="https://portal.dinus.ac.id/show/NDU4OGIyMzk5YmYzOWI3M2E0NDkyNTgxZjcyY2IzNDQtOTMyNTQtNzgyMTIyMDIwNjg4NDI5NDA~" target="_blank" rel="noreferrer" className="transition hover:text-primary">
                  Calrista Fenesiya Wijayanto
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
