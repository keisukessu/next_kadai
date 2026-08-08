// components/posts/PostForm.tsx
"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { postSchema } from "@/lib/validations"
import { PostButton } from "../ui/PostButoon"

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
                    className="bg-white p-1 mt-1 mb-8 block w-full rounded-md border border-gray-400"
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
                    className="bg-white p-1 mt-1 block w-full rounded-md border border-gray-400"
                />
                {errors.content && (
                    <p className="text-red-600 text-sm">{errors.content.message}</p>
                )}
            </div>

            <PostButton isLoading={isLoading} />
        </form>
    )
}
