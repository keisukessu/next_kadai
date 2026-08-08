// src/components/layout/Navigation.tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
    const pathname = usePathname()

    const links = [
        { href: "/dashboard", label: "投稿一覧" },
        { href: "/dashboard/posts/create", label: "新規投稿" },
        { href: "/dashboard/profile", label: "プロフィール" },
    ]

    return (
        <nav className="flex items-center gap-6">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors
            ${pathname === link.href
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600"
                        }`}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#2563eb"
                    }}
                    onMouseLeave={(e) => {
                        if (pathname !== link.href) {
                            e.currentTarget.style.color = "#4b5563"
                        }
                    }}
                >
                    {link.label}
                </Link>
            ))}
        </nav>
    )
}