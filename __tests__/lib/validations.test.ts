// __tests__/lib/validations.test.ts
import { postSchema, registerSchema, loginSchema, responseSchema, updateProfileSchema } from "@/lib/validations"

// バリデーションスキーマのユニットテスト
describe("Validation Schemas", () => {
    // Postスキーマのテスト
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
    // Registerスキーマのテスト
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
    // Loginスキーマのテスト
    describe("loginSchema", () => {
        it("有効なログインデータを通す", () => {
            const validData = {
                email: "test@example.com",
                password: "Password123"
            }

            expect(() => loginSchema.parse(validData)).not.toThrow()
        })

        it("メールアドレスが空の場合はエラーを返す", () => {
            const invalidData = {
                email: "",
                password: "Password123"
            }

            expect(() => loginSchema.parse(invalidData)).toThrow()
        })

        it("パスワードが空の場合はエラーを返す", () => {
            const invalidData = {
                email: "test@example.com",
                password: ""
            }

            expect(() => loginSchema.parse(invalidData)).toThrow()
        })

        it("メールアドレスの形式が不正な場合はエラーを返す", () => {
            const invalidData = {
                email: "invalid-email",
                password: "Password123"
            }

            expect(() => loginSchema.parse(invalidData)).toThrow()
        })
    })
    // Responseスキーマのテスト
    describe("responseSchema", () => {
        it("有効なレスデータを通す", () => {
            const validData = {
                content: "これはテストレスです"
            }

            expect(() => responseSchema.parse(validData)).not.toThrow()
        })

        it("レスが空の場合はエラーを返す", () => {
            const invalidData = {
                content: ""
            }

            expect(() => responseSchema.parse(invalidData)).toThrow()
        })
        it("レスが500文字を超える場合はエラーを返す", () => {
            const invalidData = {
                content: "a".repeat(501)
            }

            expect(() => responseSchema.parse(invalidData)).toThrow()
        })
    })
    // UpdateProfileスキーマのテスト
    describe("updateProfileSchema", () => {
        it("有効な名前を通す", () => {
            const validData = {
                name: "新しい名前"
            }

            expect(() => updateProfileSchema.parse(validData)).not.toThrow()
        })

        it("名前が空の場合はエラーを返す", () => {
            const invalidData = {
                name: ""
            }

            expect(() => updateProfileSchema.parse(invalidData)).toThrow()
        })

        it("名前が50文字を超える場合はエラーを返す", () => {
            const invalidData = {
                name: "a".repeat(51)
            }

            expect(() => updateProfileSchema.parse(invalidData)).toThrow()
        })
    })
})
