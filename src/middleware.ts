import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Libera a própria página de login
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protege tudo que começa com /admin
  if (pathname.startsWith("/admin")) {
    const session = request.cookies.get("admin_session");

    if (!session || session.value !== process.env.ADMIN_PASSWORD) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};