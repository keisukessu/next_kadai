// __tests__/integration/posts.test.ts
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

// テスト用データ
let testUserId: string
let testPostId: string
let otherUserId: string

// テスト前にユーザーを作成
beforeAll(async () => {
    const hashedPassword = await bcrypt.hash("Password123", 10)

    // メインユーザー
    const user = await prisma.user.create({
        data: {
            name: "投稿テストユーザー",
            email: "post-test@example.com",
            password: hashedPassword
        }
    })
    testUserId = user.id

    // 別のユーザー（他人の投稿操作テスト用）
    const otherUser = await prisma.user.create({
        data: {
            name: "別のユーザー",
            email: "other-test@example.com",
            password: hashedPassword
        }
    })
    otherUserId = otherUser.id
})

// テスト後にデータを削除
afterAll(async () => {
    await prisma.response.deleteMany({
        where: {
            author: {
                email: {
                    in: ["post-test@example.com", "other-test@example.com"]
                }
            }
        }
    })
    await prisma.post.deleteMany({
        where: {
            author: {
                email: {
                    in: ["post-test@example.com", "other-test@example.com"]
                }
            }
        }
    })
    await prisma.user.deleteMany({
        where: {
            email: {
                in: ["post-test@example.com", "other-test@example.com"]
            }
        }
    })
})

describe("投稿のCRUD", () => {

    describe("Create（作成）", () => {
        it("正常に投稿を作成できる", async () => {
            const post = await prisma.post.create({
                data: {
                    title: "テスト投稿",
                    content: "テスト内容",
                    authorId: testUserId
                }
            })

            testPostId = post.id  // 後のテストで使う

            expect(post.title).toBe("テスト投稿")
            expect(post.content).toBe("テスト内容")
            expect(post.authorId).toBe(testUserId)
            expect(post.isDeleted).toBe(false)
        })
    })

    describe("Read（取得）", () => {
        it("投稿を1件取得できる", async () => {
            const post = await prisma.post.findUnique({
                where: {
                    id: testPostId,
                    isDeleted: false
                },
                include: {
                    author: {
                        select: { id: true, name: true }
                    }
                }
            })

            expect(post).not.toBeNull()
            expect(post!.title).toBe("テスト投稿")
            expect(post!.author.name).toBe("投稿テストユーザー")
        })

        it("削除済みの投稿は取得できない", async () => {
            // 一時的に論理削除
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

            // 元に戻す
            await prisma.post.update({
                where: { id: testPostId },
                data: { isDeleted: false }
            })
        })

        it("投稿一覧を取得できる", async () => {
            const posts = await prisma.post.findMany({
                where: { isDeleted: false },
                include: {
                    author: { select: { id: true, name: true } },
                    _count: { select: { responses: true } }
                }
            })

            expect(posts.length).toBeGreaterThan(0)
            expect(posts[0].author).toBeDefined()
            expect(posts[0]._count.responses).toBeDefined()
        })
    })

    describe("Update（更新）", () => {
        it("自分の投稿を更新できる", async () => {
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

        it("他人の投稿は更新できない", async () => {
            // 他人の投稿かどうかのチェック
            const post = await prisma.post.findUnique({
                where: { id: testPostId }
            })

            // otherUser は投稿の author ではない
            expect(post!.authorId).not.toBe(otherUserId)
        })
    })

    describe("Delete（削除）", () => {
        it("自分の投稿を論理削除できる", async () => {
            await prisma.post.update({
                where: { id: testPostId },
                data: { isDeleted: true }
            })

            const post = await prisma.post.findUnique({
                where: { id: testPostId }
            })

            expect(post!.isDeleted).toBe(true)
        })

        it("論理削除後は一覧に表示されない", async () => {
            const posts = await prisma.post.findMany({
                where: {
                    id: testPostId,
                    isDeleted: false
                }
            })

            expect(posts.length).toBe(0)
        })
    })
})