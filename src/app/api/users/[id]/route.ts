// src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { updateProfileSchema } from "@/lib/validations"
import bcrypt from "bcryptjs"

// GET（プロフィール取得）
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

    const { id } = await params

    // 自分の情報だけ取得できる
    if (id !== session.user.id) {
        return NextResponse.json(
            { error: "権限がありません" },
            { status: 403 }
        )
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id,
                isDeleted: false
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                // password は返さない
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: "ユーザーが見つかりません" },
                { status: 404 }
            )
        }

        return NextResponse.json(user)

    } catch (error) {
        return NextResponse.json(
            { error: "プロフィールの取得に失敗しました" },
            { status: 500 }
        )
    }
}

// PUT（プロフィール編集）
export async function PUT(
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

    const { id } = await params

    // 自分の情報だけ編集できる
    if (id !== session.user.id) {
        return NextResponse.json(
            { error: "権限がありません" },
            { status: 403 }
        )
    }

    try {
        const body = await request.json()
        const result = updateProfileSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues },
                { status: 400 }
            )
        }

        // メールアドレスの重複チェック
        const existing = await prisma.user.findFirst({
            where: {
                email: result.data.email,
                id: { not: id }  // 自分以外で同じメールがないか
            }
        })

        if (existing) {
            return NextResponse.json(
                { error: "このメールアドレスは既に使用されています" },
                { status: 400 }
            )
        }

        // 更新データを作成
        const updateData: {
            name: string
            email: string
            password?: string
        } = {
            name: result.data.name,
            email: result.data.email,
        }

        // パスワードが入力された場合のみハッシュ化して更新
        if (result.data.password) {
            updateData.password = await bcrypt.hash(result.data.password, 10)
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
            }
        })

        return NextResponse.json(user)

    } catch (error) {
        return NextResponse.json(
            { error: "プロフィールの更新に失敗しました" },
            { status: 500 }
        )
    }
}

// DELETE（退会）
export async function DELETE(
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

    const { id } = await params

    // 自分のアカウントだけ削除できる
    if (id !== session.user.id) {
        return NextResponse.json(
            { error: "権限がありません" },
            { status: 403 }
        )
    }

    try {
        await prisma.user.update({
            where: { id },
            data: { isDeleted: true, email: `deleted_${id}@deleted.com` }
        })

        return new NextResponse(null, { status: 204 })

    } catch (error) {
        return NextResponse.json(
            { error: "退会処理に失敗しました" },
            { status: 500 }
        )
    }
}