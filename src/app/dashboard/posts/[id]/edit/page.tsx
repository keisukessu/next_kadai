// src/app/dashboard/posts/[id]/edit/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { EditPostForm } from "@/components/posts/EditPostForm"

export default async function EditPostPage({
    params
}: {
    params: { id: string }
}) {
    // ① ログインチェック
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect("/login")
    }

    // ② DBから投稿を取得
    const post = await prisma.post.findUnique({
        where: {
            id: params.id,
            isDeleted: false
        }
    })

    // ③ 投稿が見つからない
    if (!post) {
        notFound()
    }

    // ④ 自分の投稿でなければ一覧へ
    if (post.authorId !== session.user.id) {
        redirect("/dashboard")
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">投稿を編集</h1>
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