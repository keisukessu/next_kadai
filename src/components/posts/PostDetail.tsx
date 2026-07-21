// src/components/posts/PostDetail.tsx
"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { ResponseList } from "../responses/ResponseList"
import { ResponseForm } from "../responses/ResponseForm"

interface Response {
    id: string
    content: string
    createdAt: Date
    author: {
        id: string
        name: string
    }
}

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
        responses: Response[]
    }
    currentUserId?: string
}

export function PostDetail({ post, currentUserId }: PostDetailProps) {
    const router = useRouter()

    // レス一覧をstateで管理
    const [responses, setResponses] = useState(post.responses)

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

    // レス投稿成功後にレス一覧を再取得
    async function handleResponseSuccess() {
        const res = await fetch(`/api/posts/${post.id}/responses`)
        const data = await res.json()
        setResponses(data)
    }

    // レス削除後にレス一覧を再取得
    async function handleResponseDelete() {
        const res = await fetch(`/api/posts/${post.id}/responses`)
        const data = await res.json()
        setResponses(data)
    }

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* 戻るボタン */}
            <Link
                href="/dashboard"
                className="text-blue-600 hover:underline text-sm"
            >
                ← 投稿一覧に戻る
            </Link>
            {/* タイトル */}
            <h1 className="text-2xl font-bold">{post.title}</h1>

            {/* 投稿者・投稿日時 */}
            <div className="text-sm text-gray-500">
                <span>{post.author.name}</span>
                <span className="mx-2">·</span>
                <span>{new Date(post.createdAt).toLocaleDateString("ja-JP")}</span>
            </div>

            {/* 本文 */}
            <p className="whitespace-pre-wrap">{post.content}</p>

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

            {/* レス一覧 */}
            <div>
                <h2 className="text-lg font-bold mb-4">
                    レス（{responses.length}件）
                </h2>
                <ResponseList
                    responses={responses}
                    currentUserId={currentUserId}
                    postId={post.id}
                    onDelete={handleResponseDelete}
                />
            </div>

            {/* レスフォーム（ログイン済みのみ） */}
            {currentUserId && (
                <div>
                    <h2 className="text-lg font-bold mb-2">レスする</h2>
                    <ResponseForm
                        postId={post.id}
                        onSuccess={handleResponseSuccess}
                    />
                </div>
            )}
        </div>
    )
}