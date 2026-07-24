// lib/validations.ts
import { z } from "zod"

export const registerSchema = z.object({
    name: z.string()
        .min(1, "名前は必須です")
        .max(50, "名前は50文字以内で入力してください"),
    email: z.string()
        .email("有効なメールアドレスを入力してください"),
    password: z.string()
        .min(8, "パスワードは8文字以上で入力してください")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "パスワードは大文字、小文字、数字を含む必要があります"),
    confirmPassword: z.string()
        .min(1, "確認用パスワードは必須です")
}).refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"]  // エラーをconfirmPasswordフィールドに表示
})

export const loginSchema = z.object({
    email: z.string().email("有効なメールアドレスを入力してください"),
    password: z.string().min(1, "パスワードは必須です")
})

export const postSchema = z.object({
    title: z.string()
        .min(1, "タイトルは必須です")
        .max(100, "タイトルは100文字以内で入力してください"),
    content: z.string()
        .min(1, "本文は必須です")
        .max(2000, "本文は2000文字以内で入力してください")
})

export const responseSchema = z.object({
    content: z.string()
        .min(1, "レスは必須です")
        .max(500, "レスは500文字以内で入力してください")
})

export const updateProfileSchema = z.object({
    name: z.string()
        .min(1, "名前は必須です")
        .max(50, "名前は50文字以内で入力してください")
})