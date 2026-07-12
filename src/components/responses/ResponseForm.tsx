// src/components/posts/ResponseForm.tsx
"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { responseSchema } from "@/lib/validations"
import { z } from "zod"

type ResponseFormData = z.infer<typeof responseSchema>

interface ResponseFormProps {
    postId: string
    onSuccess: () => void  // 投稿成功後に呼ばれる
}

export function ResponseForm({ postId, onSuccess }: ResponseFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<ResponseFormData>({
        resolver: zodResolver(responseSchema)
    })

    async function onSubmit(data: ResponseFormData) {
        const res = await fetch(`/api/posts/${postId}/responses`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })

        if (!res.ok) {
            alert("レスの投稿に失敗しました")
            return
        }

        reset()      // フォームをリセット
        onSuccess()  // 親コンポーネントに成功を通知
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <textarea
                {...register("content")}
                rows={3}
                placeholder="レスを入力してください"
                className="mt-1 block w-full rounded-md border-gray-300"
            />
            {errors.content && (
                <p className="text-red-600 text-sm">{errors.content.message}</p>
            )}
            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
                {isSubmitting ? "送信中..." : "レスする"}
            </button>
        </form>
    )
}