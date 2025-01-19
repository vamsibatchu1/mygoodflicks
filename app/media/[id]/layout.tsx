export default function MediaLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { type: string; id: string }
}) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {children}
    </div>
  )
} 