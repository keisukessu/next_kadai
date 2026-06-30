// サーバーコンポーネント（ページ）
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CreatePostForm } from "@/components/posts/CreatePostForm"

export default async function CreatePostPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    return (
        <div>
            <h1>新規投稿</h1>
            <CreatePostForm />
        </div>
    )
}