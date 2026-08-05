// __tests__/integration/responses.test.ts
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

let testUserId: string
let testPostId: string
let testResponseId: string

beforeAll(async () => {
    const hashedPassword = await bcrypt.hash("Password123", 10)

    const user = await prisma.user.create({
        data: {
            name: "レステストユーザー",
            email: "response-test@example.com",
            password: hashedPassword
        }
    })
    testUserId = user.id

    const post = await prisma.post.create({
        data: {
            title: "レステスト投稿",
            content: "レステスト内容",
            authorId: testUserId
        }
    })
    testPostId = post.id
})

afterAll(async () => {
    await prisma.response.deleteMany({
        where: { postId: testPostId }
    })
    await prisma.post.deleteMany({
        where: { authorId: testUserId }
    })
    await prisma.user.deleteMany({
        where: { email: "response-test@example.com" }
    })
    await prisma.$disconnect()
})

describe("レス機能", () => {

    describe("作成", () => {
        it("レスを正常に作成できる", async () => {
            const response = await prisma.response.create({
                data: {
                    content: "テストレス",
                    postId: testPostId,
                    authorId: testUserId
                }
            })

            testResponseId = response.id

            expect(response.content).toBe("テストレス")
            expect(response.postId).toBe(testPostId)
            expect(response.authorId).toBe(testUserId)
            expect(response.isDeleted).toBe(false)
        })
    })

    describe("取得", () => {
        it("投稿に紐づくレスを取得できる", async () => {
            const responses = await prisma.response.findMany({
                where: {
                    postId: testPostId,
                    isDeleted: false
                }
            })

            expect(responses.length).toBeGreaterThan(0)
            expect(responses[0].postId).toBe(testPostId)
        })

        it("削除済みのレスは取得されない", async () => {
            // 論理削除
            await prisma.response.update({
                where: { id: testResponseId },
                data: { isDeleted: true }
            })

            const responses = await prisma.response.findMany({
                where: {
                    postId: testPostId,
                    isDeleted: false
                }
            })

            const deletedResponse = responses.find(r => r.id === testResponseId)
            expect(deletedResponse).toBeUndefined()

            // 元に戻す
            await prisma.response.update({
                where: { id: testResponseId },
                data: { isDeleted: false }
            })
        })
    })

    describe("削除", () => {
        it("レスを論理削除できる", async () => {
            await prisma.response.update({
                where: { id: testResponseId },
                data: { isDeleted: true }
            })

            const response = await prisma.response.findUnique({
                where: {
                    id: testResponseId,
                    isDeleted: false
                }
            })

            expect(response).toBeNull()
        })
    })

    describe("親投稿削除時の子レスの処理", () => {
        it("親投稿を論理削除してもレスはDBに残る", async () => {
            // 親投稿を論理削除
            await prisma.post.update({
                where: { id: testPostId },
                data: { isDeleted: true }
            })

            // レスはDBに残っている
            const response = await prisma.response.findUnique({
                where: { id: testResponseId }
            })

            expect(response).not.toBeNull()

            // 元に戻す
            await prisma.post.update({
                where: { id: testPostId },
                data: { isDeleted: false }
            })
        })

        it("親投稿が削除済みの場合レスは表示されない", async () => {
            // 親投稿を論理削除
            await prisma.post.update({
                where: { id: testPostId },
                data: { isDeleted: true }
            })

            // 削除されていない投稿のレスのみ取得
            const posts = await prisma.post.findMany({
                where: { isDeleted: false },
                include: {
                    responses: {
                        where: { isDeleted: false }
                    }
                }
            })

            const post = posts.find(p => p.id === testPostId)
            expect(post).toBeUndefined()

            // 元に戻す
            await prisma.post.update({
                where: { id: testPostId },
                data: { isDeleted: false }
            })
        })
    })
})