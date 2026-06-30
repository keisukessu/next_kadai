// src/app/(auth)/register/confirm/page.tsx
import Link from "next/link"

export default function RegisterConfirmPage() {
    return (
        <div className="max-w-md mx-auto mt-10 text-center">
            <h1 className="text-2xl font-bold mb-4">登録完了</h1>
            <p className="mb-6">
                アカウントの登録が完了しました。
                <br />
                ログインしてご利用ください。
            </p>
            <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
                ログインページへ
            </Link>
        </div>
    )
}