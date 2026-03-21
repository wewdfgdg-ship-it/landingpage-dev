import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main(): Promise<void> {
  const client = await pool.connect();
  try {
    const result = await client.query(`UPDATE "User" SET "isAdmin" = true RETURNING email, "isAdmin"`);
    for (const row of result.rows) {
      process.stdout.write(`${row.email} → isAdmin: ${row.isAdmin}\n`);
    }
    process.stdout.write(`${result.rowCount}명 관리자 설정 완료\n`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  process.stderr.write(`${e}\n`);
  process.exit(1);
});
