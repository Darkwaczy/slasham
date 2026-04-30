export function AdminSkeleton() {
  return (
    <div className="flex min-h-screen bg-slate-50 animate-pulse">
      {/* Sidebar skeleton */}
      <div className="w-72 bg-white border-r border-slate-200 p-8 hidden md:block">
        <div className="h-8 bg-slate-200 rounded-xl mb-8 w-32" />
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-10 bg-slate-100 rounded-xl mb-2" />
        ))}
      </div>
      {/* Main content skeleton */}
      <div className="flex-1 p-8 space-y-6">
        <div className="h-8 bg-slate-200 rounded-xl w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200" />
          ))}
        </div>
        <div className="h-64 bg-white rounded-2xl border border-slate-200" />
      </div>
    </div>
  );
}
