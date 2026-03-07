import Link from 'next/link';
import {
  Zap,
  Brain,
  BarChart3,
  Target,
  Layers,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

// ============================================================
// 마케팅 랜딩페이지 — 공개 (인증 불필요)
// ============================================================

const FEATURES = [
  {
    icon: Brain,
    title: '12단계 AI 엔진',
    description:
      '제품 분석부터 전환 전략, 설득 카피, 레이아웃, 이미지까지 12개 전문 엔진이 순차 실행됩니다.',
  },
  {
    icon: Target,
    title: '전환율 최적화',
    description:
      '심리학 기반 설득 구조, 반론 방어, 신뢰 아키텍처로 높은 전환율을 설계합니다.',
  },
  {
    icon: BarChart3,
    title: '자동 A/B 테스트',
    description:
      '배포 후 자동으로 성과를 측정하고, AI가 진단하여 더 나은 버전을 제안합니다.',
  },
  {
    icon: Layers,
    title: '완전한 랜딩페이지',
    description:
      '전략 → 카피 → 디자인 → 이미지 → HTML 코드까지 한 번에 생성합니다.',
  },
];

const STEPS = [
  { num: '01', title: '제품 정보 입력', desc: '제품명, 업종, 가격, 타겟 고객 등 기본 정보를 입력하세요.' },
  { num: '02', title: 'AI 분석 & 생성', desc: '12개 엔진이 전략 수립부터 이미지 생성까지 자동 처리합니다.' },
  { num: '03', title: '편집 & 배포', desc: '에디터에서 수정하고 원클릭으로 배포하세요.' },
];

const STATS = [
  { value: '12', label: 'AI 엔진' },
  { value: '42', label: '레이아웃 패턴' },
  { value: '10', label: '무드 프리셋' },
  { value: '<3분', label: '생성 시간' },
];

export default function LandingPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <Zap className="h-5 w-5 text-blue-600" />
            마케팅 엔진
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              요금제
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* 히어로 */}
      <section className="relative overflow-hidden px-6 pb-20 pt-24 md:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700">
            <Sparkles className="h-4 w-4" />
            AI가 만드는 고전환 랜딩페이지
          </div>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl">
            입력 한 번으로
            <br />
            <span className="text-blue-600">완성되는 랜딩페이지</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500 md:text-xl">
            제품 정보만 입력하면 전략 수립부터 카피 작성, 디자인, 이미지 생성,
            HTML 코드까지 AI가 모두 처리합니다.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl"
            >
              무료로 시작하기
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-gray-200 px-8 py-3.5 text-base font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              요금제 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 숫자 */}
      <section className="border-y border-gray-100 bg-gray-50 px-6 py-16">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-gray-900 md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 기능 */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              왜 마케팅 엔진인가요?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              단순 빌더가 아닙니다. AI 마케팅 브레인이 전략부터 실행까지 담당합니다.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="rounded-2xl border border-gray-100 p-8 transition-shadow hover:shadow-lg"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    {feat.title}
                  </h3>
                  <p className="leading-relaxed text-gray-500">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 사용 방법 */}
      <section className="bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              3단계로 완성
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.num} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                  {step.num}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gray-900 px-8 py-16 text-center md:px-16">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            지금 무료로 시작하세요
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-gray-400">
            신용카드 없이 무료 플랜으로 바로 시작할 수 있습니다.
            프로젝트 3개, 월 5회 생성이 무료입니다.
          </p>
          <div className="mt-8">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-700"
            >
              무료로 시작하기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              카드 불필요
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              즉시 시작
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              언제든 업그레이드
            </span>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-gray-100 px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Zap className="h-4 w-4" />
            AI 마케팅 엔진
          </div>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/pricing" className="hover:text-gray-600">
              요금제
            </Link>
            <Link href="/login" className="hover:text-gray-600">
              로그인
            </Link>
            <a href="mailto:support@landingengine.kr" className="hover:text-gray-600">
              문의
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
