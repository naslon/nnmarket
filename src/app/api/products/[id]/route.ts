import { NextResponse } from "next/server";
import { del, put } from "@vercel/blob";
import dbConnect from "../../../../lib/mongodb";
import Product from "../../../../models/Product";

// VER um produto
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Produto não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}

// EDITAR um produto
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const existing = await Product.findById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Produto não encontrado." },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priceRaw = formData.get("price") as string;
    const shopee = formData.get("shopee") as string;
    const mercadoLivre = formData.get("mercadoLivre") as string;
    const olx = formData.get("olx") as string;
    const facebook = formData.get("facebook") as string;
    const whatsapp = formData.get("whatsapp") as string;

    // URLs das imagens antigas que devem ser mantidas
    const keepImages = formData.getAll("keepImages") as string[];

    // Novas imagens enviadas
    const newFiles = formData.getAll("newImages") as File[];

    // Apaga do Blob as imagens antigas que NÃO estão na lista de manter
    const imagesToDelete = existing.images.filter(
      (img: string) => !keepImages.includes(img)
    );
    for (const imgUrl of imagesToDelete) {
      try {
        await del(imgUrl);
      } catch {
        // ignora se já não existir
      }
    }

    // Faz upload das novas imagens
    const uploadedUrls: string[] = [];
    for (const file of newFiles) {
      if (file.size > 0) {
        const blob = await put(`produtos/${Date.now()}-${file.name}`, file, {
          access: "public",
        });
        uploadedUrls.push(blob.url);
      }
    }

    const finalImages = [...keepImages, ...uploadedUrls];

    if (finalImages.length === 0) {
      return NextResponse.json(
        { success: false, message: "O produto precisa ter ao menos uma imagem." },
        { status: 400 }
      );
    }

    existing.title = title;
    existing.description = description;
    existing.price = priceRaw ? Number(priceRaw) : undefined;
    existing.images = finalImages;
    existing.links = {
      shopee: shopee || "",
      mercadoLivre: mercadoLivre || "",
      olx: olx || "",
      facebook: facebook || "",
      whatsapp: whatsapp || "",
    };

    await existing.save();

    return NextResponse.json({ success: true, product: existing });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}

// EXCLUIR um produto
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Produto não encontrado." },
        { status: 404 }
      );
    }

    for (const imageUrl of product.images) {
      try {
        await del(imageUrl);
      } catch {
        // se a imagem já não existir, ignora e segue
      }
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Produto excluído." });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}