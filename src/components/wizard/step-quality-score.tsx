'use client';

import { useEffect } from 'react';
import { useWizardStore } from '@/stores/wizard-store';

function ScoreRing({
  score,
  size = 120,
}: {
  score: number;
  size?: number;
}): React.ReactElement {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80
      ? 'text-green-500'
      : score >= 50
        ? 'text-amber-500'
        : 'text-red-400';

  const label = score >= 80 ? '우수' : score >= 50 ? '보통' : '부족';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={10}
          className="text-gray-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={10}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${color} transition-all duration-700 ease-out`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-gray-900">{score}</span>
        <span className={`text-xs font-medium ${color}`}>{label}</span>
      </div>
    </div>
  );
}

function BreakdownBar({
  label,
  score,
  maxScore,
}: {
  label: string;
  score: number;
  maxScore: number;
}): React.ReactElement {
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium text-gray-900">
          {score}/{maxScore}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gray-900 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function StepQualityScore(): React.ReactElement {
  const { qualityScore, scoreBreakdown, calculateScore, basicInfo, images, deepQuestions } =
    useWizardStore();

  useEffect(() => {
    calculateScore();
  }, [calculateScore, basicInfo, images, deepQuestions]);

  const tips: string[] = [];

  if (scoreBreakdown.basicInfo < 30) {
    if (!basicInfo.productName.trim()) tips.push('제품명을 입력하세요');
    if (!basicInfo.industry) tips.push('업종을 선택하세요');
    if (!basicInfo.priceRange.trim()) tips.push('가격대를 입력하세요');
    if (!basicInfo.pageGoal) tips.push('페이지 목표를 선택하세요');
    if (!basicInfo.targetAudience.trim()) tips.push('타겟 고객을 설명하세요');
  }

  if (scoreBreakdown.images < 20) {
    const uploaded = images.filter((img) => img.storageKey).length;
    if (uploaded < 3) tips.push(`이미지를 ${3 - uploaded}장 더 업로드하세요`);
  }

  if (scoreBreakdown.deepAnswers < 50) {
    const answered = deepQuestions.filter((q) => q.answer.trim().length >= 10).length;
    const total = deepQuestions.length;
    if (answered < total) {
      tips.push(`심층 질문 ${total - answered}개를 더 답변하세요`);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">입력 품질 점수</h2>
        <p className="mt-1 text-sm text-gray-500">
          점수가 높을수록 더 높은 품질의 랜딩페이지가 생성됩니다
        </p>
      </div>

      {/* 메인 스코어 */}
      <div className="flex justify-center py-4">
        <ScoreRing score={qualityScore} />
      </div>

      {/* 점수 분해 */}
      <div className="space-y-3 rounded-lg border border-gray-200 p-4">
        <BreakdownBar
          label="기본 정보"
          score={scoreBreakdown.basicInfo}
          maxScore={30}
        />
        <BreakdownBar
          label="제품 이미지"
          score={scoreBreakdown.images}
          maxScore={20}
        />
        <BreakdownBar
          label="심층 답변"
          score={scoreBreakdown.deepAnswers}
          maxScore={50}
        />
      </div>

      {/* 개선 팁 */}
      {tips.length > 0 && (
        <div className="rounded-lg bg-amber-50 p-4">
          <h3 className="mb-2 text-sm font-semibold text-amber-800">
            점수를 높이려면
          </h3>
          <ul className="space-y-1">
            {tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-amber-700">
                <span className="mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 결과 안내 */}
      {qualityScore >= 50 && (
        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm text-green-700">
            {qualityScore >= 80
              ? '훌륭합니다! 최상의 품질로 랜딩페이지를 생성할 수 있습니다.'
              : '충분한 정보가 수집되었습니다. 생성을 시작할 수 있습니다.'}
          </p>
        </div>
      )}
    </div>
  );
}
