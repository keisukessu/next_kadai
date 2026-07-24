// src/lib/fonts.ts
import { Sawarabi_Gothic, Noto_Sans_JP } from "next/font/google"

export const sawarabiGothic = Sawarabi_Gothic({
    weight: "400",
    subsets: ["latin"],
    display: "swap"
})

export const notoSansJP = Noto_Sans_JP({
    weight: ["400", "700"],
    subsets: ["latin"],
    display: "swap"
})