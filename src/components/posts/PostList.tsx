// components/posts/PostList.tsx
import { Post, User } from "@prisma/client"
import { PostCard } from "./PostCard"
import { Pagination } from "../ui/Pagination"

interface PostWithAuthor extends Post {
    author: {
        id: string
        name: string
    }
    _count: {
        responses: number
    }
}

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
        <div className="space-y-4">
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
