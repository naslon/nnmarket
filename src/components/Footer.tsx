"use client";

import Link from "next/link";
import Image from "next/image";
import EmailSubscribe from "./EmailSubscribe";

export default function Footer() {
  function voltarAoTopo() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="bg-[#808080] text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Marca-mãe */}
          <div className="flex flex-col items-center sm:items-start gap-3">
            <div className="flex items-center gap-2">
              <Image
                src="/naslon-ventures.png"
                alt="NasloN Ventures"
                width={40}
                height={40}
                className="rounded"
              />
              <span className="font-bold text-lg">NasloN Ventures</span>
            </div>
            <p className="text-sm text-white/80 text-center sm:text-left">
              NasloN Market faz parte do grupo NasloN Ventures.
            </p>
          </div>

          {/* Atalhos */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <h3 className="font-semibold mb-1">Atalhos</h3>
            <Link
              href="/"
              className="text-sm bg-black/20 hover:bg-black/30 transition rounded-lg px-4 py-2 w-full sm:w-auto text-center"
            >
              Voltar ao catálogo
            </Link>
            <button
              onClick={voltarAoTopo}
              className="text-sm bg-black/20 hover:bg-black/30 transition rounded-lg px-4 py-2 w-full sm:w-auto text-center"
            >
              Voltar ao topo ↑
            </button>
          </div>

          {/* Redes sociais */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <h3 className="font-semibold mb-1">Fale conosco</h3>
            <a
              href="https://wa.me/5567998385083"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-black/20 hover:bg-black/30 transition rounded-lg px-4 py-2 w-full sm:w-auto text-center"
            >
              💬 WhatsApp
            </a>
            <a
              href="https://instagram.com/naslonmarket"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-black/20 hover:bg-black/30 transition rounded-lg px-4 py-2 w-full sm:w-auto text-center"
            >
              📷 Instagram
            </a>
          </div>

          {/* Inscrição por e-mail */}
          <EmailSubscribe />
        </div>

        <div className="border-t border-white/20 mt-8 pt-4 text-center text-xs text-white/60">
          © {new Date().getFullYear()} NasloN Market — parte da NasloN Ventures
        </div>
      </div>
    </footer>
  );
}
