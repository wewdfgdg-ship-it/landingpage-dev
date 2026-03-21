'use client';

import { useEffect } from 'react';
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
          setDeepQuestions(
            questions.map((q) => ({ ...q, answer: '' })),
          );
        }
      } catch {
        // 실패 시 기본 질문 제공
        if (!cancelled) {
          setDeepQuestions([
            {
              id: 'fallback_1',
              question: '이 제품/서비스가 해결하는 핵심 문제는 무엇인가요?',
              answer: '',
              placeholder: '고객이 겪는 구체적인 불편함이나 고충을 설명해주세요',
            },
            {
              id: 'fallback_2',
              question: '경쟁 제품 대비 가장 큰 차별점은 무엇인가요?',
              answer: '',
              placeholder: '다른 제품에는 없는 우리만의 강점을 구체적으로 설명해주세요',
            },
            {
              id: 'fallback_3',
              question: '실제 고객 후기나 성과 데이터가 있나요?',
              answer: '',
              placeholder: '예: 만족도 95%, 재구매율 60%, "인생템이에요" 등',
            },
            {
              id: 'fallback_4',
              question: '제품 구매를 망설이는 고객의 주요 걱정은 무엇인가요?',
              answer: '',
              placeholder: '가격, 효과, 안전성 등 고객이 가장 많이 걱정하는 점',
            },
            {
              id: 'fallback_5',
              question: '브랜드의 핵심 가치나 미션은 무엇인가요?',
              answer: '',
              placeholder: '예: "모든 사람이 건강한 식단을 쉽게 실천할 수 있도록"',
            },
          ]);
        }
      } finally {
        if (!cancelled) {
          setQuestionsLoading(false);
        }
      }
    }

    void loadQuestions();

    return (): void => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetry = (): void => {
    setDeepQuestions([]);
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

  const answeredCount = deepQuestions.filter(
    (q) => q.answer.trim().length >= 10,
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">심층 질문</h2>
          <p className="mt-1 text-sm text-gray-500">
            상세히 답변할수록 더 높은 품질의 랜딩페이지가 생성됩니다
          </p>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
          {answeredCount}/{deepQuestions.length}
        </span>
      </div>

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
