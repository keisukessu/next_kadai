// src/middleware.ts
import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/api/")) {

        if (request.nextUrl.pathname.startsWith("/api/auth")) {
            return NextResponse.next()
        }

        if (request.method !== "GET") {
            const origin = request.headers.get("origin")
            const allowedOrigin = process.env.NEXTAUTH_URL

            if (!origin || origin !== allowedOrigin) {
                return NextResponse.json(
                    { error: "不正なリクエストです" },
                    { status: 403 }
                )
            }
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: "/api/:path*"
}