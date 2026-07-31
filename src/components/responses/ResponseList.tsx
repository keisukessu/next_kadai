// src/components/responses/ResponseList.tsx
"use client"

interface Response {
    id: string
    content: string
    createdAt: Date
    author: {
        id: string
        name: string
    }
}

interface ResponseListProps {
    responses: Response[]
    currentUserId?: string
    postId: string
    onDelete: () => void
}

export function ResponseList({
    responses,
    currentUserId,
    postId,
    onDelete
}: ResponseListProps) {

    async function handleDelete(responseId: string) {
        const res = await fetch(
            `/api/posts/${postId}/responses/${responseId}`,
            { method: "DELETE" }
        )
        if (!res.ok) {
            alert("削除に失敗しました")
            return
        }
        onDelete()
    }

    if (responses.length === 0) {
        return <p className="text-gray-500 text-sm">まだレスがありません</p>
    }

    return (
        <div>
            {responses.map((response, index) => (
                <div key={response.id}>
                    {index !== 0 && <hr className="border-gray-200" />}
                    <div className="py-3">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{response.author.name}</span>
                                <span>·</span>
                                <span>{new Date(response.createdAt).toLocaleDateString("ja-JP")}</span>
                            </div>
                            {currentUserId === response.author.id && (
                                <button
                                    onClick={() => handleDelete(response.id)}
                                    className="text-red-500 text-xs hover:underline"
                                >
                                    削除
                                </button>
                            )}
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{response.content}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}