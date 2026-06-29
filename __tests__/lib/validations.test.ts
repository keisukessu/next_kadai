// __tests__/lib/validations.test.ts
import { postSchema, registerSchema } from "@/lib/validations"

describe("Validation Schemas", () => {
    describe("postSchema", () => {
        it("有効な投稿データを通す", () => {
            const validData = {
                title: "テスト投稿",
                content: "これはテスト投稿の本文です"
            }

            expect(() => postSchema.parse(validData)).not.toThrow()
        })

        it("タイトルが空の場合はエラーを返す", () => {
            const invalidData = {
                title: "",
                content: "本文"
            }

            expect(() => postSchema.parse(invalidData)).toThrow()
        })
    })

    describe("registerSchema", () => {
        it("有効な登録データを通す", () => {
            const validData = {
                name: "テストユーザー",
                email: "test@example.com",
                password: "Password123"
            }

            expect(() => registerSchema.parse(validData)).not.toThrow()
        })

        it("不正なメールアドレスの場合はエラーを返す", () => {
            const invalidData = {
                name: "テストユーザー",
                email: "invalid-email",
                password: "Password123"
            }

            expect(() => registerSchema.parse(invalidData)).toThrow()
        })
    })
})
