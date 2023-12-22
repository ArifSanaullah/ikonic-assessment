import { NextResponse } from "next/server";
import Api from "./Api";

const protectedRoutes = ["/home"];

export function middleware(req) {
  let isAuthenticated = Api.loadAccessToken();

  if (!isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", req.url).toString());
  }
}
