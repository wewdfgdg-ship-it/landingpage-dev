import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'node:fs';

async function main(): Promise<void> {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  const project = await prisma.project.findFirst({
    where: { status: 'GENERATED' },
    select: { copyBlocks: true, layoutConfig: true },
    orderBy: { createdAt: 'desc' },
  });
  const cb = project?.copyBlocks as Record<string, unknown>;
  const lc = project?.layoutConfig as Record<string, unknown>;
  const sections = cb?.sections as Array<Record<string, unknown>>;
  const layouts = lc?.sections as Array<Record<string, unknown>>;

  const result = sections.map((s: Record<string, unknown>) => {
    const copy = s.copy as Record<string, unknown>;
    const layout = layouts?.find((l: Record<string, unknown>) => l.order === s.sectionOrder);
    return {
      order: s.sectionOrder,
      pattern: layout?.selectedPattern,
      type: layout?.sectionType,
      hasImage: Boolean(copy?.imageUrl),
      headline: String(copy?.headline ?? '').substring(0, 40),
    };
  });
  fs.writeFileSync('db-test.txt', JSON.stringify(result, null, 2));
  process.exit(0);
}
main().catch((e: Error) => { fs.writeFileSync('db-test.txt', 'ERR: ' + e.message); process.exit(1); });
