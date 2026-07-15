// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { postSchema } from "@/lib/validations"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: "認証が必要です" },
            { status: 401 }
        )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = 10
    const skip = (page - 1) * limit

    try {
        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: {
                    isDeleted: false,
                    author: {
                        isDeleted: false
                    }
                },
                include: {
                    author: {
                        select: { id: true, name: true }
                    },
                    _count: {
                        select: { responses: { where: { isDeleted: false } } }
                    }
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit
            }),
            prisma.post.count({
                where: {
                    isDeleted: false,
                    author: {
                        isDeleted: false
                    }
                }
            })
        ])

        return NextResponse.json({
            posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        return NextResponse.json(
            { error: "投稿の取得に失敗しました" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "認証が必要です" },
                { status: 401 }
            )
        }

        const body = await request.json()
        const validatedData = postSchema.parse(body)

        const post = await prisma.post.create({
            data: {
                ...validatedData,
                authorId: session.user.id
            },
            include: {
                author: {
                    select: { id: true, name: true }
                }
            }
        })

        return NextResponse.json(post, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "バリデーションエラー", issues: error.issues },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: "投稿の作成に失敗しました" },
            { status: 500 }
        )
    }
}
