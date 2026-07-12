// src/app/dashboard/profile/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { ProfileDetail } from "@/components/profile/ProfileDetail"

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
            isDeleted: false
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
        }
    })

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">プロフィール</h1>
            <ProfileDetail user={user} />
        </div>
    )
}