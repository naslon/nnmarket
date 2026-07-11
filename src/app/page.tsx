import Link from "next/link";
import dbConnect from "../lib/mongodb";
import Product from "../models/Product";

export const dynamic = "force-dynamic";

interface ProductType {
  _id: string;
  title: string;
  price?: number;
  images: string[];
}

async function getProducts(): Promise<ProductType[]> {
  await dbConnect();
  const products = await Product.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(products));
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Catálogo de Jogos</h1>

      {products.length === 0 ? (
        <p className="text-zinc-500">Nenhum produto cadastrado ainda.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden border border-zinc-200"
            >
              <div className="aspect-square bg-zinc-100">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                {product.price !== undefined && (
                  <p className="font-bold text-lg">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </p>
                )}
                <p className="text-sm text-zinc-700 truncate">
                  {product.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}