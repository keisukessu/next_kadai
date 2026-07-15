/**
 * @jest-environment node
 */
// __tests__/api/posts.test.ts
import { NextRequest } from "next/server"
import { GET, POST } from "@/app/api/posts/route"
import { prisma } from "@/lib/db"

// getServerSession をモック化
jest.mock("next-auth", () => ({
    getServerSession: jest.fn().mockResolvedValue({
        user: {
            id: "user1",
            name: "テストユーザー",
            email: "test@example.com"
        }
    })
}))

// テスト用のモック
jest.mock("@/lib/db", () => ({
    prisma: {
        post: {
            findMany: jest.fn(),
            count: jest.fn(),
            create: jest.fn(),
        }
    }
}))

describe("/api/posts", () => {
    //-----------------------------------------
    // GET メソッドのテスト
    //-----------------------------------------
    describe("GET", () => {
        it("投稿一覧を正常に取得する", async () => {
            const mockPosts = [
                {
                    id: "1",
                    title: "テスト投稿",
                    content: "テスト内容",
                    author: { id: "1", name: "テストユーザー" },
                    _count: { responses: 0 }
                }
            ]

                ; (prisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts)
                ; (prisma.post.count as jest.Mock).mockResolvedValue(1)

            const request = new NextRequest("http://localhost:3000/api/posts")
            const response = await GET(request)
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data.posts).toEqual(mockPosts)
            expect(data.pagination.total).toBe(1)
        })
        it("未ログインの場合は401を返す", async () => {
            const { getServerSession } = require("next-auth")
                ; (getServerSession as jest.Mock).mockResolvedValueOnce(null)

            const request = new NextRequest("http://localhost:3000/api/posts")
            const response = await GET(request)
            const data = await response.json()

            expect(response.status).toBe(401)
            expect(data.error).toBe("認証が必要です")
        })
    })

    //-----------------------------------------
    // POST メソッドのテスト
    //-----------------------------------------
    describe("POST", () => {
        it("正常に投稿を作成できる", async () => {
            const mockPost = {
                id: "1",
                title: "テスト投稿",
                content: "テスト内容",
                authorId: "user1",
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                author: { id: "user1", name: "テストユーザー" }
            }

                ; (prisma.post.create as jest.Mock).mockResolvedValue(mockPost)

            const request = new NextRequest("http://localhost:3000/api/posts", {
                method: "POST",
                body: JSON.stringify({
                    title: "テスト投稿",
                    content: "テスト内容"
                }),
                headers: { "Content-Type": "application/json" }
            })

            const response = await POST(request)
            const data = await response.json()

            expect(response.status).toBe(201)
            expect(data.title).toBe("テスト投稿")
            expect(data.content).toBe("テスト内容")
            expect(data.authorId).toBe("user1")
        })

        it("未ログインの場合は401を返す", async () => {
            // getServerSession が null を返すように上書き
            const { getServerSession } = require("next-auth")
                ; (getServerSession as jest.Mock).mockResolvedValueOnce(null)

            const request = new NextRequest("http://localhost:3000/api/posts", {
                method: "POST",
                body: JSON.stringify({
                    title: "テスト投稿",
                    content: "テスト内容"
                }),
                headers: { "Content-Type": "application/json" }
            })

            const response = await POST(request)
            const data = await response.json()

            expect(response.status).toBe(401)
            expect(data.error).toBe("認証が必要です")
        })

        it("バリデーションエラーの場合は400を返す", async () => {
            const request = new NextRequest("http://localhost:3000/api/posts", {
                method: "POST",
                body: JSON.stringify({
                    title: "",      // 空のタイトル → バリデーションエラー
                    content: ""     // 空の本文 → バリデーションエラー
                }),
                headers: { "Content-Type": "application/json" }
            })

            const response = await POST(request)
            const data = await response.json()

            expect(response.status).toBe(400)
        })
    })
})
