import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
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

    // Apaga as imagens do Blob também
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