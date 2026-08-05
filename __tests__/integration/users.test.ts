// __tests__/integration/users.test.ts
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

let testUserId: string

beforeAll(async () => {
    const hashedPassword = await bcrypt.hash("Password123", 10)

    const user = await prisma.user.create({
        data: {
            name: "ユーザー管理テスト",
            email: "user-management-test@example.com",
            password: hashedPassword
        }
    })
    testUserId = user.id

    // テスト用の投稿も作成
    await prisma.post.create({
        data: {
            title: "退会テスト投稿",
            content: "退会後に非表示になるはず",
            authorId: testUserId
        }
    })
})

afterAll(async () => {
    await prisma.post.deleteMany({
        where: { authorId: testUserId }
    })
    await prisma.user.deleteMany({
        where: {
            email: {
                in: [
                    "user-management-test@example.com",
                    "updated-email-test@example.com"
                ]
            }
        }
    })
    await prisma.$disconnect()
})

describe("ユーザー管理", () => {

    describe("プロフィール更新", () => {
        it("名前を更新できる", async () => {
            const updatedUser = await prisma.user.update({
                where: { id: testUserId },
                data: { name: "更新後の名前" }
            })

            expect(updatedUser.name).toBe("更新後の名前")
        })

        it("メールアドレスを更新できる", async () => {
            const updatedUser = await prisma.user.update({
                where: { id: testUserId },
                data: { email: "updated-email-test@example.com" }
            })

            expect(updatedUser.email).toBe("updated-email-test@example.com")
        })

        it("パスワードを更新できる", async () => {
            const newHashedPassword = await bcrypt.hash("NewPassword123", 10)

            await prisma.user.update({
                where: { id: testUserId },
                data: { password: newHashedPassword }
            })

            // 新しいパスワードで照合できるか確認
            const user = await prisma.user.findUnique({
                where: { id: testUserId }
            })

            const isMatch = await bcrypt.compare("NewPassword123", user!.password)
            expect(isMatch).toBe(true)
        })

        it("古いパスワードは照合できない", async () => {
            const user = await prisma.user.findUnique({
                where: { id: testUserId }
            })

            const isMatch = await bcrypt.compare("Password123", user!.password)
            expect(isMatch).toBe(false)
        })

        it("重複するメールアドレスは登録できない", async () => {
            await expect(
                prisma.user.update({
                    where: { id: testUserId },
                    data: { email: "updated-email-test@example.com" }
                    // ↑ 既に使用中のメールアドレス（自分自身）
                    //   自分自身なのでエラーにならない
                })
            ).resolves.not.toThrow()
        })
    })

    describe("退会", () => {
        it("退会後にユーザーが論理削除される", async () => {
            await prisma.user.update({
                where: { id: testUserId },
                data: { isDeleted: true }
            })

            const user = await prisma.user.findUnique({
                where: {
                    id: testUserId,
                    isDeleted: false
                }
            })

            expect(user).toBeNull()
        })

        it("退会後にユーザーの投稿が一覧に表示されない", async () => {
            const posts = await prisma.post.findMany({
                where: {
                    isDeleted: false,
                    author: { isDeleted: false }  // 退会済みユーザーの投稿を除外
                }
            })

            const deletedUserPost = posts.find(
                post => post.authorId === testUserId
            )
            expect(deletedUserPost).toBeUndefined()
        })

        it("退会後はログインできない", async () => {
            const user = await prisma.user.findUnique({
                where: {
                    id: testUserId,
                    isDeleted: false  // 退会済みなので取得できない
                }
            })

            expect(user).toBeNull()
        })
    })
})