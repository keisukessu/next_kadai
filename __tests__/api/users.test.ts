// __tests__/api/users.test.ts
import { NextRequest } from "next/server"
import { POST } from "@/app/api/users/register/route"
import { prisma } from "@/lib/db"

jest.mock("@/lib/db", () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn()
        }
    }
}))

jest.mock("bcryptjs")
import bcrypt from "bcryptjs"

describe("/api/users/register", () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("POST", () => {
        it("正常にユーザーを登録できる", async () => {
            const mockUser = {
                id: "user123",
                name: "テストユーザー",
                email: "test@example.com",
                password: "hashedPassword"
            }

                ; (prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
                ; (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword")
                ; (prisma.user.create as jest.Mock).mockResolvedValue(mockUser)

            const request = new NextRequest(
                "http://localhost:3000/api/users/register",
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: "テストユーザー",
                        email: "test@example.com",
                        password: "Password123",
                        confirmPassword: "Password123"
                    }),
                    headers: { "Content-Type": "application/json" }
                }
            )

            const response = await POST(request)
            const data = await response.json()

            expect(response.status).toBe(201)
            expect(data.name).toBe("テストユーザー")
            expect(data.email).toBe("test@example.com")
        })

        it("メールアドレスが重複している場合は400を返す", async () => {
            // 既存ユーザーが見つかる
            ; (prisma.user.findUnique as jest.Mock).mockResolvedValue({
                id: "existing-user",
                email: "test@example.com"
            })

            const request = new NextRequest(
                "http://localhost:3000/api/users/register",
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: "テストユーザー",
                        email: "test@example.com",
                        password: "Password123",
                        confirmPassword: "Password123"
                    }),
                    headers: { "Content-Type": "application/json" }
                }
            )

            const response = await POST(request)
            const data = await response.json()

            expect(response.status).toBe(400)
            expect(data.error).toBe("このメールアドレスは既に登録されています")
        })

        it("バリデーションエラーの場合は400を返す", async () => {
            const request = new NextRequest(
                "http://localhost:3000/api/users/register",
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: "",           // 空の名前
                        email: "invalid",   // 不正なメール
                        password: "123",    // 短すぎるパスワード
                        confirmPassword: "123"
                    }),
                    headers: { "Content-Type": "application/json" }
                }
            )

            const response = await POST(request)

            expect(response.status).toBe(400)
        })

        it("パスワードが一致しない場合は400を返す", async () => {
            const request = new NextRequest(
                "http://localhost:3000/api/users/register",
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: "テストユーザー",
                        email: "test@example.com",
                        password: "Password123",
                        confirmPassword: "Password456"  // 不一致
                    }),
                    headers: { "Content-Type": "application/json" }
                }
            )

            const response = await POST(request)

            expect(response.status).toBe(400)
        })
    })
})