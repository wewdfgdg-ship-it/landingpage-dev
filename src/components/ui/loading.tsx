import { cn } from '@/lib/utils';

export function Loading({ className }: { className?: string }): React.ReactElement {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
    </div>
  );
}

export function PageLoading(): React.ReactElement {
  return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loading />
    </div>
  );
}
