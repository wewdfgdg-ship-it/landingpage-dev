'use client';

import { useEffect, useState } from 'react';
import { useWizardStore } from '@/stores/wizard-store';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

async function fetchDeepQuestions(
  basicInfo: { productName: string; industry: string; pageGoal: string },
): Promise<{ id: string; question: string; placeholder: string }[]> {
  const res = await fetch('/api/wizard/questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(basicInfo),
  });

  if (!res.ok) throw new Error('질문 생성 실패');
  const data = (await res.json()) as {
    questions: { id: string; question: string; placeholder: string }[];
  };
  return data.questions;
}

const FALLBACK_QUESTIONS = [
  { id: 'fallback_1', question: '이 제품/서비스가 해결하는 핵심 문제는 무엇인가요?', placeholder: '핵심 키워드만 적어도 됩니다. 예: 시간 부족, 비용 절감' },
  { id: 'fallback_2', question: '경쟁 제품 대비 가장 큰 차별점은 무엇인가요?', placeholder: '예: 국내산, 수제, 72% 함량' },
  { id: 'fallback_3', question: '실제 고객 후기나 성과 데이터가 있나요?', placeholder: '예: 재구매율 60%, 별점 4.8' },
  { id: 'fallback_4', question: '제품 구매를 망설이는 고객의 주요 걱정은 무엇인가요?', placeholder: '예: 가격, 효과 의심, 배송' },
  { id: 'fallback_5', question: '브랜드의 핵심 가치나 미션은 무엇인가요?', placeholder: '예: 건강한 간식, 프리미엄' },
];

export function StepDeepQuestions(): React.ReactElement {
  const {
    basicInfo,
    deepQuestions,
    questionsLoading,
    setDeepQuestions,
    updateAnswer,
    setQuestionsLoading,
  } = useWizardStore();

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [analyzed, setAnalyzed] = useState(false);

  // 질문만 로드 (답변 자동 생성 안 함)
  useEffect(() => {
    if (deepQuestions.length > 0) return;

    let cancelled = false;

    async function loadQuestions(): Promise<void> {
      setQuestionsLoading(true);
      try {
        const questions = await fetchDeepQuestions({
          productName: basicInfo.productName,
          industry: basicInfo.industry as string,
          pageGoal: basicInfo.pageGoal as string,
        });
        if (!cancelled) {
          setDeepQuestions(questions.map((q) => ({ ...q, answer: '' })));
        }
      } catch {
        if (!cancelled) {
          setDeepQuestions(FALLBACK_QUESTIONS.map((q) => ({ ...q, answer: '' })));
        }
      } finally {
        if (!cancelled) setQuestionsLoading(false);
      }
    }

    void loadQuestions();
    return (): void => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // "심층 질문 분석" — 사용자 키워드를 기반으로 AI가 풍부한 답변 생성
  const handleAnalyze = async (): Promise<void> => {
    setAiLoading(true);
    setAiError(null);
    try {
      // 사용자가 입력한 키워드를 question과 함께 전달
      const questionsWithUserInput = deepQuestions.map((q) => ({
        id: q.id,
        question: q.question,
        userKeywords: q.answer.trim(), // 사용자가 적은 키워드/메모
      }));

      const res = await fetch('/api/wizard/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: basicInfo.productName,
          industry: basicInfo.industry as string,
          pageGoal: basicInfo.pageGoal as string,
          targetAudience: basicInfo.targetAudience,
          priceRange: basicInfo.priceRange,
          questions: questionsWithUserInput,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({})) as { error?: string; detail?: string };
        throw new Error(errBody.detail ?? errBody.error ?? `HTTP ${res.status}`);
      }

      const data = (await res.json()) as { answers: { id: string; answer: string }[] };
      if (data.answers && Array.isArray(data.answers)) {
        for (const a of data.answers) {
          updateAnswer(a.id, a.answer);
        }
        setAnalyzed(true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setAiError(`분석 실패: ${msg}`);
    } finally {
      setAiLoading(false);
    }
  };

  if (questionsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">심층 질문</h2>
          <p className="mt-1 text-sm text-gray-500">AI가 맞춤 질문을 생성하고 있습니다...</p>
        </div>
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
          <p className="text-sm text-gray-500">질문 생성 중...</p>
        </div>
      </div>
    );
  }

  // AI 분석 진행 중
  if (aiLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">심층 질문 분석</h2>
          <p className="mt-1 text-sm text-gray-500">입력하신 키워드를 바탕으로 AI가 답변을 작성하고 있습니다...</p>
        </div>
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-sm font-medium text-blue-600">AI 분석 중...</p>
          <p className="text-xs text-gray-400">약 10~20초 소요됩니다</p>
        </div>
      </div>
    );
  }

  const hasAnyInput = deepQuestions.some((q) => q.answer.trim().length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">심층 질문</h2>
          <p className="mt-1 text-sm text-gray-500">
            {analyzed
              ? 'AI가 작성한 답변을 검토하고, 필요하면 수정하세요'
              : '핵심 키워드만 적어주세요. AI가 풍부한 답변으로 만들어드립니다'}
          </p>
        </div>
      </div>

      {/* 안내 박스 (분석 전) */}
      {!analyzed && (
        <div className="rounded-lg bg-blue-50 p-3">
          <p className="text-xs text-blue-700">
            <strong>사용법:</strong> 각 질문에 핵심 단어나 짧은 메모를 적고, 아래 <strong>&quot;심층 질문 분석&quot;</strong> 버튼을 누르세요.
            AI가 입력한 내용을 바탕으로 마케팅에 바로 사용할 수 있는 답변을 작성합니다.
          </p>
        </div>
      )}

      {aiError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {aiError}
        </div>
      )}

      <div className="space-y-5">
        {deepQuestions.map((q, index) => (
          <div key={q.id} className="space-y-2">
            <Label htmlFor={q.id} className="text-sm font-medium">
              <span className="mr-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-xs text-white">
                {index + 1}
              </span>
              {q.question}
            </Label>
            <Textarea
              id={q.id}
              placeholder={q.placeholder}
              value={q.answer}
              onChange={(e) => { updateAnswer(q.id, e.target.value); setAnalyzed(false); }}
              rows={analyzed ? 4 : 2}
            />
          </div>
        ))}
      </div>

      {/* 심층 질문 분석 버튼 */}
      <div className="flex justify-center pt-2">
        <Button
          onClick={handleAnalyze}
          disabled={aiLoading}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-white hover:from-blue-700 hover:to-indigo-700"
        >
          {analyzed ? '🔄 다시 분석하기' : '✨ 심층 질문 분석'}
        </Button>
        {!hasAnyInput && !analyzed && (
          <p className="ml-3 flex items-center text-xs text-gray-400">
            키워드 없이도 분석 가능 (AI가 제품 정보 기반으로 작성)
          </p>
        )}
      </div>
    </div>
  );
}
