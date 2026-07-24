// src/app/dashboard/layout.tsx
import { Header } from "@/components/layout/Header"

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <Header />
            {/* グラデーション背景 */}
            <div className="bg-[#fcf9ef] min-h-screen">
                <main className="max-w-4xl mx-auto px-4 py-6">
                    {children}
                </main>
            </div>
        </div>
    )
}