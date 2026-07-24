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
            <Link href={`/dashboard/posts/${post.id}`} className="flex items-center justify-between group">
                <h2 className={`text-[#393939] text-lg font-bold group-hover:underline pt-2 pb-2 pr-12 pl-2 ${notoSansJP.className}`}>{post.title}</h2>
                {/* > アイコン */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0">
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