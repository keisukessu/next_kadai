// src/components/layout/Header.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Navigation } from "./Navigation"

export async function Header() {
    const session = await getServerSession(authOptions)

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">

                {/* 左側：ユーザー名 */}
                <div className="text-sm font-medium text-gray-700">
                    {session?.user?.name} さん
                </div>

                {/* 右側：ナビゲーション */}
                <Navigation />

            </div>
        </header>
    )
}