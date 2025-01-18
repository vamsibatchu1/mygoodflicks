export default function FlickLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {children}
    </div>
  )
} 