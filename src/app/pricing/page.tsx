import Link from 'next/link';
import { Zap, Check, ArrowRight } from 'lucide-react';

// ============================================================
// 요금제 페이지 — 공개 (인증 불필요)
// ============================================================

interface PlanCard {
  id: string;
  name: string;
  description: string;
  price: number;
  yearlyPrice: number;
  features: string[];
  highlighted: boolean;
  cta: string;
}

const PLANS: PlanCard[] = [
  {
    id: 'FREE',
    name: '무료',
    description: '랜딩페이지 생성을 체험해보세요',
    price: 0,
    yearlyPrice: 0,
    features: [
      '프로젝트 3개',
      '월 5회 생성',
      '배포 1개',
      'HTML 내보내기',
      '기본 분석 대시보드',
    ],
    highlighted: false,
    cta: '무료로 시작',
  },
  {
    id: 'PRO',
    name: '프로',
    description: '성장하는 비즈니스를 위한 플랜',
    price: 29000,
    yearlyPrice: 24000,
    features: [
      '프로젝트 20개',
      '월 50회 생성',
      '배포 5개',
      'React ZIP 내보내기',
      '커스텀 도메인',
      '고급 분석 대시보드',
      'A/B 테스트',
    ],
    highlighted: true,
    cta: '프로 시작',
  },
  {
    id: 'BUSINESS',
    name: '비즈니스',
    description: '대규모 운영을 위한 엔터프라이즈 플랜',
    price: 79000,
    yearlyPrice: 66000,
    features: [
      '프로젝트 100개',
      '무제한 생성',
      '무제한 배포',
      '모든 내보내기 형식',
      '커스텀 도메인',
      '고급 분석 + AI 자동 진단',
      'A/B 테스트 + 자동 교체',
      '우선 지원',
    ],
    highlighted: false,
    cta: '비즈니스 시작',
  },
];

const FAQ = [
  {
    q: '무료 플랜으로 무엇을 할 수 있나요?',
    a: '프로젝트 3개, 월 5회 생성, HTML 내보내기가 가능합니다. 신용카드 없이 바로 시작할 수 있습니다.',
  },
  {
    q: '언제든 플랜을 변경할 수 있나요?',
    a: '네, 언제든 업그레이드하거나 다운그레이드할 수 있습니다. 다운그레이드는 현재 구독 기간이 끝난 후 적용됩니다.',
  },
  {
    q: '환불이 가능한가요?',
    a: '결제 후 7일 이내 환불이 가능합니다. 관리자에게 문의해주세요.',
  },
  {
    q: '연간 결제 시 할인이 있나요?',
    a: '네, 연간 결제 시 월 기준 약 17% 할인된 가격으로 이용할 수 있습니다.',
  },
];

function formatPrice(price: number): string {
  if (price === 0) return '0';
  return price.toLocaleString('ko-KR');
}

export default function PricingPage(): React.ReactElement {
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
              className="text-sm font-medium text-gray-900"
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

      {/* 헤더 */}
      <section className="px-6 pb-4 pt-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
          심플한 요금제
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-gray-500">
          필요에 맞는 플랜을 선택하세요. 언제든 변경할 수 있습니다.
        </p>
      </section>

      {/* 플랜 카드 */}
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                plan.highlighted
                  ? 'border-blue-600 shadow-xl shadow-blue-600/10'
                  : 'border-gray-200'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                  인기
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price === 0 ? '무료' : `${formatPrice(plan.price)}원`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-sm text-gray-500">/월</span>
                  )}
                </div>
                {plan.yearlyPrice > 0 && (
                  <p className="mt-1 text-sm text-gray-400">
                    연간 결제 시 {formatPrice(plan.yearlyPrice)}원/월
                  </p>
                )}
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    {feat}
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            자주 묻는 질문
          </h2>
          <div className="space-y-6">
            {FAQ.map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <h3 className="font-semibold text-gray-900">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {item.a}
                </p>
              </div>
            ))}
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
            <Link href="/" className="hover:text-gray-600">
              홈
            </Link>
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
