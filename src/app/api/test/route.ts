import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";

export async function GET() {
  try {
    await dbConnect();

    return NextResponse.json({
      success: true,
      message: "Conectado ao MongoDB!"
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erro ao conectar.",
        error: error instanceof Error ? error.message : "Erro desconhecido"
      },
      {
        status: 500
      }
    );
  }
}