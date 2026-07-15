// __tests__/api/posts/[id].test.ts
import { NextRequest } from "next/server"
import { GET, PUT, DELETE } from "@/app/api/posts/[id]/route"
import { prisma } from "@/lib/db"

// モック化
jest.mock("next-auth", () => ({
    getServerSession: jest.fn().mockResolvedValue({
        user: {
            id: "user1",
            name: "テストユーザー",
            email: "test@example.com"
        }
    })
}))

jest.mock("@/lib/db", () => ({
    prisma: {
        post: {
            findUnique: jest.fn(),
            update: jest.fn()
        }
    }
}))

// モックデータ
const mockPost = {
    id: "post1",
    title: "テスト投稿",
    content: "テスト内容",
    authorId: "user1",  // ログインユーザーと同じ
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    author: { id: "user1", name: "テストユーザー" },
    responses: [],
    _count: { responses: 0 }
}

describe("/api/posts/[id]", () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    //-----------------------------------------
    // GET メソッドのテスト
    //-----------------------------------------
    describe("GET", () => {
        it("投稿を正常に取得できる", async () => {
            ; (prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost)

            const request = new NextRequest("http://localhost:3000/api/posts/post1")
            const response = await GET(request, { params: Promise.resolve({ id: "post1" }) })
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data.title).toBe("テスト投稿")
            expect(data.content).toBe("テスト内容")
        })

        it("未ログインの場合は401を返す", async () => {
            const { getServerSession } = require("next-auth")
                ; (getServerSession as jest.Mock).mockResolvedValueOnce(null)

            const request = new NextRequest("http://localhost:3000/api/posts/post1")
            const response = await GET(request, { params: Promise.resolve({ id: "post1" }) })
            const data = await response.json()

            expect(response.status).toBe(401)
            expect(data.error).toBe("認証が必要です")
        })

        it("存在しない投稿の場合は404を返す", async () => {
            ; (prisma.post.findUnique as jest.Mock).mockResolvedValue(null)

            const request = new NextRequest("http://localhost:3000/api/posts/notfound")
            const response = await GET(request, { params: Promise.resolve({ id: "notfound" }) })
            const data = await response.json()

            expect(response.status).toBe(404)
            expect(data.error).toBe("投稿が見つかりません")
        })
    })

    //-----------------------------------------
    // PUT メソッドのテスト
    //-----------------------------------------
    describe("PUT", () => {
        it("自分の投稿を正常に更新できる", async () => {
            const updatedPost = { ...mockPost, title: "更新後のタイトル", content: "更新後の内容" }

                ; (prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost)
                ; (prisma.post.update as jest.Mock).mockResolvedValue(updatedPost)

            const request = new NextRequest("http://localhost:3000/api/posts/post1", {
                method: "PUT",
                body: JSON.stringify({
                    title: "更新後のタイトル",
                    content: "更新後の内容"
                }),
                headers: { "Content-Type": "application/json" }
            })

            const response = await PUT(request, { params: Promise.resolve({ id: "post1" }) })
            const data = await response.json()

            expect(response.status).toBe(200)
            expect(data.title).toBe("更新後のタイトル")
            expect(data.content).toBe("更新後の内容")
        })

        it("未ログインの場合は401を返す", async () => {
            const { getServerSession } = require("next-auth")
                ; (getServerSession as jest.Mock).mockResolvedValueOnce(null)

            const request = new NextRequest("http://localhost:3000/api/posts/post1", {
                method: "PUT",
                body: JSON.stringify({
                    title: "更新後のタイトル",
                    content: "更新後の内容"
                }),
                headers: { "Content-Type": "application/json" }
            })

            const response = await PUT(request, { params: Promise.resolve({ id: "post1" }) })
            const data = await response.json()

            expect(response.status).toBe(401)
            expect(data.error).toBe("認証が必要です")
        })

        it("他人の投稿は更新できない（403）", async () => {
            // authorId が違うユーザーの投稿
            const otherPost = { ...mockPost, authorId: "other-user" }
                ; (prisma.post.findUnique as jest.Mock).mockResolvedValue(otherPost)

            const request = new NextRequest("http://localhost:3000/api/posts/post1", {
                method: "PUT",
                body: JSON.stringify({
                    title: "更新後のタイトル",
                    content: "更新後の内容"
                }),
                headers: { "Content-Type": "application/json" }
            })

            const response = await PUT(request, { params: Promise.resolve({ id: "post1" }) })
            const data = await response.json()

            expect(response.status).toBe(403)
            expect(data.error).toBe("この投稿を編集する権限がありません")
        })
    })

    //-----------------------------------------
    // DELETE メソッドのテスト
    //-----------------------------------------
    describe("DELETE", () => {
        it("自分の投稿を正常に削除できる", async () => {
            ; (prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost)
                ; (prisma.post.update as jest.Mock).mockResolvedValue({ ...mockPost, isDeleted: true })

            const request = new NextRequest("http://localhost:3000/api/posts/post1", {
                method: "DELETE"
            })

            const response = await DELETE(request, { params: Promise.resolve({ id: "post1" }) })

            expect(response.status).toBe(204)
        })

        it("未ログインの場合は401を返す", async () => {
            const { getServerSession } = require("next-auth")
                ; (getServerSession as jest.Mock).mockResolvedValueOnce(null)

            const request = new NextRequest("http://localhost:3000/api/posts/post1", {
                method: "DELETE"
            })

            const response = await DELETE(request, { params: Promise.resolve({ id: "post1" }) })
            const data = await response.json()

            expect(response.status).toBe(401)
            expect(data.error).toBe("認証が必要です")
        })

        it("他人の投稿は削除できない（403）", async () => {
            const otherPost = { ...mockPost, authorId: "other-user" }
                ; (prisma.post.findUnique as jest.Mock).mockResolvedValue(otherPost)

            const request = new NextRequest("http://localhost:3000/api/posts/post1", {
                method: "DELETE"
            })

            const response = await DELETE(request, { params: Promise.resolve({ id: "post1" }) })
            const data = await response.json()

            expect(response.status).toBe(403)
            expect(data.error).toBe("この投稿を削除する権限がありません")
        })
    })
})