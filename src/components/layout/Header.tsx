// src/components/layout/Header.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Navigation } from "./Navigation"

export async function Header() {
    const session = await getServerSession(authOptions)

    return (
        <header className="bg-[#fafafa] shadow-sm sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">

                {/* 左側：ユーザー名 */}
                <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-gray-800">{session?.user?.name}</span>
                    <span className="text-xs text-gray-500">さん</span>
                </div>

                {/* 右側：ナビゲーション */}
                <Navigation />

            </div>
        </header>
    )
}