// src/app/dashboard/posts/[id]/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { PostDetail } from "@/components/posts/PostDetail"
import { redirect } from "next/navigation"

export default async function PostDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect("/login")
    }

    const { id } = await params

    const post = await prisma.post.findUnique({
        where: {
            id,
            isDeleted: false,
            author: { isDeleted: false }
        },
        include: {
            author: {
                select: { id: true, name: true }
            },
            responses: {
                where: { isDeleted: false },
                include: {
                    author: { select: { id: true, name: true } }
                },
                orderBy: { createdAt: "asc" }
            },
            _count: {
                select: { responses: true }
            }
        }
    })

    if (!post) {
        notFound()  // 404ページを表示
    }

    return (
        <PostDetail
            post={post}
            currentUserId={session?.user?.id}
        />
    )
}