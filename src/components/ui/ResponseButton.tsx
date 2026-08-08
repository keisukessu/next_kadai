// src/components/ui/ResponseButton.tsx
"use client"
import { sawarabiGothic } from "@/lib/fonts"

interface ResponseButtonProps {
    isSubmitting?: boolean
}

export function ResponseButton({ isSubmitting = false }: ResponseButtonProps) {
    return (
        <button
            type="submit"
            disabled={isSubmitting}
            className={`
        bg-white
        text-[#414245]
        text-sm
        font-medium
        px-4 py-2
        rounded-xl
        border-2 border-[#1b3c97]
        transition-all
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        cursor-pointer
        ${sawarabiGothic.className}
      `}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(0, 102, 255, 0.1)"
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white"
            }}
        >
            {isSubmitting ? "送信中..." : "レスする"}
        </button>
    )
}