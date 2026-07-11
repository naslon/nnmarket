"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErro("");
        setEnviando(true);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (data.success) {
                window.location.href = "/admin";
            } else {
                setErro(data.message || "Usuário ou senha incorretos.");
            }
        } catch (err) {
            setErro("Erro ao tentar entrar.");
            console.error(err);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <main className="max-w-sm mx-auto px-4 py-20">
            <h1 className="text-2xl font-bold mb-6 text-center">Área restrita</h1>

            <form
                onSubmit={handleSubmit}
                className="bg-white border border-zinc-200 rounded-lg p-6 flex flex-col gap-4"
            >
                <div>
                    <label className="block text-sm font-medium mb-1">Usuário</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoFocus
                        className="w-full border border-zinc-300 rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full border border-zinc-300 rounded-lg px-3 py-2"
                    />
                </div>

                {erro && <p className="text-red-600 text-sm">{erro}</p>}

                <button
                    type="submit"
                    disabled={enviando}
                    className="bg-black hover:bg-zinc-800 disabled:bg-zinc-400 text-white py-3 rounded-lg font-medium transition"
                >
                    {enviando ? "Entrando..." : "Entrar"}
                </button>
            </form>
        </main>
    );
}