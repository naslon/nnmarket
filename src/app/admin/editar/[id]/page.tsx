"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { compressImage } from "../../../../utils/compressImage";

export default function EditarProdutoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [shopee, setShopee] = useState("");
  const [mercadoLivre, setMercadoLivre] = useState("");
  const [olx, setOlx] = useState("");
  const [facebook, setFacebook] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<FileList | null>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.success) {
          const p = data.product;
          setTitle(p.title);
          setDescription(p.description);
          setPrice(p.price !== undefined ? String(p.price) : "");
          setShopee(p.links?.shopee || "");
          setMercadoLivre(p.links?.mercadoLivre || "");
          setOlx(p.links?.olx || "");
          setFacebook(p.links?.facebook || "");
          setWhatsapp(p.links?.whatsapp || "");
          setExistingImages(p.images);
        } else {
          alert("Produto não encontrado.");
          router.push("/admin");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [id, router]);

  function removerImagemExistente(url: string) {
    setExistingImages((prev) => prev.filter((img) => img !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (existingImages.length === 0 && (!newImages || newImages.length === 0)) {
      alert("O produto precisa ter ao menos uma imagem.");
      return;
    }

    setSalvando(true);

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

      existingImages.forEach((url) => formData.append("keepImages", url));

      if (newImages) {
        for (let i = 0; i < newImages.length; i++) {
          const compressed = await compressImage(newImages[i]);
          formData.append("newImages", compressed);
        }
      }

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("Produto atualizado com sucesso!");
        router.push("/admin");
      } else {
        alert("Erro: " + (data.message || data.error));
      }
    } catch (err) {
      alert("Erro ao salvar produto.");
      console.error(err);
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-zinc-500">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Editar produto</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-zinc-200 rounded-lg p-5 flex flex-col gap-4"
      >
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
          <label className="block text-sm font-medium mb-2">
            Imagens atuais
          </label>
          {existingImages.length === 0 ? (
            <p className="text-sm text-zinc-500 mb-2">Nenhuma imagem restante.</p>
          ) : (
            <div className="grid grid-cols-4 gap-2 mb-2">
              {existingImages.map((url) => (
                <div key={url} className="relative">
                  <img
                    src={url}
                    alt=""
                    className="w-full aspect-square object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removerImagemExistente(url)}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center"
                    title="Remover imagem"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="block text-sm font-medium mb-1">
            Adicionar novas imagens
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setNewImages(e.target.files)}
            className="w-full border border-zinc-300 rounded-lg px-3 py-2"
          />
        </div>

        <hr className="my-2" />
        <p className="text-sm text-zinc-500">Links (preencha os que tiver)</p>

        <div>
          <label className="block text-sm font-medium mb-1">💬 WhatsApp</label>
          <input
            type="url"
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

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={salvando}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-400 text-white py-3 rounded-lg font-medium transition"
          >
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="px-6 py-3 border border-zinc-300 rounded-lg font-medium hover:bg-zinc-50 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
}