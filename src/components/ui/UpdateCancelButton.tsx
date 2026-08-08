// src/components/ui/UpdateCancelButton.tsx
"use client"
import { useRouter } from "next/navigation"

interface UpdateCancelButtonProps {
    href: string
    label?: string
}

export function UpdateCancelButton({
    href,
    label = "キャンセル"
}: UpdateCancelButtonProps) {
    const router = useRouter()

    return (
        <button
            type="button"
            onClick={() => router.push(href)}
            className="px-6 py-2 rounded-2xl bg-white text-[#414245] border-2 border-[#1b3c97] font-medium cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(0, 102, 255, 0.1)"
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white"
            }}
        >
            {label}
        </button>
    )
}