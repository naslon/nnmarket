import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import dbConnect from "../../../lib/mongodb";
import Product from "../../../models/product";

// LISTAR todos os produtos
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}

// CRIAR novo produto
export async function POST(request: Request) {
  try {
    await dbConnect();

    const formData = await request.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priceRaw = formData.get("price") as string;
    const shopee = formData.get("shopee") as string;
    const mercadoLivre = formData.get("mercadoLivre") as string;
    const olx = formData.get("olx") as string;
    const facebook = formData.get("facebook") as string;
    const whatsapp = formData.get("whatsapp") as string;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, message: "Título e descrição são obrigatórios." },
        { status: 400 }
      );
    }

    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "Envie ao menos uma imagem." },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const blob = await put(`produtos/${Date.now()}-${file.name}`, file, {
        access: "public",
      });
      uploadedUrls.push(blob.url);
    }

    const product = await Product.create({
      title,
      description,
      price: priceRaw ? Number(priceRaw) : undefined,
      images: uploadedUrls,
      links: {
        shopee: shopee || "",
        mercadoLivre: mercadoLivre || "",
        olx: olx || "",
        facebook: facebook || "",
        whatsapp: whatsapp || "",
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}