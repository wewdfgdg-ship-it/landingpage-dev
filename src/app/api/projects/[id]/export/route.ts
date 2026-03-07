import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { deflateSync } from 'zlib';

// ============================================================
// 내보내기 API
// GET /api/projects/[id]/export?format=html|react-zip
// ============================================================

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse | Response> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  const { id } = await params;
  const url = new URL(req.url);
  const format = url.searchParams.get('format') ?? 'html';

  // 권한 확인
  const membership = await db.membership.findFirst({
    where: { userId: session.user.id },
    select: { orgId: true },
  });

  if (!membership) {
    return NextResponse.json({ error: '조직 없음' }, { status: 403 });
  }

  const project = await db.project.findFirst({
    where: { id, orgId: membership.orgId, deletedAt: null },
    select: {
      name: true,
      slug: true,
      generatedHtml: true,
      generatedPage: true,
      styleConfig: true,
    },
  });

  if (!project) {
    return NextResponse.json({ error: '프로젝트 없음' }, { status: 404 });
  }

  if (!project.generatedHtml) {
    return NextResponse.json({ error: '생성된 페이지가 없습니다' }, { status: 400 });
  }

  const safeName = (project.slug ?? project.name).replace(/[^a-zA-Z0-9가-힣_-]/g, '_');

  if (format === 'html') {
    return exportHtml(project.generatedHtml, safeName);
  }

  if (format === 'react-zip') {
    return exportReactZip(project, safeName);
  }

  return NextResponse.json({ error: `지원하지 않는 형식: ${format}` }, { status: 400 });
}

// ============================================================
// HTML 단일 파일 다운로드
// ============================================================

function exportHtml(html: string, filename: string): Response {
  // 트래킹 스크립트 제거 (다운로드용)
  const cleanHtml = html.replace(
    /<script[^>]*data-tracking[^>]*>[\s\S]*?<\/script>/gi,
    '<!-- tracking removed for export -->',
  );

  return new Response(cleanHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}.html"`,
    },
  });
}

// ============================================================
// React ZIP 내보내기 (순수 zlib — 외부 의존 없음)
// ============================================================

interface ProjectData {
  name: string;
  slug: string | null;
  generatedHtml: string | null;
  generatedPage: unknown;
  styleConfig: unknown;
}

