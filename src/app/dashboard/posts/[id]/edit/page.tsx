// src/app/dashboard/posts/[id]/edit/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { EditPostForm } from "@/components/posts/EditPostForm"
import { notoSansJP } from "@/lib/fonts"

export default async function EditPostPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    // ログインチェック
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect("/login")
    }

    // DBから投稿を取得
    const { id } = await params
    const post = await prisma.post.findUnique({
        where: {
            id,
            isDeleted: false
        }
    })

    // 投稿が見つからない
    if (!post) {
        notFound()
    }

    // 自分の投稿でなければ一覧へ
    if (post.authorId !== session.user.id) {
        redirect("/dashboard")
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1
                className={`text-[35px] text-stroke font-bold tracking-[4.0px] text-white mt-8 mb-6 ${notoSansJP.className}`}
            >投稿を編集</h1>
            <EditPostForm
                postId={post.id}
                initialData={{
                    title: post.title,
                    content: post.content
                }}
            />
        </div>
    )
}