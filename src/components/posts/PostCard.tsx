// src/components/posts/PostCard.tsx
"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Post, User } from "@prisma/client"
import { PostWithAuthor } from "@/types"

interface PostCardProps {
    post: PostWithAuthor
    currentUserId?: string
}

export function PostCard({ post, currentUserId }: PostCardProps) {
    const router = useRouter()

    const isAuthor = currentUserId === post.author.id

    async function handleDelete() {
        const res = await fetch(`/api/posts/${post.id}`, {
            method: "DELETE"
        })

        if (!res.ok) {
            alert("削除に失敗しました")
            return
        }

        router.refresh()  // 一覧を再取得して更新
    }
    console.log("post._count.responses:", post._count.responses)

    return (
        <div className="border rounded-md p-4">
            {/* タイトル */}
            <Link href={`/dashboard/posts/${post.id}`}>
                <h2 className="text-lg font-bold hover:underline">{post.title}</h2>
            </Link>

            {/* 投稿者・投稿日時・返信数 */}
            <div className="text-sm text-gray-500 mt-1 flex gap-2">
                <span>{post.author.name}</span>
                <span>·</span>
                <span>{new Date(post.createdAt).toLocaleDateString("ja-JP")}</span>
                <span>·</span>
                <span>返信 {post._count.responses}件</span>
            </div>

            {/* 編集・削除ボタン（自分の投稿のみ） */}
            {isAuthor && (
                <div className="flex gap-2 mt-3">
                    <Link
                        href={`/dashboard/posts/${post.id}/edit`}
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm"
                    >
                        編集
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                        削除
                    </button>
                </div>
            )}
        </div>
    )
}