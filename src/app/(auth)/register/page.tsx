// src/app/register/page.tsx
"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "@/lib/validations"
import { useRouter } from "next/navigation"
import { z } from "zod"

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    })

    async function onSubmit(data: RegisterFormData) {
        const res = await fetch("/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })

        if (!res.ok) {
            alert("登録に失敗しました")
            return
        }

        // 登録成功 → 確認ページへ
        router.push("./confirm")
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("name")} placeholder="名前" />
            {errors.name && <p>{errors.name.message}</p>}

            <input {...register("email")} type="email" placeholder="Email" />
            {errors.email && <p>{errors.email.message}</p>}

            <input {...register("password")} type="password" placeholder="Password" />
            {errors.password && <p>{errors.password.message}</p>}

            <button type="submit">登録</button>
        </form>
    )
}