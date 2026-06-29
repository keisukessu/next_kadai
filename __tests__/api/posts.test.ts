// __tests__/api/posts.test.ts
import { NextRequest } from "next/server"
import { GET, POST } from "@/app/api/posts/route"
import { prisma } from "@/lib/db"

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
    })
})
