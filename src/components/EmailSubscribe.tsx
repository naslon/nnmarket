"use client";

import { useState } from "react";

export default function EmailSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "enviando" | "sucesso" | "erro">("idle");
  const [mensagem, setMensagem] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("enviando");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("sucesso");
        setMensagem(data.message);
        setEmail("");
      } else {
        setStatus("erro");
        setMensagem(data.message || "Erro ao se inscrever.");
      }
    } catch (err) {
      setStatus("erro");
      setMensagem("Erro ao se inscrever.");
    }
  }

  return (
    <div className="flex flex-col items-center sm:items-start gap-2">
      <h3 className="font-semibold mb-1">Receba novidades</h3>
      <p className="text-sm text-white/80 text-center sm:text-left">
        Cadastre seu e-mail e receba avisos de novos jogos e promoções.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="seu@email.com"
          className="flex-1 text-sm bg-black/20 placeholder-white/60 rounded-lg px-3 py-2 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "enviando"}
          className="text-sm bg-black hover:bg-zinc-800 disabled:bg-zinc-500 text-white rounded-lg px-4 py-2 transition"
        >
          {status === "enviando" ? "..." : "Inscrever"}
        </button>
      </form>
      {mensagem && (
        <p className={`text-xs ${status === "sucesso" ? "text-green-200" : "text-red-200"}`}>
          {mensagem}
        </p>
      )}
    </div>
  );
}
