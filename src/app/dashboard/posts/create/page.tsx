// サーバーコンポーネント（ページ）
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CreatePostForm } from "@/components/posts/CreatePostForm"
import { notoSansJP } from "@/lib/fonts"

export default async function CreatePostPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    return (
        <div>
            <h1
                className={`text-[35px] font-bold tracking-[4.0px] text-white mt-8 ${notoSansJP.className}`}
                style={{
                    textShadow: "1.5px 1.5px 0 black, -1.5px -1.5px 0 black, 1.5px -1.5px 0 black, -1.5px 1.5px 0 black"
                }}
            >新規投稿</h1>
            <CreatePostForm />
        </div>
    )
}