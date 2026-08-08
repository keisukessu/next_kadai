// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { PostList } from "@/components/posts/PostList"
import Link from "next/link"
import { sawarabiGothic, notoSansJP } from "@/lib/fonts"
import Image from "next/image"
import { NewPostButton } from "@/components/ui/NewPostButton"

export default async function DashboardPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const { page: pageParam } = await searchParams
    const page = parseInt(pageParam || "1")
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
        <div className="max-w-4xl mx-auto p-4">

            <div className="flex justify-between items-center mb-12 mt-4">
                <Image
                    src="/images/book.png"
                    alt="book"
                    width={60}
                    height={60}
                    className="w-auto h-auto"
                />
                <h1
                    className={`text-[50px] text-stroke font-bold text-white ${notoSansJP.className}`}
                >投稿一覧</h1>
                <NewPostButton />
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