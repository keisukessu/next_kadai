// src/components/auth/ProfileDetail.tsx
"use client"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { sawarabiGothic } from "@/lib/fonts"
import { ProfileEditButton } from "@/components/ui/ProfileEditButton"
import { WithdrawButton } from "../ui/WithdrawButton"

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
        <div className="space-y-10">
            {/* プロフィール情報 */}
            <div className="bg-[#ffffff] border-[2px] rounded-md p-6 space-y-4">
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

            {/* プロフィール編集ボタン */}
            <ProfileEditButton />

            {/* 退会ボタン */}
            <WithdrawButton onDelete={handleDelete} />
        </div>
    )
}