// src/components/ui/WithdrawButton.tsx
"use client"
import { sawarabiGothic } from "@/lib/fonts"

interface WithdrawButtonProps {
    onDelete: () => void
}

export function WithdrawButton({ onDelete }: WithdrawButtonProps) {
    return (
        <button
            onClick={onDelete}
            className={`
        bg-red-500
        text-white
        text-md
        font-medium
        px-4 py-2
        rounded-xl
        border-2 border-[#000000]
        transition-all
        duration-200
        cursor-pointer
        ${sawarabiGothic.className}
      `}
            onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.7"
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1"
            }}
        >
            退会する
        </button>
    )
}