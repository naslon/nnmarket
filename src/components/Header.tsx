"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="bg-zinc-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Image
            src="/naslon.png"
            alt="NN Market"
            width={36}
            height={36}
            className="rounded"
          />
          NasloN Market
        </Link>

        {/* Menu desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="hover:text-emerald-400 transition">
            Catálogo
          </Link>
          <Link
            href="/admin"
            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg transition font-medium"
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

      {/* Menu mobile */}
      {menuAberto && (
        <nav className="md:hidden flex flex-col gap-2 px-4 pb-4">
          <Link
            href="/"
            className="py-2 border-b border-zinc-700"
            onClick={() => setMenuAberto(false)}
          >
            Catálogo
          </Link>
          <Link
            href="/admin"
            className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-center mt-2 font-medium"
            onClick={() => setMenuAberto(false)}
          >
            Painel Admin
          </Link>
        </nav>
      )}
    </header>
  );
}