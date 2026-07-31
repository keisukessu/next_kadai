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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium">
                    名前
                </label>
                <input
                    {...register("name")}
                    id="name"
                    type="text"
                    className="bg-white mt-1 p-1 block w-full rounded-md border border-gray-400"
                />
                {errors.name && (
                    <p className="text-red-600 text-sm">{errors.name.message}</p>
                )}
            </div>

            <div className="flex gap-6">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-8 px-6 py-2 rounded-2xl bg-white text-[#414245] border-2 border-[#1b3c97] font-medium cursor-pointer hover:shadow-md transition-all duration-200"
                >
                    {isSubmitting ? "更新中..." : "更新する"}
                </button>
                <button
                    type="button"
                    onClick={() => router.push("/dashboard/profile")}
                    className="mt-8 px-6 py-2 rounded-2xl bg-white text-[#414245] border-2 border-[#535e6a] font-medium cursor-pointer hover:shadow-md transition-all duration-200"
                >
                    キャンセル
                </button>
            </div>
        </form>
    )
}