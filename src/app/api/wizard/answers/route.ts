import { NextResponse } from 'next/server';
import { askClaude } from '@/lib/ai/claude';

interface AnswerInput {
  productName: string;
  industry: string;
  pageGoal: string;
  targetAudience: string;
  priceRange: string;
  questions: { id: string; question: string }[];
}

interface GeneratedAnswer {
  id: string;
  answer: string;
}

const SYSTEM_PROMPT = `당신은 10년 경력의 다이렉트 리스폰스 카피라이터입니다.
제품 정보를 기반으로, 심층 질문에 대한 **마케팅에 바로 사용할 수 있는 수준의 답변**을 작성합니다.

작성 원칙:
1. **구체적 수치 포함**: "많은 고객" 대신 "월 3,200명의 고객", "높은 만족도" 대신 "재구매율 78%"
2. **감정적 언어**: 고객의 고충과 해결 후 기쁨을 생생하게 묘사
3. **차별점 강조**: 경쟁사 대비 명확한 우위를 구체적으로 서술
4. **증거 기반**: 후기, 수상 이력, 인증, 전문가 추천 등 신뢰 요소 포함
5. **각 답변 80~200자**: 너무 짧지도, 너무 길지도 않게
6. **업종 전문성**: 해당 업종의 트렌드와 전문 용어를 자연스럽게 활용

반드시 JSON 배열만 응답하세요. 다른 텍스트 없이:
[
  { "id": "질문id", "answer": "답변 내용" }
]`;

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as AnswerInput;
    const { productName, industry, pageGoal, targetAudience, priceRange, questions } = body;

    if (!productName || !questions?.length) {
      return NextResponse.json({ error: '필수 정보 부족' }, { status: 400 });
    }

    const industryMap: Record<string, string> = {
      saas: 'SaaS/소프트웨어',
      ecommerce: '이커머스/온라인쇼핑',
      education: '교육/에듀테크',
      health: '건강/의료',
      beauty: '뷰티/화장품',
      food: '식품/F&B',
      finance: '금융/핀테크',
      lifestyle: '라이프스타일',
      b2b: 'B2B/기업용',
      other: '기타',
    };

    const goalMap: Record<string, string> = {
      purchase: '구매 전환',
      signup: '회원가입',
      inquiry: '상담 문의',
      download: '다운로드',
      registration: '사전등록',
      newsletter: '뉴스레터 구독',
    };

    const userMessage = `제품명: ${productName}
업종: ${industryMap[industry] ?? industry}
가격대: ${priceRange}원
페이지 목표: ${goalMap[pageGoal] ?? pageGoal}
타겟 고객: ${targetAudience}

이 제품을 판매하는 랜딩페이지를 만들기 위해, 아래 질문에 대한 설득력 있는 답변을 작성해주세요.
답변은 실제 마케터가 작성한 것처럼 구체적이고, 수치와 감정적 표현을 포함해야 합니다.

${questions.map((q, i) => `${i + 1}. [${q.id}] ${q.question}`).join('\n')}`;

    const result = await askClaude<GeneratedAnswer[]>(SYSTEM_PROMPT, userMessage);

    // 응답이 배열인지 검증
    if (!Array.isArray(result.data)) {
      return NextResponse.json(
        { error: '답변 생성 실패', detail: 'AI 응답이 올바른 형식이 아닙니다' },
        { status: 500 },
      );
    }

    // id 매핑 검증 — 질문 id와 매칭되는 답변만 반환
    const validAnswers = result.data
      .filter((a): a is GeneratedAnswer => typeof a.id === 'string' && typeof a.answer === 'string')
      .map((a) => ({
        id: a.id,
        answer: a.answer.trim(),
      }));

    return NextResponse.json({ answers: validAnswers });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Answer generation error:', msg);
    return NextResponse.json({ error: '답변 생성 실패', detail: msg }, { status: 500 });
  }
}
