import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Subscriber from "../../../models/Subscriber";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return new NextResponse("Link inválido.", { status: 400 });
    }

    const subscriber = await Subscriber.findOne({ unsubscribeToken: token });

    if (!subscriber) {
      return new NextResponse("Inscrição não encontrada.", { status: 404 });
    }

    subscriber.ativo = false;
    await subscriber.save();

    return new NextResponse(
      `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><title>Inscrição cancelada</title></head>
<body style="font-family: Arial, sans-serif; text-align: center; padding: 60px 20px;">
  <h1>Inscrição cancelada</h1>
  <p>Você não receberá mais avisos da NasloN Market. Se mudar de ideia, é só se inscrever de novo no site.</p>
</body>
</html>`,
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch (error) {
    return new NextResponse("Erro ao processar.", { status: 500 });
  }
}
