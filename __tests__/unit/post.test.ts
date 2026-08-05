// __tests__/unit/post.test.ts
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

let testUserId: string
let deletedUserId: string
let testPostId: string

beforeAll(async () => {
    const hashedPassword = await bcrypt.hash("Password123", 10)

    // テスト用ユーザー
    const user = await prisma.user.create({
        data: {
            name: "投稿テストユーザー",
            email: "post-unit-test@example.com",
            password: hashedPassword
        }
    })
    testUserId = user.id

    // 論理削除済みユーザー
    const deletedUser = await prisma.user.create({
        data: {
            name: "削除済みユーザー",
            email: "deleted-unit-test@example.com",
            password: hashedPassword,
            isDeleted: true
        }
    })
    deletedUserId = deletedUser.id
})

afterAll(async () => {
    await prisma.post.deleteMany({
        where: {
            authorId: { in: [testUserId, deletedUserId] }
        }
    })
    await prisma.user.deleteMany({
        where: {
            email: {
                in: [
                    "post-unit-test@example.com",
                    "deleted-unit-test@example.com"
                ]
            }
        }
    })
    await prisma.$disconnect()
})

describe("Postモデル", () => {

    describe("保存", () => {
        it("投稿を正常に保存できる", async () => {
            const post = await prisma.post.create({
                data: {
                    title: "テスト投稿",
                    content: "テスト内容",
                    authorId: testUserId
                }
            })

            testPostId = post.id

            expect(post.title).toBe("テスト投稿")
            expect(post.content).toBe("テスト内容")
            expect(post.authorId).toBe(testUserId)
            expect(post.isDeleted).toBe(false)
        })
    })

    describe("更新", () => {
        it("投稿を正常に更新できる", async () => {
            const updatedPost = await prisma.post.update({
                where: { id: testPostId },
                data: {
                    title: "更新後のタイトル",
                    content: "更新後の内容"
                }
            })

            expect(updatedPost.title).toBe("更新後のタイトル")
            expect(updatedPost.content).toBe("更新後の内容")
        })
    })

    describe("削除", () => {
        it("投稿を論理削除できる", async () => {
            await prisma.post.update({
                where: { id: testPostId },
                data: { isDeleted: true }
            })

            const post = await prisma.post.findUnique({
                where: {
                    id: testPostId,
                    isDeleted: false
                }
            })

            expect(post).toBeNull()
        })
    })

    describe("論理削除されたユーザーの投稿", () => {
        it("論理削除されたユーザーの投稿は一覧に表示されない", async () => {
            // 論理削除済みユーザーの投稿を作成
            await prisma.post.create({
                data: {
                    title: "削除済みユーザーの投稿",
                    content: "表示されないはず",
                    authorId: deletedUserId
                }
            })

            // 一覧取得（削除済みユーザーの投稿は除外）
            const posts = await prisma.post.findMany({
                where: {
                    isDeleted: false,
                    author: { isDeleted: false }  // ← 削除済みユーザーを除外
                }
            })

            // 削除済みユーザーの投稿が含まれていないか確認
            const deletedUserPost = posts.find(
                post => post.authorId === deletedUserId
            )
            expect(deletedUserPost).toBeUndefined()
        })
    })
})