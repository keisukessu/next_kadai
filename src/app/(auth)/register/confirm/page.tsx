// src/app/(auth)/register/confirm/page.tsx
"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function RegisterConfirmPage() {
    const router = useRouter()

    useEffect(() => {
        async function autoLogin() {
            // sessionStorage から取得
            const email = sessionStorage.getItem("registerEmail")
            const password = sessionStorage.getItem("registerPassword")

            if (!email || !password) {
                // データがない場合はログインページへ
                router.push("/login")
                return
            }

            // 自動ログイン
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                router.push("/login")
                return
            }

            // 使用後すぐに削除（セキュリティのため）
            sessionStorage.removeItem("registerEmail")
            sessionStorage.removeItem("registerPassword")

            // 3秒後に dashboard へ遷移
            setTimeout(() => {
                router.push("/dashboard")
            }, 3000)
        }

        autoLogin()
    }, [])

    return (
        <div className="max-w-md mx-auto mt-10 text-center">
            <h1 className="text-2xl font-bold mb-4">登録完了</h1>
            <p className="mb-6">
                アカウントの登録が完了しました。
                <br />
                まもなく自動でページが切り替わります...
            </p>
            {/* ローディングアニメーション */}
            <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        </div>
    )
}