import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'node:fs';

async function main(): Promise<void> {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const project = await prisma.project.findFirst({
    where: { status: 'GENERATED' },
    select: {
      id: true, name: true, status: true, slug: true,
      generatedHtml: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  if (project) {
    fs.writeFileSync('db-test.txt', `PROJECT: ${project.name} [${project.status}]\n`);
    fs.appendFileSync('db-test.txt', `SLUG: ${project.slug}\n`);
    fs.appendFileSync('db-test.txt', `HTML_LENGTH: ${project.generatedHtml?.length ?? 0}\n`);
    if (project.generatedHtml) {
      fs.appendFileSync('db-test.txt', `HTML_PREVIEW:\n${project.generatedHtml.substring(0, 800)}\n`);
      fs.writeFileSync('test-output.html', project.generatedHtml);
      fs.appendFileSync('db-test.txt', 'SAVED: test-output.html\n');
    }
  } else {
    fs.writeFileSync('db-test.txt', 'NO GENERATED PROJECT\n');
  }
  process.exit(0);
}

main().catch((e: Error) => {
  fs.appendFileSync('db-test.txt', `ERR: ${e.message}\n`);
  process.exit(1);
});
