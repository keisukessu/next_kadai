// __tests__/integration/auth.test.ts
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

// テスト後にデータを削除
afterAll(async () => {
    await prisma.user.deleteMany({
        where: {
            email: {
                in: [
                    "integration-test@example.com",
                    "logout-test@example.com"
                ]
            }
        }
    })
    await prisma.$disconnect()
})

describe("認証フロー", () => {
    const testUser = {
        name: "テストユーザー",
        email: "integration-test@example.com",
        password: "Password123"
    }

    describe("ユーザー登録", () => {
        it("正常にユーザーを登録できる", async () => {
            const hashedPassword = await bcrypt.hash(testUser.password, 10)

            const user = await prisma.user.create({
                data: {
                    name: testUser.name,
                    email: testUser.email,
                    password: hashedPassword
                }
            })

            expect(user.name).toBe(testUser.name)
            expect(user.email).toBe(testUser.email)
            expect(user.isDeleted).toBe(false)
            // パスワードはハッシュ化されている
            expect(user.password).not.toBe(testUser.password)
        })

        it("同じメールアドレスで登録できない", async () => {
            const hashedPassword = await bcrypt.hash(testUser.password, 10)

            await expect(
                prisma.user.create({
                    data: {
                        name: testUser.name,
                        email: testUser.email,  // 既に登録済み
                        password: hashedPassword
                    }
                })
            ).rejects.toThrow()  // エラーが発生するはず
        })
    })

    describe("ログイン（パスワード照合）", () => {
        it("正しいパスワードで照合できる", async () => {
            const user = await prisma.user.findUnique({
                where: { email: testUser.email }
            })

            const isMatch = await bcrypt.compare(testUser.password, user!.password)
            expect(isMatch).toBe(true)
        })

        it("間違ったパスワードは照合できない", async () => {
            const user = await prisma.user.findUnique({
                where: { email: testUser.email }
            })

            const isMatch = await bcrypt.compare("WrongPassword123", user!.password)
            expect(isMatch).toBe(false)
        })

        it("論理削除済みユーザーは取得できない", async () => {
            // 論理削除する
            await prisma.user.update({
                where: { email: testUser.email },
                data: { isDeleted: true }
            })

            const user = await prisma.user.findUnique({
                where: {
                    email: testUser.email,
                    isDeleted: false  // 削除済みは取得できない
                }
            })

            expect(user).toBeNull()

            // テスト後に戻す
            await prisma.user.update({
                where: { email: testUser.email },
                data: { isDeleted: false }
            })
        })
    })

    describe("ログアウト", () => {
        it("退会済みユーザーはログインできない", async () => {
            // 論理削除済みユーザーを作成
            const hashedPassword = await bcrypt.hash("Password123", 10)
            await prisma.user.create({
                data: {
                    name: "退会ユーザー",
                    email: "logout-test@example.com",
                    password: hashedPassword,
                    isDeleted: true  // 退会済み
                }
            })

            // ログインを試みる
            const user = await prisma.user.findUnique({
                where: {
                    email: "logout-test@example.com",
                    isDeleted: false  // 退会済みなので取得できない
                }
            })

            expect(user).toBeNull()
        })
    })
})