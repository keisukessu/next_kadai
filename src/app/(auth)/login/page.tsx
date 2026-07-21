// src/app/(auth)/login/page.tsx
import { LoginForm } from "@/components/auth/LoginForm"
import Link from "next/link"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <LoginForm />
                <p className="mt-10 text-center text-sm text-gray-500 ">
                    アカウントをお持ちでない方は
                    <Link
                        href="/register"
                        className="text-blue-600 hover:underline ml-1"
                    >
                        新規登録
                    </Link>
                </p>
            </div>
        </div>
    )
}