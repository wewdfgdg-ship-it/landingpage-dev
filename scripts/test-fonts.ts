import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'node:fs';

async function main(): Promise<void> {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  const project = await prisma.project.findFirst({
    where: { status: 'GENERATED' },
    select: { styleConfig: true },
    orderBy: { createdAt: 'desc' },
  });
  const sc = project?.styleConfig as Record<string, unknown>;
  const tokens = sc?.tokens as Record<string, unknown>;
  fs.writeFileSync('db-test.txt', JSON.stringify({
    fontFamily: tokens?.fontFamily,
    typography: tokens?.typography,
    moodPreset: sc?.moodPreset,
  }, null, 2));
  process.exit(0);
}
main().catch((e: Error) => { fs.writeFileSync('db-test.txt', 'ERR: ' + e.message); process.exit(1); });
