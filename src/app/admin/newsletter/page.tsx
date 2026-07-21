"use client";

import { useEffect, useState } from "react";

export default function NewsletterPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [contagem, setContagem] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/subscribe")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setContagem(data.count);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const confirmar = confirm(
      `Enviar este e-mail para ${contagem ?? "todos os"} inscritos?`
    );
    if (!confirmar) return;

    setEnviando(true);

    try {
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });

      const data = await res.json();

      if (data.success) {
        alert(data.message);
        setSubject("");
        setMessage("");
      } else {
        alert("Erro: " + (data.message || data.error));
      }
    } catch (err) {
      alert("Erro ao enviar.");
      console.error(err);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Central de avisos</h1>
      <p className="text-sm text-zinc-500 mb-6">
        {contagem !== null
          ? `${contagem} inscrito(s) ativo(s)`
          : "Carregando inscritos..."}
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-zinc-200 rounded-lg p-5 flex flex-col gap-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Assunto</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            placeholder="Ex: Novidades na loja!"
            className="w-full border border-zinc-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mensagem</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={8}
            placeholder="Escreva o aviso que será enviado a todos os inscritos..."
            className="w-full border border-zinc-300 rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="bg-black hover:bg-zinc-800 disabled:bg-zinc-400 text-white py-3 rounded-lg font-medium transition"
        >
          {enviando ? "Enviando..." : "Enviar para todos os inscritos"}
        </button>
      </form>
    </main>
  );
}
