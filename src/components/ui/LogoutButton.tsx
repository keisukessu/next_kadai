// src/components/layout/LogoutButton.tsx
"use client"
import { signOut } from "next-auth/react"

export function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-white bg-red-500 px-3 py-1 rounded-md hover:opacity-80 transition-opacity duration-200"
        >
            ログアウト
        </button>
    )
}