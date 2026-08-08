// components/posts/PostList.tsx
import { PostCard } from "./PostCard"
import { Pagination } from "../ui/Pagination"
import { PostWithAuthor } from "@/types"

interface PostListProps {
    posts: PostWithAuthor[]
    currentPage: number
    totalPages: number
    currentUserId?: string
}

export function PostList({
    posts,
    currentPage,
    totalPages,
    currentUserId
}: PostListProps) {
    return (
        <div className="space-y-6">

            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    currentUserId={currentUserId}
                />
            ))}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
            />
        </div>
    )
}
