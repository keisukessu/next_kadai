// src/middleware.ts
import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
    // APIルートへのリクエストのみチェック
    if (request.nextUrl.pathname.startsWith("/api/")) {

        // GET以外のリクエストをチェック
        if (request.method !== "GET") {
            const origin = request.headers.get("origin")
            const allowedOrigin = process.env.NEXTAUTH_URL

            // originが存在しない または 許可されていないoriginの場合
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