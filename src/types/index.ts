import { Post } from "@prisma/client"

export interface PostWithAuthor extends Post {
    author: {
        id: string
        name: string
    }
    _count: {
        responses: number
    }
}