// src/components/ui/Pagination.tsx
"use client"
import { useRouter, useSearchParams } from "next/navigation"

interface PaginationProps {
    currentPage: number
    totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    function handlePageChange(page: number) {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", page.toString())
        router.push(`?${params.toString()}`)
    }

    // 表示するページ番号を計算
    function getPageNumbers(): (number | "...")[] {
        const pages: (number | "...")[] = []

        if (totalPages <= 7) {
            // 7ページ以下は全部表示
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
            return pages
        }

        // 最初のページ
        pages.push(1)

        // 現在ページが左側に近い場合
        if (currentPage <= 4) {
            pages.push(2, 3, 4, 5, "...", totalPages)
            return pages
        }

        // 現在ページが右側に近い場合
        if (currentPage >= totalPages - 3) {
            pages.push(
                "...",
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages
            )
            return pages
        }

        // 現在ページが中間の場合
        pages.push(
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages
        )
        return pages
    }

    const pageNumbers = getPageNumbers()

    return (
        <div className="flex items-center justify-center gap-1 mt-6">
            {/* 前へボタン */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
                前へ
            </button>

            {/* ページ番号 */}
            {pageNumbers.map((page, index) => (
                page === "..." ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-1">
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-md border
              ${currentPage === page
                                ? "bg-blue-600 text-white border-blue-600"
                                : "hover:bg-gray-100"
                            }`}
                    >
                        {page}
                    </button>
                )
            ))}

            {/* 次へボタン */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
                次へ
            </button>
        </div>
    )
}