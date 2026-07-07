// src/app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { postSchema } from "@/lib/validations"
import { authOptions } from "@/lib/auth"

//投稿を１件取得
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        const post = await prisma.post.findUnique({
            where: {
                id,
                isDeleted: false,
                author: { isDeleted: false }
            },
            include: {
                author: {
                    select: { id: true, name: true }
                },
                responses: {
                    where: { isDeleted: false },
                    include: {
                        author: {
                            select: { id: true, name: true }
                        }
                    },
                    orderBy: { createdAt: "asc" }
                },
                _count: {
                    select: { responses: true }
                }
            }
        })

        if (!post) {
            return NextResponse.json(
                { error: "投稿が見つかりません" },
                { status: 404 }
            )
        }

        return NextResponse.json(post)

    } catch (error) {
        return NextResponse.json(
            { error: "投稿の取得に失敗しました" },
            { status: 500 }
        )
    }
}

//投稿を更新
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // ログインチェック
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "認証が必要です" },
                { status: 401 }
            )
        }

        const { id } = params

        // 投稿を取得
        const post = await prisma.post.findUnique({
            where: {
                id,
                isDeleted: false
            }
        })

        // 投稿が見つからない場合
        if (!post) {
            return NextResponse.json(
                { error: "投稿が見つかりません" },
                { status: 404 }
            )
        }

        // 自分の投稿かチェック
        if (post.authorId !== session.user.id) {
            return NextResponse.json(
                { error: "この投稿を編集する権限がありません" },
                { status: 403 }
            )
        }

        // バリデーション
        const body = await request.json()
        const validatedData = postSchema.safeParse(body)
        if (!validatedData.success) {
            return NextResponse.json(
                { error: validatedData.error.issues },
                { status: 400 }
            )
        }

        // 更新
        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                title: validatedData.data.title,
                content: validatedData.data.content
            },
            include: {
                author: {
                    select: { id: true, name: true }
                }
            }
        })

        return NextResponse.json(updatedPost)

    } catch (error) {
        return NextResponse.json(
            { error: "投稿の更新に失敗しました" },
            { status: 500 }
        )
    }
}


//投稿を削除（論理削除）
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // ログインチェック
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "認証が必要です" },
                { status: 401 }
            )
        }

        const { id } = params

        // 投稿を取得
        const post = await prisma.post.findUnique({
            where: {
                id,
                isDeleted: false
            }
        })

        // 投稿が見つからない場合
        if (!post) {
            return NextResponse.json(
                { error: "投稿が見つかりません" },
                { status: 404 }
            )
        }

        // 自分の投稿かチェック
        if (post.authorId !== session.user.id) {
            return NextResponse.json(
                { error: "この投稿を削除する権限がありません" },
                { status: 403 }
            )
        }

        // 論理削除（isDeleted を true に更新）
        await prisma.post.update({
            where: { id },
            data: { isDeleted: true }
        })

        return new NextResponse(null, { status: 204 })

    } catch (error) {
        return NextResponse.json(
            { error: "投稿の削除に失敗しました" },
            { status: 500 }
        )
    }
}