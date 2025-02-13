import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = request.cookies.get("auth-token")?.value;
  const { pathname } = request.nextUrl;

  if (
    !token &&
    (pathname.startsWith("/dashboard") ||
      pathname === "/trips" ||
      pathname === "/ticket-invoice" ||
      pathname === "/ticket-copy")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);

      if (pathname === "/login" || pathname === "/sign-up") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (error) {
      console.error("Token verification failed:", error);

      if (
        pathname.startsWith("/dashboard") ||
        pathname === "/trips" ||
        pathname === "/ticket-invoice" ||
        pathname === "/ticket-copy"
      ) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/sign-up",
    "/trips",
    "/ticket-copy",
    "/ticket-invoice",
  ],
};
