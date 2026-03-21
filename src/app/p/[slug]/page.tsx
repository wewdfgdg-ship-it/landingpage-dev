import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { resolvePageVersion } from '@/lib/ab-routing';

interface Props {
  params: Promise<{ slug: string }>;
}

const AB_COOKIE = 'ab_version';

export default async function PublicLandingPage({ params }: Props): Promise<React.ReactElement> {
  const { slug } = await params;

  const project = await db.project.findFirst({
    where: { slug, isDeployed: true, deletedAt: null },
    select: { id: true, generatedHtml: true, name: true },
  });

  if (!project?.generatedHtml) {
    notFound();
  }

  // A/B 테스트 라우팅: 쿠키로 세션 고정
  const cookieStore = await cookies();
  const existingVersionId = cookieStore.get(AB_COOKIE)?.value;

  const routing = await resolvePageVersion(
    project.id,
    project.generatedHtml,
    existingVersionId,
  );

  // versionId를 tracking script에 주입
  let html = routing.html;
  if (routing.versionId) {
    html = html.replace(/__PAGE_VERSION_ID__/g, routing.versionId);
  }

  return (
    <>
      {routing.versionId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `document.cookie="${AB_COOKIE}=${routing.versionId};path=/;max-age=${60 * 60 * 24 * 30};SameSite=Lax"`,
          }}
        />
      )}
      <iframe
        srcDoc={html}
        className="h-screen w-screen border-0"
        title={project.name}
        sandbox="allow-scripts allow-same-origin"
      />
    </>
  );
}
