// src/app/api/posts/[id]/responses/[responseId]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

// DELETE（レス削除）
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; responseId: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "認証が必要です" },
            { status: 401 }
        )
    }

    try {
        const { id, responseId } = await params

        const response = await prisma.response.findUnique({
            where: {
                id: responseId,
                postId: id,
                isDeleted: false
            }
        })

        if (!response) {
            return NextResponse.json(
                { error: "レスが見つかりません" },
                { status: 404 }
            )
        }

        // 自分のレスだけ削除できる
        if (response.authorId !== session.user.id) {
            return NextResponse.json(
                { error: "このレスを削除する権限がありません" },
                { status: 403 }
            )
        }

        await prisma.response.update({
            where: { id: responseId },
            data: { isDeleted: true }
        })

        return new NextResponse(null, { status: 204 })

    } catch (error) {
        return NextResponse.json(
            { error: "レスの削除に失敗しました" },
            { status: 500 }
        )
    }
}