/**
 * 업종별 기본 키워드 프리셋 시딩
 * 실행: npx tsx scripts/seed-keywords.ts
 */

import 'dotenv/config';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const DEFAULT_KEYWORDS: Record<string, string[]> = {
  beauty: ['화장품', '스킨케어', '뷰티', '코스메틱', '기초화장품'],
  food: ['건강식품', '식품', '다이어트', '영양제', '유기농'],
  fashion: ['의류', '패션', '스타일', '브랜드옷', '트렌드'],
  electronics: ['전자기기', '가전제품', 'IT기기', '스마트기기', '디지털'],
  furniture: ['가구', '인테리어', '리빙', '홈데코', '수납'],
  kids: ['유아용품', '키즈', '아기', '육아', '어린이'],
  pets: ['반려동물', '펫용품', '강아지', '고양이', '펫푸드'],
  sports: ['스포츠', '운동', '피트니스', '아웃도어', '헬스'],
  saas: ['소프트웨어', 'SaaS', '클라우드', '업무도구', '자동화'],
  education: ['온라인강의', '교육', '이러닝', '인강', '자격증'],
  finance: ['금융', '보험', '투자', '재테크', '대출'],
  realestate: ['부동산', '아파트', '분양', '매매', '임대'],
  travel: ['여행', '호텔', '숙소', '관광', '항공권'],
  clinic: ['병원', '클리닉', '의료', '시술', '건강검진'],
  legal: ['법률', '세무', '변호사', '세무사', '법률상담'],
  enterprise: ['기업솔루션', 'B2B', '엔터프라이즈', '비즈니스', '업무효율'],
  marketing: ['마케팅', '광고', '홍보', '브랜딩', '디지털마케팅'],
  consulting: ['컨설팅', '경영', '전략', '비즈니스컨설팅', '경영자문'],
};

async function main(): Promise<void> {
  const client = await pool.connect();

  try {
    for (const [industry, keywords] of Object.entries(DEFAULT_KEYWORDS)) {
      const pgArray = `{${keywords.map((k) => `"${k}"`).join(',')}}`;

      await client.query(
        `INSERT INTO "IndustryKeywordPreset" (id, industry, keywords, "updatedAt")
         VALUES (gen_random_uuid()::text, $1, $2::text[], NOW())
         ON CONFLICT (industry)
         DO UPDATE SET keywords = $2::text[], "updatedAt" = NOW()`,
        [industry, pgArray],
      );
    }

    const result = await client.query(`SELECT count(*) FROM "IndustryKeywordPreset"`);
    process.stdout.write(`시딩 완료: ${result.rows[0].count}개 업종 키워드 프리셋\n`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  process.stderr.write(`${e}\n`);
  process.exit(1);
});
