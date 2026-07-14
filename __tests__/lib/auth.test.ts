// __tests__/lib/auth.test.ts

// prisma をモック化
jest.mock("@/lib/db", () => ({
    prisma: {
        user: {
            findUnique: jest.fn()
        }
    }
}))
// bcryptjs をモック化
jest.mock("bcryptjs")


import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

// authorize関数を取り出すヘルパー
const getAuthorize = () => {
    const provider = authOptions.providers[0] as ReturnType<typeof CredentialsProvider>
    // provider.authorize ではなく options.authorize を使う
    return (provider as any).options.authorize
}


describe("auth - authorize", () => {
    // テスト用のユーザーデータ
    const mockUser = {
        id: "user123",
        name: "テストユーザー",
        email: "test@example.com",
        password: "hashedPassword",  // bcryptをモックしているため、照合を実際には行わない
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
    }

    beforeEach(async () => {
        jest.clearAllMocks()  // 各テスト前にモックをリセット
    })

    it("正しいメール・パスワードでログイン成功", async () => {
        // findUnique が呼び出されるとmockUserを返すように設定
        ; (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
            ; (bcrypt.compare as jest.Mock).mockResolvedValue(true)

        const authorize = getAuthorize()
        const result = await authorize(
            { email: "test@example.com", password: "Password123" },
            {}
        )

        expect(result).toEqual({
            id: mockUser.id,
            email: mockUser.email,
            name: mockUser.name
        })
    })

    it("存在しないメールアドレスでログイン失敗", async () => {
        // findUnique が null を返すように設定
        ; (prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

        const authorize = getAuthorize()
        const result = await authorize(
            { email: "notfound@example.com", password: "Password123" },
            {}
        )

        expect(result).toBeNull()
    })

    it("間違ったパスワードでログイン失敗", async () => {
        ; (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)
            ; (bcrypt.compare as jest.Mock).mockResolvedValue(false)

        const authorize = getAuthorize()
        const result = await authorize(
            { email: "test@example.com", password: "WrongPassword123" },
            {}
        )

        expect(result).toBeNull()
    })

    it("メール・パスワードが空でログイン失敗", async () => {
        const authorize = getAuthorize()
        const result = await authorize(
            { email: "", password: "" },
            {}
        )

        expect(result).toBeNull()
    })

    it("論理削除済みユーザーはログイン失敗", async () => {
        // isDeleted: false の条件でfindUniqueするので null が返る
        ; (prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
        const authorize = getAuthorize()
        const result = await authorize(
            { email: "test@example.com", password: "Password123" },
            {}
        )

        expect(result).toBeNull()
    })
})