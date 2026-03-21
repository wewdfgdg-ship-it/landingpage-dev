'use client';

import { useRouter } from 'next/navigation';
import { useWizardStore, type WizardState, type WizardActions } from '@/stores/wizard-store';
import { Button } from '@/components/ui/button';
import { StepBasicInfo } from '@/components/wizard/step-basic-info';
import { StepImageUpload } from '@/components/wizard/step-image-upload';
import { StepDeepQuestions } from '@/components/wizard/step-deep-questions';
import { StepQualityScore } from '@/components/wizard/step-quality-score';

const STEPS = [
  { number: 1, title: '기본 정보' },
  { number: 2, title: '이미지' },
  { number: 3, title: '심층 질문' },
  { number: 4, title: '품질 확인' },
] as const;

function StepIndicator({
  current,
}: {
  current: number;
}): React.ReactElement {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, idx) => (
        <div key={step.number} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
              step.number === current
                ? 'bg-gray-900 text-white'
                : step.number < current
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-400'
            }`}
          >
            {step.number < current ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              step.number
            )}
          </div>
          <span
            className={`hidden text-sm sm:inline ${
              step.number === current
                ? 'font-medium text-gray-900'
                : 'text-gray-400'
            }`}
          >
            {step.title}
          </span>
          {idx < STEPS.length - 1 && (
            <div
              className={`h-px w-6 ${
                step.number < current ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function canProceed(step: number, store: WizardState & WizardActions): boolean {
  switch (step) {
    case 1:
      return !!(
        store.basicInfo.productName.trim() &&
        store.basicInfo.industry &&
        store.basicInfo.priceRange.trim() &&
        store.basicInfo.pageGoal
      );
    case 2:
      return true; // 이미지는 선택사항
    case 3:
      return true; // 질문 답변도 선택사항
    case 4:
      return store.qualityScore >= 30; // 최소 30점
    default:
      return false;
  }
}

export default function NewProjectPage(): React.ReactElement {
  const router = useRouter();
  const store = useWizardStore();
  const { currentStep, nextStep, prevStep, submitting, setSubmitting, reset } = store;

  const handleSubmit = async (): Promise<void> => {
    setSubmitting(true);

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: store.basicInfo.productName,
          inputData: {
            basicInfo: store.basicInfo,
            images: store.images
              .filter((img) => img.storageKey)
              .map((img) => ({ storageKey: img.storageKey })),
            deepAnswers: store.deepQuestions.map((q) => ({
              question: q.question,
              answer: q.answer,
            })),
          },
          inputScore: store.qualityScore,
        }),
      });

      if (!res.ok) throw new Error('프로젝트 생성 실패');

      const data = (await res.json()) as { project: { id: string } };
      reset();
      router.push(`/projects/${data.project.id}`);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">새 프로젝트</h1>
        <p className="mt-1 text-sm text-gray-500">
          제품 정보를 입력하면 AI가 최적의 랜딩페이지를 생성합니다
        </p>
      </div>

      {/* 스텝 인디케이터 */}
      <div className="mb-8">
        <StepIndicator current={currentStep} />
      </div>

      {/* 스텝 콘텐츠 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        {currentStep === 1 && <StepBasicInfo />}
        {currentStep === 2 && <StepImageUpload />}
        {currentStep === 3 && <StepDeepQuestions />}
        {currentStep === 4 && <StepQualityScore />}
      </div>

      {/* 네비게이션 */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? (): void => { router.push('/projects'); } : prevStep}
        >
          {currentStep === 1 ? '취소' : '이전'}
        </Button>

        {currentStep < 4 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed(currentStep, store)}
          >
            다음
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={submitting || !canProceed(currentStep, store)}
          >
            {submitting ? '생성 중...' : '프로젝트 생성'}
          </Button>
        )}
      </div>
    </div>
  );
}
