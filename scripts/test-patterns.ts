import { PrismaClient, Prisma } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'node:fs';

async function main(): Promise<void> {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  const projects = await prisma.project.findMany({
    where: { layoutConfig: { not: Prisma.JsonNull } },
    select: { layoutConfig: true },
  });
  const patterns = new Set<string>();
  for (const p of projects) {
    const lc = p.layoutConfig as Record<string, unknown>;
    const sections = lc?.sections as Array<{ selectedPattern: string }> | undefined;
    if (sections) {
      for (const s of sections) {
        patterns.add(s.selectedPattern);
      }
    }
  }
  fs.writeFileSync('db-test.txt', [...patterns].sort().join('\n') + '\n');
  process.exit(0);
}
main().catch((e: Error) => {
  fs.writeFileSync('db-test.txt', 'ERR: ' + e.message + '\n');
  process.exit(1);
});
