"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [valor, setValor] = useState(
    pathname === "/" ? searchParams.get("q") || "" : ""
  );
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const primeiraRenderizacao = useRef(true);

  useEffect(() => {
    if (primeiraRenderizacao.current) {
      primeiraRenderizacao.current = false;
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (valor.trim()) {
        params.set("q", valor.trim());
      }
      router.push(`/?${params.toString()}`);
    }, 400);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor]);

  return (
    <div className="relative">
      <input
        type="text"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder="Buscar..."
        className="w-full bg-black/20 hover:bg-black/25 focus:bg-black/25 text-white placeholder-white/60 rounded-lg px-4 py-2 text-sm focus:outline-none transition-colors"
      />
      {valor && (
        <button
          onClick={() => setValor("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-sm"
          aria-label="Limpar busca"
        >
          ✕
        </button>
      )}
    </div>
  );
}