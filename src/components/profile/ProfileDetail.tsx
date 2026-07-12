// src/components/auth/ProfileDetail.tsx
"use client"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import Link from "next/link"

interface ProfileDetailProps {
    user: {
        id: string
        name: string
        email: string
        createdAt: Date
    }
}

export function ProfileDetail({ user }: ProfileDetailProps) {
    const router = useRouter()

    async function handleDelete() {
        const res = await fetch(`/api/users/${user.id}`, {
            method: "DELETE"
        })

        if (!res.ok) {
            alert("退会処理に失敗しました")
            return
        }

        // ログアウトしてログインページへ
        await signOut({ redirect: false })
        router.push("/login")
    }

    return (
        <div className="space-y-6">
            {/* プロフィール情報 */}
            <div className="border rounded-md p-4 space-y-4">
                <div>
                    <p className="text-sm text-gray-500">名前</p>
                    <p className="font-medium">{user.name}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">メールアドレス</p>
                    <p className="font-medium">{user.email}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">登録日</p>
                    <p className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString("ja-JP")}
                    </p>
                </div>
            </div>

            {/* 編集ボタン */}
            <Link
                href="/dashboard/profile/edit"
                className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md"
            >
                プロフィールを編集
            </Link>

            {/* 退会ボタン */}
            <button
                onClick={handleDelete}
                className="block w-full text-center bg-red-600 text-white px-4 py-2 rounded-md"
            >
                退会する
            </button>
        </div>
    )
}