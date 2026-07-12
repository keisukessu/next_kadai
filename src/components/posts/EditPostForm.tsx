// src/components/posts/EditPostForm.tsx
"use client"
import { useRouter } from "next/navigation"
import { PostForm, PostFormData } from "./PostForm"

interface EditPostFormProps {
    postId: string
    initialData: PostFormData
}

export function EditPostForm({ postId, initialData }: EditPostFormProps) {
    const router = useRouter()

    async function handleSubmit(data: PostFormData) {
        const res = await fetch(`/api/posts/${postId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })

        if (!res.ok) {
            alert("更新に失敗しました")
            return
        }

        router.push(`/dashboard/posts/${postId}`)
    }

    return (
        <PostForm
            initialData={initialData}
            onSubmit={handleSubmit}
        />
    )
}