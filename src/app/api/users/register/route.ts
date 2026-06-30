// src/app/api/users/register/route.ts
import { prisma } from "@/lib/db"
import { registerSchema } from "@/lib/validations"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
    const body = await request.json()

    // バリデーション
    const result = registerSchema.safeParse(body)
    if (!result.success) {
        return Response.json(
            { error: result.error.issues },
            { status: 400 }
        )
    }

    // メールアドレスの重複チェック
    const existing = await prisma.user.findUnique({
        where: { email: result.data.email }
    })
    if (existing) {
        return Response.json(
            { error: "このメールアドレスは既に登録されています" },
            { status: 400 }
        )
    }

    // パスワードをハッシュ化して保存
    const hashedPassword = await bcrypt.hash(result.data.password, 10)
    const user = await prisma.user.create({
        data: {
            name: result.data.name,
            email: result.data.email,
            password: hashedPassword,
        }
    })

    return Response.json(
        { id: user.id, name: user.name, email: user.email },
        { status: 201 }
    )
}