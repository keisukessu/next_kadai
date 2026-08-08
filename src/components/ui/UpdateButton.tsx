// src/components/ui/UpdateButton.tsx
"use client"

interface UpdateButtonProps {
    isSubmitting?: boolean
    label?: string
    submittingLabel?: string
}

export function UpdateButton({
    isSubmitting = false,
    label = "保存する",
    submittingLabel = "保存中..."
}: UpdateButtonProps) {
    return (
        <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-2xl bg-white text-[#414245] border-2 border-[#1b3c97] font-medium cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(0, 102, 255, 0.1)"
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "white"
            }}
        >
            {isSubmitting ? submittingLabel : label}
        </button>
    )
}