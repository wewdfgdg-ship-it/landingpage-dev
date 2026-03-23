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

const SYSTEM_PROMPT = `당신은 마케팅 카피라이터이자 제품 전문가입니다.
사용자의 제품 정보를 바탕으로, 심층 질문에 대한 설득력 있고 구체적인 답변을 작성합니다.

규칙:
1. 각 답변은 50~150자로 구체적이고 설득력 있게 작성
2. 실제 데이터, 수치, 고객 후기 등을 자연스럽게 포함
3. 해당 업종의 전문 용어와 트렌드를 반영
4. 마케팅에 바로 사용할 수 있는 수준의 품질
5. JSON 배열로 응답

JSON 형식:
[
  { "id": "질문id", "answer": "답변 내용" },
  ...
]`;

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = (await req.json()) as AnswerInput;
    const { productName, industry, pageGoal, targetAudience, priceRange, questions } = body;

    if (!productName || !questions?.length) {
      return NextResponse.json({ error: '필수 정보 부족' }, { status: 400 });
    }

    const userMessage = `제품명: ${productName}
업종: ${industry}
가격대: ${priceRange}
페이지 목표: ${pageGoal}
타겟 고객: ${targetAudience}

아래 질문들에 대해 이 제품에 맞는 구체적인 답변을 작성해주세요:

${questions.map((q, i) => `${i + 1}. [${q.id}] ${q.question}`).join('\n')}`;

    const result = await askClaude<GeneratedAnswer[]>(SYSTEM_PROMPT, userMessage);

    return NextResponse.json({ answers: result.data });
  } catch (error) {
    console.error('Answer generation error:', error);
    return NextResponse.json({ error: '답변 생성 실패' }, { status: 500 });
  }
}
