export default function AdminSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-10 w-64 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="h-4 w-48 bg-slate-50 rounded-xl animate-pulse" />
        </div>
        <div className="h-14 w-40 bg-slate-100 rounded-2xl animate-pulse" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 bg-white rounded-4xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="h-3 w-20 bg-slate-100 rounded-lg animate-pulse" />
              <div className="w-10 h-10 bg-slate-50 rounded-2xl animate-pulse" />
            </div>
            <div className="h-10 w-24 bg-slate-100 rounded-2xl animate-pulse" />
            <div className="h-3 w-32 bg-slate-50 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between">
           <div className="h-12 w-80 bg-white border border-slate-100 rounded-2xl animate-pulse" />
           <div className="h-12 w-40 bg-white border border-slate-100 rounded-2xl animate-pulse" />
        </div>
        <div className="p-8 space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl animate-pulse" />
                  <div className="space-y-2">
                     <div className="h-4 w-40 bg-slate-100 rounded-lg animate-pulse" />
                     <div className="h-3 w-24 bg-slate-50 rounded-lg animate-pulse" />
                  </div>
               </div>
               <div className="h-4 w-32 bg-slate-100 rounded-lg animate-pulse hidden md:block" />
               <div className="h-8 w-24 bg-slate-50 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
