// src/components/posts/CreatePostForm.tsx
"use client"
import { useRouter } from "next/navigation"
import { PostForm, PostFormData } from "./PostForm"

export function CreatePostForm() {
    const router = useRouter()

    async function handleSubmit(data: PostFormData) {
        const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })

        if (!res.ok) {
            alert("投稿に失敗しました")
            return
        }

        const post = await res.json()
        router.push(`/dashboard/posts/${post.id}`)
    }

    return <PostForm onSubmit={handleSubmit} />
}