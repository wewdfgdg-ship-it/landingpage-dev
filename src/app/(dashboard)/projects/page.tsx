import Link from 'next/link';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    select: { orgId: true },
  });

  const projects = membership
    ? await db.project.findMany({
        where: { orgId: membership.orgId },
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          slug: true,
          isDeployed: true,
        },
      })
    : [];

  const statusLabel: Record<string, { text: string; color: string }> = {
    DRAFT: { text: '초안', color: 'bg-gray-100 text-gray-700' },
    GENERATING: { text: '생성중', color: 'bg-blue-100 text-blue-700' },
    GENERATED: { text: '완료', color: 'bg-green-100 text-green-700' },
    EDITING: { text: '편집중', color: 'bg-yellow-100 text-yellow-700' },
    DEPLOYED: { text: '배포됨', color: 'bg-purple-100 text-purple-700' },
    ARCHIVED: { text: '보관', color: 'bg-gray-100 text-gray-500' },
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">프로젝트</h1>
          <p className="mt-1 text-sm text-gray-500">
            AI 마케팅 엔진으로 랜딩페이지를 생성하세요
          </p>
        </div>
        <Link
          href="/projects/new"
          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          + 새 프로젝트
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="text-5xl mb-4">🚀</div>
          <h2 className="text-lg font-semibold text-gray-900">
            첫 랜딩페이지를 만들어보세요
          </h2>
          <p className="mt-2 text-sm text-gray-500 max-w-md">
            제품 정보를 입력하면 AI가 전략 분석부터 디자인까지 자동으로
            생성합니다.
          </p>
          <Link
            href="/projects/new"
            className="mt-6 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            + 새 프로젝트 만들기
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {projects.map((project) => {
            const status = statusLabel[project.status] ?? statusLabel.DRAFT;
            return (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(project.updatedAt).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.color}`}
                >
                  {status.text}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
