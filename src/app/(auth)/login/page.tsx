// src/app/(auth)/login/page.tsx
import { LoginForm } from "@/components/auth/LoginForm"
import Link from "next/link"

export default function LoginPage() {
    return (
        <div className="max-w-md mx-auto mt-10 p-4">
            <h1 className="text-2xl font-bold mb-6">ログイン</h1>
            <LoginForm />
            <p className="mt-4 text-center text-sm text-gray-500">
                アカウントをお持ちでない方は
                <Link
                    href="/register"
                    className="text-blue-600 hover:underline ml-1"
                >
                    会員登録
                </Link>
            </p>
        </div>
    )
}