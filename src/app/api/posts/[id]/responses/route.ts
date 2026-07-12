// src/app/api/posts/[id]/responses/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { responseSchema } from "@/lib/validations"

// GET（レス一覧取得）
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "認証が必要です" },
            { status: 401 }
        )
    }

    try {
        const { id } = await params

        const responses = await prisma.response.findMany({
            where: {
                postId: id,
                isDeleted: false,
                author: { isDeleted: false }
            },
            include: {
                author: {
                    select: { id: true, name: true }
                }
            },
            orderBy: { createdAt: "asc" }
        })

        return NextResponse.json(responses)

    } catch (error) {
        return NextResponse.json(
            { error: "レスの取得に失敗しました" },
            { status: 500 }
        )
    }
}

// POST（レス作成）
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "認証が必要です" },
            { status: 401 }
        )
    }

    try {
        const { id } = await params

        // 投稿が存在するか確認
        const post = await prisma.post.findUnique({
            where: {
                id,
                isDeleted: false
            }
        })

        if (!post) {
            return NextResponse.json(
                { error: "投稿が見つかりません" },
                { status: 404 }
            )
        }

        const body = await request.json()
        const result = responseSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues },
                { status: 400 }
            )
        }

        const response = await prisma.response.create({
            data: {
                content: result.data.content,
                postId: id,
                authorId: session.user.id
            },
            include: {
                author: {
                    select: { id: true, name: true }
                }
            }
        })

        return NextResponse.json(response, { status: 201 })

    } catch (error) {
        return NextResponse.json(
            { error: "レスの作成に失敗しました" },
            { status: 500 }
        )
    }
}