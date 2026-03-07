'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut, useSession } from 'next-auth/react';

export function Header(): React.ReactElement {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="flex h-14 items-center justify-between border-b bg-white px-6">
      <div />
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-50">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.image ?? undefined} />
            <AvatarFallback>{user?.name?.[0] ?? '?'}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-gray-700">
            {user?.name ?? '사용자'}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
            로그아웃
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
