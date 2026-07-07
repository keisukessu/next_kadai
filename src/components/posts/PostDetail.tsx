// src/components/posts/PostDetail.tsx
"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface PostDetailProps {
    post: {
        id: string
        title: string
        content: string
        createdAt: Date
        author: {
            id: string
            name: string
        }
    }
    currentUserId?: string
}

export function PostDetail({ post, currentUserId }: PostDetailProps) {
    const router = useRouter()

    // 自分の投稿かどうか
    const isAuthor = currentUserId === post.author.id

    async function handleDelete() {
        const res = await fetch(`/api/posts/${post.id}`, {
            method: "DELETE"
        })

        if (!res.ok) {
            alert("削除に失敗しました")
            return
        }

        router.push("/dashboard")
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            {/* タイトル */}
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>

            {/* 投稿者・投稿日時 */}
            <div className="text-sm text-gray-500 mb-4">
                <span>{post.author.name}</span>
                <span className="mx-2">·</span>
                <span>{new Date(post.createdAt).toLocaleDateString("ja-JP")}</span>
            </div>

            {/* 本文 */}
            <p className="whitespace-pre-wrap mb-6">{post.content}</p>

            {/* 編集・削除ボタン（自分の投稿のみ） */}
            {isAuthor && (
                <div className="flex gap-2">
                    <Link
                        href={`/dashboard/posts/${post.id}/edit`}
                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
                    >
                        編集
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded-md"
                    >
                        削除
                    </button>
                </div>
            )}
        </div>
    )
}