// src/components/auth/EditProfileForm.tsx
"use client"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateProfileSchema } from "@/lib/validations"
import { z } from "zod"

type UpdateProfileData = z.infer<typeof updateProfileSchema>

interface EditProfileFormProps {
    user: {
        id: string
        name: string
    }
}

export function EditProfileForm({ user }: EditProfileFormProps) {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<UpdateProfileData>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: user.name  // 既存の名前を初期値にセット
        }
    })

    async function onSubmit(data: UpdateProfileData) {
        const res = await fetch(`/api/users/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })

        if (!res.ok) {
            alert("更新に失敗しました")
            return
        }

        router.push("/dashboard/profile")
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium">
                    名前
                </label>
                <input
                    {...register("name")}
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300"
                />
                {errors.name && (
                    <p className="text-red-600 text-sm">{errors.name.message}</p>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                    {isSubmitting ? "更新中..." : "更新する"}
                </button>
                <button
                    type="button"
                    onClick={() => router.push("/dashboard/profile")}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
                >
                    キャンセル
                </button>
            </div>
        </form>
    )
}