function exportReactZip(project: ProjectData, filename: string): Response {
  const page = project.generatedPage as {
    meta?: { title?: string; description?: string };
    globalCss?: string;
    sections?: { order: number; role: string; html: string }[];
  } | null;

  if (!page?.sections) {
    return new Response(JSON.stringify({ error: '섹션 데이터 없음' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // React 프로젝트 파일들 생성
  const files: Record<string, string> = {};

  // package.json
  files['package.json'] = JSON.stringify({
    name: filename,
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
    },
    dependencies: {
      next: '^15.0.0',
      react: '^19.0.0',
      'react-dom': '^19.0.0',
    },
    devDependencies: {
      typescript: '^5',
      '@types/react': '^19',
      '@types/node': '^20',
    },
  }, null, 2);

  // tsconfig.json
  files['tsconfig.json'] = JSON.stringify({
    compilerOptions: {
      target: 'ES2017',
      lib: ['dom', 'dom.iterable', 'esnext'],
      jsx: 'preserve',
      module: 'esnext',
      moduleResolution: 'bundler',
      strict: true,
      esModuleInterop: true,
      paths: { '@/*': ['./src/*'] },
    },
    include: ['src/**/*.ts', 'src/**/*.tsx'],
  }, null, 2);

  // next.config.ts
  files['next.config.ts'] = `import type { NextConfig } from 'next';
const config: NextConfig = {};
export default config;
`;

  // globals.css
  files['src/app/globals.css'] = page.globalCss ?? `
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Noto Sans KR', sans-serif; }
`;

  // layout.tsx
  files['src/app/layout.tsx'] = `import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: ${JSON.stringify(page.meta?.title ?? filename)},
  description: ${JSON.stringify(page.meta?.description ?? '')},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
`;

  // page.tsx — 메인 페이지
  const sectionImports = page.sections
    .map((s) => `import Section${s.order} from '@/components/Section${s.order}';`)
    .join('\n');

  const sectionRenders = page.sections
    .map((s) => `        <Section${s.order} />`)
    .join('\n');

  files['src/app/page.tsx'] = `${sectionImports}

export default function LandingPage() {
  return (
    <main>
${sectionRenders}
    </main>
  );
}
`;

  // 섹션 컴포넌트들
  for (const section of page.sections) {
    const componentName = `Section${section.order}`;
    // HTML을 dangerouslySetInnerHTML로 렌더링
    const escapedHtml = JSON.stringify(section.html);

    files[`src/components/${componentName}.tsx`] = `// ${section.role} 섹션 (순서: ${section.order})
export default function ${componentName}() {
  return (
    <section
      data-section-order={${section.order}}
      dangerouslySetInnerHTML={{ __html: ${escapedHtml} }}
    />
  );
}
`;
  }

  // README
  files['README.md'] = `# ${page.meta?.title ?? filename}

AI로 생성된 랜딩 페이지입니다.

## 시작하기

\`\`\`bash
npm install
npm run dev
\`\`\`

http://localhost:3000 에서 확인할 수 있습니다.
`;

  // ZIP 생성 (순수 zlib)
  const zipBuffer = createZip(files);

  return new Response(new Uint8Array(zipBuffer), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${filename}-react.zip"`,
    },
  });
}

// ============================================================
// 순수 zlib 기반 ZIP 생성기
// ============================================================

function createZip(files: Record<string, string>): Buffer {
  const entries: { name: Buffer; compressed: Buffer; crc: number; size: number; compressedSize: number; offset: number }[] = [];
  const buffers: Buffer[] = [];
  let offset = 0;

  for (const [path, content] of Object.entries(files)) {
    const nameBytes = Buffer.from(path, 'utf-8');
    const data = Buffer.from(content, 'utf-8');
    const crc = crc32(data);
    const compressed = deflateSync(data, { level: 6 });

    // Local file header
    const localHeader = Buffer.alloc(30 + nameBytes.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // signature
    localHeader.writeUInt16LE(20, 4); // version needed
    localHeader.writeUInt16LE(0, 6); // flags
    localHeader.writeUInt16LE(8, 8); // compression: deflate
    localHeader.writeUInt16LE(0, 10); // mod time
    localHeader.writeUInt16LE(0, 12); // mod date
    localHeader.writeUInt32LE(crc, 14); // crc32
    localHeader.writeUInt32LE(compressed.length, 18); // compressed size
    localHeader.writeUInt32LE(data.length, 22); // uncompressed size
    localHeader.writeUInt16LE(nameBytes.length, 26); // filename length
    localHeader.writeUInt16LE(0, 28); // extra field length
    nameBytes.copy(localHeader, 30);

    entries.push({
      name: nameBytes,
      compressed,
      crc,
      size: data.length,
      compressedSize: compressed.length,
      offset,
    });

    buffers.push(localHeader, compressed);
    offset += localHeader.length + compressed.length;
  }

  // Central directory
  const cdStart = offset;
  for (const entry of entries) {
    const cdHeader = Buffer.alloc(46 + entry.name.length);
    cdHeader.writeUInt32LE(0x02014b50, 0); // signature
    cdHeader.writeUInt16LE(20, 4); // version made by
    cdHeader.writeUInt16LE(20, 6); // version needed
    cdHeader.writeUInt16LE(0, 8); // flags
    cdHeader.writeUInt16LE(8, 10); // compression
    cdHeader.writeUInt16LE(0, 12); // mod time
    cdHeader.writeUInt16LE(0, 14); // mod date
    cdHeader.writeUInt32LE(entry.crc, 16); // crc32
    cdHeader.writeUInt32LE(entry.compressedSize, 20); // compressed size
    cdHeader.writeUInt32LE(entry.size, 24); // uncompressed size
    cdHeader.writeUInt16LE(entry.name.length, 28); // filename length
    cdHeader.writeUInt16LE(0, 30); // extra field length
    cdHeader.writeUInt16LE(0, 32); // comment length
    cdHeader.writeUInt16LE(0, 34); // disk number
    cdHeader.writeUInt16LE(0, 36); // internal attributes
    cdHeader.writeUInt32LE(0, 38); // external attributes
    cdHeader.writeUInt32LE(entry.offset, 42); // local header offset
    entry.name.copy(cdHeader, 46);

    buffers.push(cdHeader);
    offset += cdHeader.length;
  }

  const cdSize = offset - cdStart;

  // End of central directory
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // signature
  eocd.writeUInt16LE(0, 4); // disk number
  eocd.writeUInt16LE(0, 6); // cd disk number
  eocd.writeUInt16LE(entries.length, 8); // entries on this disk
  eocd.writeUInt16LE(entries.length, 10); // total entries
  eocd.writeUInt32LE(cdSize, 12); // cd size
  eocd.writeUInt32LE(cdStart, 16); // cd offset
  eocd.writeUInt16LE(0, 20); // comment length
  buffers.push(eocd);

  return Buffer.concat(buffers);
}

// ============================================================
// CRC-32 계산
// ============================================================

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
})();

function crc32(buf: Buffer): number {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
