// src/components/posts/ResponseList.tsx
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
    onDelete: () => void  // 削除後に呼ばれる
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

        onDelete()  // 親コンポーネントに削除を通知
    }

    if (responses.length === 0) {
        return <p className="text-gray-500 text-sm">まだレスがありません</p>
    }

    return (
        <div className="space-y-4">
            {responses.map((response) => (
                <div key={response.id} className="border rounded-md p-3">
                    {/* 投稿者・日時 */}
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-sm text-gray-500">
                            <span>{response.author.name}</span>
                            <span className="mx-2">·</span>
                            <span>
                                {new Date(response.createdAt).toLocaleDateString("ja-JP")}
                            </span>
                        </div>

                        {/* 削除ボタン（自分のレスのみ） */}
                        {currentUserId === response.author.id && (
                            <button
                                onClick={() => handleDelete(response.id)}
                                className="text-red-600 text-sm hover:underline"
                            >
                                削除
                            </button>
                        )}
                    </div>

                    {/* 内容 */}
                    <p className="whitespace-pre-wrap">{response.content}</p>
                </div>
            ))}
        </div>
    )
}