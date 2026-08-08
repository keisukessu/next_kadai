// src/components/ui/PostButton.tsx
"use client"

interface PostButtonProps {
    isLoading?: boolean
}

export function PostButton({ isLoading = false }: PostButtonProps) {
    return (
        <button
            type="submit"
            disabled={isLoading}
            className="mt-8 px-6 py-2 rounded-2xl bg-white text-[#414245] border-2 border-[#1b3c97] font-medium cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(0, 102, 255, 0.1)"
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white"
            }}
        >
            {isLoading ? "送信中..." : "投稿する"}
        </button>
    )
}