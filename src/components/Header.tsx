"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useState } from "react";
import SearchBar from "./SearchBar";

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="bg-[#7c7c7c] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold shrink-0">
          <Image
            src="/naslon1.png"
            alt="NN Market"
            width={45}
            height={45}
            className="rounded"
          />
          NasloN Market
        </Link>

        {/* Busca - só aparece no desktop aqui */}
        <div className="hidden md:block flex-1 max-w-md mx-6">
          <Suspense fallback={null}>
            <SearchBar />
          </Suspense>
        </div>

        {/* Menu desktop */}
        <nav className="hidden md:flex items-center gap-6 shrink-0">
          <Link href="/" className="hover:text-zinc-200 transition">
            Catálogo
          </Link>
          <Link
            href="/admin"
            className="bg-black hover:bg-zinc-800 text-white px-4 py-2 rounded-lg transition font-medium"
          >
            Painel Admin
          </Link>
        </nav>

        {/* Botão hambúrguer mobile */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Abrir menu"
        >
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
        </button>
      </div>

      {/* Menu mobile — sempre no DOM, só alterna visibilidade via CSS */}
      <nav
        className={`md:hidden flex-col gap-3 px-4 pb-4 ${
          menuAberto ? "flex" : "hidden"
        }`}
      >
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
        <Link
          href="/"
          className="py-2 border-b border-zinc-500"
          onClick={() => setMenuAberto(false)}
        >
          Catálogo
        </Link>
        <Link
          href="/admin"
          className="bg-black hover:bg-zinc-800 text-white px-4 py-2 rounded-lg text-center font-medium"
          onClick={() => setMenuAberto(false)}
        >
          Painel Admin
        </Link>
      </nav>
    </header>
  );
}