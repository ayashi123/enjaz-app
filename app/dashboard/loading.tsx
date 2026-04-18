export default function DashboardLoading() {
  return (
    <main className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="h-40 animate-pulse rounded-[28px] bg-white/70 shadow-soft" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-[28px] bg-white/70 shadow-soft" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-[28px] bg-white/70 shadow-soft" />
        <div className="h-80 animate-pulse rounded-[28px] bg-white/70 shadow-soft" />
      </div>
    </main>
  );
}
