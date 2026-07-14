// __tests__/lib/bcrypt.test.ts
import bcrypt from "bcryptjs"

// bcryptのユニットテスト
describe("bcrypt", () => {
    const password = "Password123"

    describe("hash", () => {
        it("パスワードをハッシュ化する", async () => {
            const hashedPassword = await bcrypt.hash(password, 10)
            expect(hashedPassword).not.toBe(password)
        })
        it("ハッシュ値は毎回異なる（ソルト）", async () => {
            const hashedPassword1 = await bcrypt.hash(password, 10)
            const hashedPassword2 = await bcrypt.hash(password, 10)
            expect(hashedPassword1).not.toBe(hashedPassword2)
        })
    })

    describe("compare", () => {
        it("正しいパスワードは一致する", async () => {
            const hashedPassword = await bcrypt.hash(password, 10)
            const isMatch = await bcrypt.compare(password, hashedPassword)
            expect(isMatch).toBe(true)
        })
        it("間違ったパスワードは一致しない", async () => {
            const hashedPassword = await bcrypt.hash(password, 10)
            const isMatch = await bcrypt.compare("WrongPassword", hashedPassword)
            expect(isMatch).toBe(false)
        })
    })
})