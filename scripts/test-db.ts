import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'node:fs';

async function main(): Promise<void> {
  const out = (s: string): void => { fs.appendFileSync('db-test.txt', s + '\n'); };
  fs.writeFileSync('db-test.txt', '');

  out('START');
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  out('adapter created');
  const prisma = new PrismaClient({ adapter });
  out('prisma created');

  const count = await prisma.user.count();
  out('USER_COUNT=' + count);

  if (count > 0) {
    const users = await prisma.user.findMany({ select: { id: true, email: true }, take: 3 });
    out('USERS=' + JSON.stringify(users));
    const mems = await prisma.membership.findMany({ select: { userId: true, orgId: true }, take: 3 });
    out('MEMBERSHIPS=' + JSON.stringify(mems));
    const projects = await prisma.project.findMany({ select: { id: true, name: true, status: true }, take: 5 });
    out('PROJECTS=' + JSON.stringify(projects));
  }

  out('DONE');
  process.exit(0);
}

main().catch((e: Error) => {
  fs.appendFileSync('db-test.txt', 'ERROR=' + e.message + '\n');
  process.exit(1);
});
