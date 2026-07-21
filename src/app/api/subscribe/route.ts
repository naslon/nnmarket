import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "../../../lib/mongodb";
import Subscriber from "../../../models/Subscriber";

// Retorna a contagem de inscritos ativos (usado no painel admin)
export async function GET() {
  try {
    await dbConnect();
    const count = await Subscriber.countDocuments({ ativo: true });
    return NextResponse.json({ success: true, count });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}

// Inscreve um novo e-mail
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "E-mail inválido." },
        { status: 400 }
      );
    }

    const emailNormalizado = email.toLowerCase().trim();

    const existente = await Subscriber.findOne({ email: emailNormalizado });

    if (existente) {
      if (!existente.ativo) {
        existente.ativo = true;
        await existente.save();
      }
      return NextResponse.json({ success: true, message: "Inscrição confirmada!" });
    }

    await Subscriber.create({
      email: emailNormalizado,
      unsubscribeToken: crypto.randomUUID(),
      ativo: true,
    });

    return NextResponse.json({ success: true, message: "Inscrição realizada com sucesso!" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}
