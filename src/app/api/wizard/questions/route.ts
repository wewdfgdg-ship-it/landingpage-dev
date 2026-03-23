import { NextResponse } from 'next/server';
import { askClaude } from '@/lib/ai/claude';

interface QuestionInput {
  productName: string;
  industry: string;
  pageGoal: string;
}

interface GeneratedQuestion {
  id: string;
  question: string;
  placeholder: string;
}

const SYSTEM_PROMPT = `당신은 랜딩페이지 전환 최적화 전문가입니다.
사용자의 제품/서비스 정보를 바탕으로, 높은 전환율의 랜딩페이지를 만들기 위해 반드시 알아야 할 심층 질문 5개를 생성합니다.

규칙:
1. 각 질문은 구체적이고 실용적이어야 합니다
2. 질문은 제품의 업종과 목표에 맞춰 커스터마이즈합니다
3. placeholder는 답변 예시를 제공합니다
4. JSON 배열로 응답합니다

JSON 형식:
[
  { "id": "q1", "question": "질문 내용", "placeholder": "답변 예시" },
  ...
]`;

export async function POST(req: Request): Promise<NextResponse> {
  const body = (await req.json()) as QuestionInput;
  const { productName, industry, pageGoal } = body;

  if (!productName || !industry || !pageGoal) {
    return NextResponse.json({ error: '필수 정보 부족' }, { status: 400 });
  }

  try {
    const userMessage = `제품명: ${productName}\n업종: ${industry}\n페이지 목표: ${pageGoal}`;
    const result = await askClaude<GeneratedQuestion[]>(SYSTEM_PROMPT, userMessage);

    return NextResponse.json({ questions: result.data });
  } catch {
    return NextResponse.json({ error: '질문 생성 실패' }, { status: 500 });
  }
}
