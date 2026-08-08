"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import { ResponseList } from "@/components/responses/ResponseList"
import { ResponseForm } from "@/components/responses/ResponseForm"

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
    const [responses, setResponses] = useState(post.responses)
    const isAuthor = currentUserId === post.author.id

    // 投稿削除
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

    // レス投稿成功後
    async function handleResponseSuccess() {
        const res = await fetch(`/api/posts/${post.id}/responses`)
        const data = await res.json()
        setResponses(data)
    }

    // レス削除後
    async function handleResponseDelete() {
        const res = await fetch(`/api/posts/${post.id}/responses`)
        const data = await res.json()
        setResponses(data)
    }

    return (
        <div className="max-w-2xl mx-auto p-4">

            {/* 戻るボタン */}
            <Link href="/dashboard" className="text-blue-600 text-sm">
                ← 投稿一覧に戻る
            </Link>

            {/* カード全体 */}
            <div className="bg-white rounded-2xl shadow-md mt-4 p-6 space-y-4">

                {/* 投稿者・投稿日時 */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{post.author.name}</span>
                    <span>·</span>
                    <span>{new Date(post.createdAt).toLocaleDateString("ja-JP")}</span>
                </div>

                {/* タイトル */}
                <div className="border-l-4 border-blue-500 pl-3">
                    <h1 className="text-xl font-bold">{post.title}</h1>
                </div>

                {/* 本文 */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">本文</p>
                    <p className="text-sm">{post.content}</p>
                </div>

                {/* 編集・削除ボタン（自分の投稿のみ） */}
                {isAuthor && (
                    <div className="flex gap-2">
                        <Link
                            href={`/dashboard/posts/${post.id}/edit`}
                            className="flex items-center gap-1 border border-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                            編集
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-1 border border-red-400 text-red-500 px-4 py-2 rounded-md text-sm cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                            削除
                        </button>
                    </div>
                )}

                {/* レス一覧 */}
                <div>
                    <h2 className="flex items-center gap-2 text-lg font-bold mt-16">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                        </svg>
                        レス（{responses.length}件）
                    </h2>

                    {/* ResponseList コンポーネントを呼び出す */}
                    <ResponseList
                        responses={responses}
                        currentUserId={currentUserId}
                        postId={post.id}
                        onDelete={handleResponseDelete}
                    />
                </div>

                {/* レスフォーム */}
                {currentUserId && (
                    <ResponseForm
                        postId={post.id}
                        onSuccess={handleResponseSuccess}
                    />
                )}
            </div>
        </div>
    )
}