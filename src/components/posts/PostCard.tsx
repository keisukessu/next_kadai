// src/components/posts/PostCard.tsx
"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Post, User } from "@prisma/client"
import { PostWithAuthor } from "@/types"
import { sawarabiGothic, notoSansJP } from "@/lib/fonts"

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

    return (
        <div className="bg-white border border-gray-300 rounded-md p-4 shadow-md ">
            {/* 投稿者 */}
            <div className="text-sm flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <div className="text-[#393939]">
                    <span>{post.author.name}</span>
                </div>
            </div>

            {/* タイトル + > アイコン */}
            <Link
                href={`/dashboard/posts/${post.id}`}
                className="flex items-center justify-between"
                onMouseEnter={(e) => {
                    const h2 = e.currentTarget.querySelector("h2")
                    const svg = e.currentTarget.querySelector("svg")
                    if (h2) h2.style.textDecoration = "underline"
                    if (svg) svg.style.color = "#2563eb"
                }}
                onMouseLeave={(e) => {
                    const h2 = e.currentTarget.querySelector("h2")
                    const svg = e.currentTarget.querySelector("svg")
                    if (h2) h2.style.textDecoration = "none"
                    if (svg) svg.style.color = "#9ca3af"
                }}
            >
                <h2 className={`text-[#393939] text-lg font-bold pt-2 pb-2 pr-12 pl-2 ${notoSansJP.className}`}>
                    {post.title}
                </h2>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </Link>


            {/* 区切り線 */}
            <hr className="border-gray-200 " />

            {/* 投稿日時・返信数 */}
            <div className="flex items-center justify-end text-gray-500 text-sm gap-4 pt-2">
                {/* 投稿日時 */}
                <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                    </svg>
                    <span>{new Date(post.createdAt).toLocaleDateString("ja-JP")}</span>
                </div>

                {/* 返信数 */}
                <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                    <span>返信 {post._count.responses}件</span>
                </div>
            </div>

            {/* 編集・削除ボタン（自分の投稿のみ） */}
            {isAuthor && (
                <div className="flex gap-2">
                    <Link
                        href={`/dashboard/posts/${post.id}/edit`}
                        className="flex items-center gap-1 border border-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm hover:shadow-md transition-shadow duration-150"
                    >
                        {/* 編集アイコン */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        編集
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-1 border border-red-400 text-red-500 px-4 py-2 rounded-md text-sm hover:shadow-md cursor-pointer"
                    >
                        {/* 削除アイコン */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        削除
                    </button>
                </div>
            )}
        </div>
    )
}