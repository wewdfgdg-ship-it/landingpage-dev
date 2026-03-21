import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const SECTIONS = ['HEADER_BANNER', 'KEY_FEATURES', 'BEFORE_AFTER', 'REVIEWS', 'FAQ', 'CTA', 'PRICE_TABLE', 'BRAND_STORY'];
const INDUSTRIES = ['beauty', 'food', 'saas', 'electronics', 'fashion'];
const TREATMENTS = ['photo', 'text', 'graphic', 'animation'];
const COLORS = ['E8B4B8', 'B4D4E8', 'B8E8B4', 'E8D4B4', 'D4B4E8', 'E8E4B4', 'B4E8E0', 'E8B4D4'];

async function main(): Promise<void> {
  const client = await pool.connect();

  try {
    // 기존 테스트 데이터 정리
    await client.query(`DELETE FROM "SectionReference" WHERE "sourceUrl" LIKE 'https://example.com%'`);

    let idx = 0;
    for (const sectionType of SECTIONS) {
      for (const industry of INDUSTRIES) {
        const treatment = TREATMENTS[idx % TREATMENTS.length];
        const color = COLORS[idx % COLORS.length];
        const id = `seed-${String(idx).padStart(3, '0')}`;
        const imageUrl = `https://placehold.co/400x600/${color}/333?text=${encodeURIComponent(sectionType)}%0A${encodeURIComponent(industry)}`;
        const sourceUrl = `https://example.com/${industry}/${sectionType.toLowerCase()}`;
        idx++;

        await client.query(
          `INSERT INTO "SectionReference" (id, "sectionType", industry, treatment, status, "imageUrl", "sourceUrl", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, 'PENDING', $5, $6, NOW(), NOW())
           ON CONFLICT (id) DO NOTHING`,
          [id, sectionType, industry, treatment, imageUrl, sourceUrl]
        );
      }
    }

    const result = await client.query(`SELECT count(*) FROM "SectionReference"`);
    process.stdout.write(`완료: ${result.rows[0].count}개 레퍼런스\n`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  process.stderr.write(`${e}\n`);
  process.exit(1);
});
