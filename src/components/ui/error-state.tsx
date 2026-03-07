'use client';

import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = '오류가 발생했습니다',
  message = '잠시 후 다시 시도해주세요',
  onRetry,
}: ErrorStateProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="rounded-full bg-red-50 p-3">
        <svg
          className="h-6 w-6 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  );
}
