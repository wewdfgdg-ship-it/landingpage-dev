'use client';

import { useWizardStore, type Industry, type PageGoal } from '@/stores/wizard-store';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const INDUSTRY_OPTIONS: { value: Industry; label: string }[] = [
  { value: 'beauty', label: '뷰티 / 화장품' },
  { value: 'food', label: '식품 / F&B' },
  { value: 'electronics', label: '전자기기 / 가전' },
  { value: 'fashion', label: '패션 / 의류' },
  { value: 'living', label: '리빙 / 생활용품' },
  { value: 'saas', label: 'SaaS / 소프트웨어' },
  { value: 'education', label: '교육 / 강의' },
  { value: 'b2b', label: 'B2B / 기업서비스' },
  { value: 'ecommerce', label: '이커머스 / 쇼핑몰' },
  { value: 'health', label: '건강 / 의료' },
  { value: 'finance', label: '금융 / 보험' },
  { value: 'lifestyle', label: '라이프스타일' },
  { value: 'other', label: '기타' },
];

const GOAL_OPTIONS: { value: PageGoal; label: string }[] = [
  { value: 'purchase', label: '구매 전환' },
  { value: 'signup', label: '회원가입' },
  { value: 'inquiry', label: '문의 / 상담 신청' },
  { value: 'download', label: '다운로드' },
  { value: 'registration', label: '이벤트 등록' },
  { value: 'newsletter', label: '뉴스레터 구독' },
];

export function StepBasicInfo(): React.ReactElement {
  const { basicInfo, updateBasicInfo } = useWizardStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">기본 정보</h2>
        <p className="mt-1 text-sm text-gray-500">
          제품/서비스에 대한 기본 정보를 입력해주세요
        </p>
      </div>

      <div className="space-y-4">
        {/* 제품명 */}
        <div className="space-y-2">
          <Label htmlFor="productName">
            제품/서비스명 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="productName"
            placeholder="예: 스마트 다이어트 쉐이크"
            value={basicInfo.productName}
            onChange={(e) => updateBasicInfo('productName', e.target.value)}
          />
        </div>

        {/* 업종 */}
        <div className="space-y-2">
          <Label>
            업종 <span className="text-red-500">*</span>
          </Label>
          <Select
            value={basicInfo.industry}
            onValueChange={(val) => updateBasicInfo('industry', val as string)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="업종을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 가격대 */}
        <div className="space-y-2">
          <Label htmlFor="priceRange">
            가격대 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="priceRange"
            placeholder="예: 39,900원, 월 9,900원, 무료체험 후 결제"
            value={basicInfo.priceRange}
            onChange={(e) => updateBasicInfo('priceRange', e.target.value)}
          />
        </div>

        {/* 페이지 목표 */}
        <div className="space-y-2">
          <Label>
            페이지 목표 <span className="text-red-500">*</span>
          </Label>
          <Select
            value={basicInfo.pageGoal}
            onValueChange={(val) => updateBasicInfo('pageGoal', val as string)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="전환 목표를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {GOAL_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 타겟 고객 */}
        <div className="space-y-2">
          <Label htmlFor="targetAudience">타겟 고객</Label>
          <Textarea
            id="targetAudience"
            placeholder="예: 30-40대 직장인 여성, 다이어트에 관심 있지만 시간이 부족한 사람"
            value={basicInfo.targetAudience}
            onChange={(e) => updateBasicInfo('targetAudience', e.target.value)}
            rows={3}
          />
        </div>

        {/* 경쟁사 URL */}
        <div className="space-y-2">
          <Label htmlFor="competitorUrl">경쟁사/참고 URL</Label>
          <Input
            id="competitorUrl"
            type="url"
            placeholder="https://..."
            value={basicInfo.competitorUrl}
            onChange={(e) => updateBasicInfo('competitorUrl', e.target.value)}
          />
          <p className="text-xs text-gray-400">
            참고할 만한 경쟁사 랜딩페이지가 있다면 입력해주세요
          </p>
        </div>
      </div>
    </div>
  );
}
