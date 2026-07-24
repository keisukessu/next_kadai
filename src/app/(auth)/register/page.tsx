// src/app/(auth)/register/page.tsx
import { RegisterForm } from "@/components/auth/RegisterForm"
import Link from "next/link"

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
            <div className="w-full max-w-md ">
                <div className="flex justify-center">
                    <img
                        src="/icons/register-icon.svg"
                        alt="会員登録"
                        className="w-32 h-32 relative z-10 mb-[-3rem]"
                    />
                </div>

                <RegisterForm />

                <p className="mt-4 text-center text-sm text-gray-500">
                    すでにアカウントをお持ちの方は
                    <Link href="/login" className="text-blue-600 hover:underline ml-1">
                        ログイン
                    </Link>
                </p>
            </div>
        </div>
    )
}