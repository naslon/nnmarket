import { NextResponse } from "next/server";
import { Resend } from "resend";
import dbConnect from "../../../lib/mongodb";
import Subscriber from "../../../models/Subscriber";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Verifica se quem está chamando está logado no admin
    const cookieHeader = request.headers.get("cookie") || "";
    const autenticado = cookieHeader.split(";").some((c) => {
      const [nome, valor] = c.trim().split("=");
      return nome === "admin_session" && valor === process.env.ADMIN_PASSWORD;
    });

    if (!autenticado) {
      return NextResponse.json(
        { success: false, message: "Não autorizado." },
        { status: 401 }
      );
    }

    await dbConnect();

    const { subject, message } = await request.json();

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, message: "Assunto e mensagem são obrigatórios." },
        { status: 400 }
      );
    }

    const subscribers = await Subscriber.find({ ativo: true });

    if (subscribers.length === 0) {
      return NextResponse.json(
        { success: false, message: "Nenhum inscrito ativo encontrado." },
        { status: 400 }
      );
    }

    const siteUrl = process.env.SITE_URL || "https://www.nnmarket.shop";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "avisos@nnmarket.shop";

    const emails = subscribers.map((sub) => {
      const unsubscribeUrl = `${siteUrl}/api/unsubscribe?token=${sub.unsubscribeToken}`;
      return {
        from: `NasloN Market <${fromEmail}>`,
        to: sub.email,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #111;">${subject}</h2>
            <div style="color: #333; line-height: 1.6; white-space: pre-line;">${message}</div>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #999;">
              Você recebeu este e-mail porque se inscreveu na NasloN Market.
              <a href="${unsubscribeUrl}" style="color: #999;">Cancelar inscrição</a>
            </p>
          </div>
        `,
      };
    });

    // Envia em lotes de 100 (limite da API de lote do Resend)
    const tamanhoLote = 100;
    let enviados = 0;

    for (let i = 0; i < emails.length; i += tamanhoLote) {
      const lote = emails.slice(i, i + tamanhoLote);
      await resend.batch.send(lote);
      enviados += lote.length;
    }

    return NextResponse.json({
      success: true,
      message: `E-mail enviado para ${enviados} inscrito(s).`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    );
  }
}
