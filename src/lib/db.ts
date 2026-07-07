// src/lib/db.ts
import { PrismaClient } from "@prisma/client"

// グローバル変数の型を拡張
declare global {
    var prisma: PrismaClient | undefined
}

// Prisma Clientのインスタンスを作成
export const prisma = global.prisma || new PrismaClient()

// 開発環境ではグローバルに保存する
if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma
}