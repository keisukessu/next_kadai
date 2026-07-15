// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { PostList } from "@/components/posts/PostList"
import Link from "next/link"

export default async function DashboardPage({
    searchParams
}: {
    searchParams: { page?: string }
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const page = parseInt(searchParams.page || "1")
    const limit = 10
    const skip = (page - 1) * limit

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where: {
                isDeleted: false,
                author: { isDeleted: false }
            },
            include: {
                author: { select: { id: true, name: true } },
                _count: { select: { responses: { where: { isDeleted: false } } } }
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit
        }),
        prisma.post.count({
            where: {
                isDeleted: false,
                author: { isDeleted: false }
            }
        })
    ])

    const totalPages = Math.ceil(total / limit)

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">投稿一覧</h1>
                <Link
                    href="/dashboard/posts/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                    新規投稿
                </Link>
            </div>

            <PostList
                posts={posts}
                currentPage={page}
                totalPages={totalPages}
                currentUserId={session.user.id}
            />
        </div>
    )
}