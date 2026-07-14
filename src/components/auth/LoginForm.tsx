// src/components/auth/LoginForm.tsx
"use client"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/lib/validations"
import { useRouter } from "next/navigation"
import { z } from "zod"

type LoginFormData = z.infer<typeof loginSchema>


export function LoginForm() {
    const router = useRouter()
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema)
    })

    async function onSubmit(data: LoginFormData) {
        const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,  // 自分でリダイレクトを制御する
        })

        if (result?.error) {
            // ログイン失敗
            alert("メールアドレスまたはパスワードが違います")
            return
        }

        // ログイン成功 → トップページへ
        router.push("/dashboard")
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("email")} type="email" placeholder="Email" />
            {errors.email && <p>{errors.email.message}</p>}

            <input {...register("password")} type="password" placeholder="Password" />
            {errors.password && <p>{errors.password.message}</p>}

            <button type="submit">ログイン</button>
        </form>
    )
}