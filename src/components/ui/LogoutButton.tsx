// src/components/layout/LogoutButton.tsx
"use client"
import { signOut } from "next-auth/react"

export function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-white bg-red-500 px-3 py-1 rounded-md transition-all duration-200 cursor-pointer"
            onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.7"
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1"
            }}
        >
            ログアウト
        </button>
    )
}