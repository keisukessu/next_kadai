// src/components/ui/NewPostButton.tsx
"use client"
import Link from "next/link"
import { sawarabiGothic } from "@/lib/fonts"

export function NewPostButton() {
    return (
        <Link
            href="/dashboard/posts/create"
            className={`
        bg-white
        text-[#414245]
        text-lg
        px-4 py-2
        rounded-xl
        border-2 border-[#1b3c97]
        transition-all
        duration-200
        ${sawarabiGothic.className}
      `}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(0, 102, 255, 0.1)"
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white"
            }}
        >
            ＋ 新規投稿
        </Link>
    )
}