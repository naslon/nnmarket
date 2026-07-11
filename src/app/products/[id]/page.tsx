import dbConnect from "../../../lib/mongodb";
import Product from "../../../models/Product";
import { notFound } from "next/navigation";
import ImageGallery from "../../../components/ImageGallery";

export const dynamic = "force-dynamic";

interface ProductType {
  _id: string;
  title: string;
  description: string;
  price?: number;
  images: string[];
  links: {
    shopee?: string;
    mercadoLivre?: string;
    olx?: string;
    facebook?: string;
    whatsapp?: string;
  };
}

async function getProduct(id: string): Promise<ProductType | null> {
  await dbConnect();
  try {
    const product = await Product.findById(id).lean();
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch {
    return null;
  }
}

export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const links = [
    { key: "whatsapp", label: "💬 WhatsApp", color: "bg-green-600 hover:bg-green-500" },
    { key: "shopee", label: "🛒 Shopee", color: "bg-orange-600 hover:bg-orange-500" },
    { key: "mercadoLivre", label: "🛍️ Mercado Livre", color: "bg-yellow-500 hover:bg-yellow-400" },
    { key: "olx", label: "📦 OLX", color: "bg-purple-600 hover:bg-purple-500" },
    { key: "facebook", label: "📘 Facebook Marketplace", color: "bg-blue-600 hover:bg-blue-500" },
  ] as const;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <ImageGallery images={product.images} alt={product.title} />

        <div>
          <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
          {product.price !== undefined && (
            <p className="text-3xl font-bold text-zinc-900 mb-4">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </p>
          )}
          <p className="text-zinc-700 mb-6 whitespace-pre-line">
            {product.description}
          </p>

          <div className="flex flex-col gap-2">
            {links.map(
              (link) =>
                product.links?.[link.key] && (
                  <a
                    key={link.key}
                    href={product.links[link.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${link.color} text-white text-center py-3 rounded-lg font-medium transition`}
                  >
                    {link.label}
                  </a>
                )
            )}
          </div>
        </div>
      </div>
    </main>
  );
}