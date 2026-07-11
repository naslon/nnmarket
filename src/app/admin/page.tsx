"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { compressImage } from "../../utils/compressImage";

interface ProductType {
    _id: string;
    title: string;
    price?: number;
    images: string[];
}

export default function AdminPage() {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [excluindoId, setExcluindoId] = useState<string | null>(null);

    // Campos do formulário
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [shopee, setShopee] = useState("");
    const [mercadoLivre, setMercadoLivre] = useState("");
    const [olx, setOlx] = useState("");
    const [facebook, setFacebook] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [images, setImages] = useState<FileList | null>(null);

    async function carregarProdutos() {
        setCarregando(true);
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            if (data.success) {
                setProducts(data.products);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarProdutos();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!images || images.length === 0) {
            alert("Selecione ao menos uma imagem.");
            return;
        }

        setEnviando(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            if (price) formData.append("price", price);
            formData.append("shopee", shopee);
            formData.append("mercadoLivre", mercadoLivre);
            formData.append("olx", olx);
            formData.append("facebook", facebook);
            formData.append("whatsapp", whatsapp);

            // Comprime cada imagem antes de enviar
            for (let i = 0; i < images.length; i++) {
                const compressed = await compressImage(images[i]);
                formData.append("images", compressed);
            }

            const res = await fetch("/api/products", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                // Limpa o formulário
                setTitle("");
                setDescription("");
                setPrice("");
                setShopee("");
                setMercadoLivre("");
                setOlx("");
                setFacebook("");
                setWhatsapp("");
                setImages(null);
                (document.getElementById("images-input") as HTMLInputElement).value = "";

                await carregarProdutos();
                alert("Produto adicionado com sucesso!");
            } else {
                alert("Erro: " + (data.message || data.error));
            }
        } catch (err) {
            alert("Erro ao enviar produto.");
            console.error(err);
        } finally {
            setEnviando(false);
        }
    }

    async function handleExcluir(id: string) {
        const confirmar = confirm("Tem certeza que deseja excluir este produto?");
        if (!confirmar) return;

        setExcluindoId(id);

        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            const data = await res.json();

            if (data.success) {
                setProducts((prev) => prev.filter((p) => p._id !== id));
            } else {
                alert("Erro ao excluir: " + (data.message || data.error));
            }
        } catch (err) {
            alert("Erro ao excluir produto.");
            console.error(err);
        } finally {
            setExcluindoId(null);
        }
    }

    return (
        <main className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Painel Admin</h1>

            {/* FORMULÁRIO DE ADICIONAR */}
            <form
                onSubmit={handleSubmit}
                className="bg-white border border-zinc-200 rounded-lg p-5 mb-10 flex flex-col gap-4"
            >
                <h2 className="text-lg font-semibold">Adicionar produto</h2>

                <div>
                    <label className="block text-sm font-medium mb-1">Título *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full border border-zinc-300 rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Descrição *</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={4}
                        className="w-full border border-zinc-300 rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Preço (R$)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Imagens * (pode selecionar várias)
                    </label>
                    <input
                        id="images-input"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => setImages(e.target.files)}
                        required
                        className="w-full border border-zinc-300 rounded-lg px-3 py-2"
                    />
                </div>

                <hr className="my-2" />
                <p className="text-sm text-zinc-500">Links (preencha os que tiver)</p>

                <div>
                    <label className="block text-sm font-medium mb-1">💬 WhatsApp</label>
                    <input
                        type="url"
                        placeholder="https://wa.me/55..."
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">🛒 Shopee</label>
                    <input
                        type="url"
                        value={shopee}
                        onChange={(e) => setShopee(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">🛍️ Mercado Livre</label>
                    <input
                        type="url"
                        value={mercadoLivre}
                        onChange={(e) => setMercadoLivre(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">📦 OLX</label>
                    <input
                        type="url"
                        value={olx}
                        onChange={(e) => setOlx(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        📘 Facebook Marketplace
                    </label>
                    <input
                        type="url"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                        className="w-full border border-zinc-300 rounded-lg px-3 py-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={enviando}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-400 text-white py-3 rounded-lg font-medium transition"
                >
                    {enviando ? "Enviando..." : "Adicionar produto"}
                </button>
            </form>

            {/* LISTA DE PRODUTOS */}
            <h2 className="text-lg font-semibold mb-4">
                Produtos cadastrados ({products.length})
            </h2>

            {carregando ? (
                <p className="text-zinc-500">Carregando...</p>
            ) : products.length === 0 ? (
                <p className="text-zinc-500">Nenhum produto cadastrado ainda.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="flex items-center gap-4 bg-white border border-zinc-200 rounded-lg p-3"
                        >
                            <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                                <p className="font-medium">{product.title}</p>
                                {product.price !== undefined && (
                                    <p className="text-sm text-zinc-500">
                                        R$ {product.price.toFixed(2).replace(".", ",")}
                                    </p>
                                )}
                            </div>
                            <Link
                                href={`/admin/editar/${product._id}`}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                            >
                                Editar
                            </Link>
                            <button
                                onClick={() => handleExcluir(product._id)}
                                disabled={excluindoId === product._id}
                                className="bg-red-600 hover:bg-red-500 disabled:bg-zinc-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                            >
                                {excluindoId === product._id ? "Excluindo..." : "Excluir"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}