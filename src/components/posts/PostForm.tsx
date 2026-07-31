// components/posts/PostForm.tsx
"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { postSchema } from "@/lib/validations"

export interface PostFormData {
    title: string
    content: string
}

interface PostFormProps {
    initialData?: PostFormData
    onSubmit: (data: PostFormData) => Promise<void>
    isLoading?: boolean
}

export function PostForm({
    initialData,
    onSubmit,
    isLoading = false
}: PostFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<PostFormData>({
        resolver: zodResolver(postSchema),
        defaultValues: initialData
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="title" className="mt-8 block text-sm font-medium">
                    タイトル
                </label>
                <input
                    {...register("title")}
                    id="title"
                    type="text"
                    className="bg-white mt-1 mb-8 block w-full rounded-md border border-gray-300"
                />
                {errors.title && (
                    <p className="text-red-600 text-sm">{errors.title.message}</p>
                )}
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium">
                    本文
                </label>
                <textarea
                    {...register("content")}
                    id="content"
                    rows={5}
                    className="bg-white mt-1 block w-full rounded-md border border-gray-300"
                />
                {errors.content && (
                    <p className="text-red-600 text-sm">{errors.content.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="mt-8 px-6 py-2 rounded-2xl bg-white text-[#414245] border-2 border-[#1b3c97] font-medium cursor-pointer transition-all duration-200"
                onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)"
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none"
                }}
            >
                {isLoading ? "送信中..." : "投稿する"}
            </button>
        </form>
    )
}
