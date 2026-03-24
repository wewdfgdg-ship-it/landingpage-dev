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


export function StepDeepQuestions(): React.ReactElement {
  const {
    basicInfo,
    deepQuestions,
    questionsLoading,
    setDeepQuestions,
    updateAnswer,
    setQuestionsLoading,
  } = useWizardStore();

  const [aiAnswerLoading, setAiAnswerLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [autoFillDone, setAutoFillDone] = useState(false);

  // 질문 로드 + AI 답변 자동 생성
  useEffect(() => {
    if (deepQuestions.length > 0) return;

    let cancelled = false;

    async function loadQuestionsAndAutoFill(): Promise<void> {
      setQuestionsLoading(true);

      // 1. 질문 로드
      let questions: { id: string; question: string; placeholder: string }[];
      try {
        questions = await fetchDeepQuestions({
          productName: basicInfo.productName,
          industry: basicInfo.industry as string,
          pageGoal: basicInfo.pageGoal as string,
        });
      } catch {
        questions = [
          { id: 'fallback_1', question: '이 제품/서비스가 해결하는 핵심 문제는 무엇인가요?', placeholder: '고객이 겪는 구체적인 불편함이나 고충을 설명해주세요' },
          { id: 'fallback_2', question: '경쟁 제품 대비 가장 큰 차별점은 무엇인가요?', placeholder: '다른 제품에는 없는 우리만의 강점을 구체적으로 설명해주세요' },
          { id: 'fallback_3', question: '실제 고객 후기나 성과 데이터가 있나요?', placeholder: '예: 만족도 95%, 재구매율 60%, "인생템이에요" 등' },
          { id: 'fallback_4', question: '제품 구매를 망설이는 고객의 주요 걱정은 무엇인가요?', placeholder: '가격, 효과, 안전성 등 고객이 가장 많이 걱정하는 점' },
          { id: 'fallback_5', question: '브랜드의 핵심 가치나 미션은 무엇인가요?', placeholder: '예: "모든 사람이 건강한 식단을 쉽게 실천할 수 있도록"' },
        ];
      }

      if (cancelled) return;

      const questionsWithAnswer = questions.map((q) => ({ ...q, answer: '' }));
      setDeepQuestions(questionsWithAnswer);
      setQuestionsLoading(false);

      // 2. AI 답변 자동 생성
      setAiAnswerLoading(true);
      try {
        const res = await fetch('/api/wizard/answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productName: basicInfo.productName,
            industry: basicInfo.industry as string,
            pageGoal: basicInfo.pageGoal as string,
            targetAudience: basicInfo.targetAudience,
            priceRange: basicInfo.priceRange,
            questions: questions.map((q) => ({ id: q.id, question: q.question })),
          }),
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({})) as { error?: string; detail?: string };
          throw new Error(errBody.detail ?? errBody.error ?? `HTTP ${res.status}`);
        }

        const data = (await res.json()) as { answers: { id: string; answer: string }[] };
        if (data.answers && Array.isArray(data.answers) && !cancelled) {
          for (const a of data.answers) {
            updateAnswer(a.id, a.answer);
          }
          setAutoFillDone(true);
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : String(err);
          setAiError(`AI 답변 자동 생성 실패: ${msg}`);
        }
      } finally {
        if (!cancelled) {
          setAiAnswerLoading(false);
        }
      }
    }

    void loadQuestionsAndAutoFill();

    return (): void => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetry = (): void => {
    setDeepQuestions([]);
  };

  const handleAiAutoFill = async (): Promise<void> => {
    setAiAnswerLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/wizard/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: basicInfo.productName,
          industry: basicInfo.industry as string,
          pageGoal: basicInfo.pageGoal as string,
          targetAudience: basicInfo.targetAudience,
          priceRange: basicInfo.priceRange,
          questions: deepQuestions.map((q) => ({ id: q.id, question: q.question })),
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({})) as { error?: string; detail?: string };
        throw new Error(errBody.detail ?? errBody.error ?? `HTTP ${res.status}`);
      }

      const data = (await res.json()) as { answers: { id: string; answer: string }[] };

      if (!data.answers || !Array.isArray(data.answers)) {
        throw new Error('응답 형식 오류');
      }

      for (const a of data.answers) {
        updateAnswer(a.id, a.answer);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setAiError(`AI 답변 생성 실패: ${msg}`);
    } finally {
      setAiAnswerLoading(false);
    }
  };

  if (questionsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">심층 질문</h2>
          <p className="mt-1 text-sm text-gray-500">
            AI가 맞춤 질문을 생성하고 있습니다...
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
          <p className="text-sm text-gray-500">질문 생성 중...</p>
        </div>
      </div>
    );
  }

  // 질문은 로드됐지만 AI 답변 자동 생성 중
  if (aiAnswerLoading && !autoFillDone) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">심층 질문</h2>
          <p className="mt-1 text-sm text-gray-500">
            제품 정보를 기반으로 AI가 답변을 작성하고 있습니다...
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-sm text-blue-600 font-medium">AI 답변 생성 중...</p>
          <p className="text-xs text-gray-400">약 10~20초 소요됩니다</p>
        </div>
      </div>
    );
  }

  const answeredCount = deepQuestions.filter(
    (q) => q.answer.trim().length >= 10,
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">심층 질문</h2>
          <p className="mt-1 text-sm text-gray-500">
            AI가 작성한 답변을 검토하고, 필요하면 직접 수정하세요
          </p>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
          {answeredCount}/{deepQuestions.length}
        </span>
      </div>

      {/* AI 자동 답변 버튼 */}
      <div className="flex gap-2">
        <Button
          onClick={handleAiAutoFill}
          disabled={aiAnswerLoading || deepQuestions.length === 0}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
        >
          {aiAnswerLoading ? (
            <>
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              AI 답변 생성 중...
            </>
          ) : (
            '✨ AI 답변 재생성'
          )}
        </Button>
        <p className="flex items-center text-xs text-gray-400">
          마음에 안 들면 AI가 다시 작성합니다
        </p>
      </div>

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
              onChange={(e) => updateAnswer(q.id, e.target.value)}
              rows={3}
            />
            {q.answer.trim().length > 0 && q.answer.trim().length < 10 && (
              <p className="text-xs text-amber-600">
                10자 이상 작성하면 점수에 반영됩니다 ({q.answer.trim().length}/10)
              </p>
            )}
          </div>
        ))}
      </div>

      {deepQuestions.some((q) => q.id.startsWith('fallback_')) && (
        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={handleRetry}>
            AI 맞춤 질문 다시 시도
          </Button>
        </div>
      )}
    </div>
  );
}
