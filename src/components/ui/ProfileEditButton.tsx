// src/components/ui/ProfileEditButton.tsx
"use client"
import Link from "next/link"
import { sawarabiGothic } from "@/lib/fonts"

export function ProfileEditButton() {
    return (
        <Link
            href="/dashboard/profile/edit"
            className={`
        bg-white
        text-[#414245]
        text-md
        font-medium
        px-4 py-2
        mr-8
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
            プロフィールを編集
        </Link>
    )
}