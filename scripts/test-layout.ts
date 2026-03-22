import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'node:fs';

async function main(): Promise<void> {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const project = await prisma.project.findFirst({
    where: { status: 'GENERATED' },
    select: { layoutConfig: true, copyBlocks: true },
    orderBy: { createdAt: 'desc' },
  });

  const lc = project?.layoutConfig as Record<string, unknown>;
  const sections = lc?.sections as Array<Record<string, unknown>>;
  fs.writeFileSync('db-test.txt', JSON.stringify(sections, null, 2));
  process.exit(0);
}
main().catch((e: Error) => { fs.writeFileSync('db-test.txt', 'ERR: ' + e.message); process.exit(1); });
