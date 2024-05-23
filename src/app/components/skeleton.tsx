const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton() {
  return (
    <div className={`relative overflow-hidden rounded-xl  p-2 shadow-sm`}>
      <h3 className="ml-2 text-sm font-medium animate-pulse">
        {'Analysing...'}
      </h3>
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md" />
        <div className="ml-2 h-6 w-16 rounded-md text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center rounded-xl px-4 py-8">
        <div className="h-7 w-20 rounded-md" />
      </div>
    </div>
  );
}
