'use client';

import { useCallback, useRef } from 'react';
import Image from 'next/image';
import { useWizardStore, type Industry, type PageGoal, type UploadedImage } from '@/stores/wizard-store';
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
  { value: 'saas', label: 'SaaS / 소프트웨어' },
  { value: 'ecommerce', label: '이커머스 / 쇼핑몰' },
  { value: 'education', label: '교육 / 강의' },
  { value: 'health', label: '건강 / 의료' },
  { value: 'beauty', label: '뷰티 / 화장품' },
  { value: 'food', label: '식품 / F&B' },
  { value: 'finance', label: '금융 / 보험' },
  { value: 'lifestyle', label: '라이프스타일' },
  { value: 'b2b', label: 'B2B / 기업서비스' },
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

function generateId(): string {
  return `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? '업로드 실패');
  }
  const data = (await res.json()) as { storageKey: string };
  return data.storageKey;
}

export function StepBasicInfo(): React.ReactElement {
  const { basicInfo, updateBasicInfo, images, addImage, removeImage, updateImage } = useWizardStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      const remaining = 5 - images.length;
      const filesToAdd = Array.from(files).slice(0, remaining);

      for (const file of filesToAdd) {
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 10 * 1024 * 1024) continue;

        const id = generateId();
        const previewUrl = URL.createObjectURL(file);
        const newImage: UploadedImage = { id, file, previewUrl, storageKey: '', uploading: true };
        addImage(newImage);

        try {
          const storageKey = await uploadFile(file);
          updateImage(id, { storageKey, uploading: false });
        } catch {
          updateImage(id, { uploading: false });
        }
      }
    },
    [images.length, addImage, updateImage],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => { e.preventDefault(); handleFiles(e.dataTransfer.files); },
    [handleFiles],
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">제품 정보</h2>
        <p className="mt-1 text-sm text-gray-500">
          제품 정보와 이미지를 입력하면 AI가 최적의 랜딩페이지를 생성합니다
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

      {/* 구분선 + 이미지 드롭존 */}
      <div
        className="border-t border-gray-200 pt-6"
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('ring-2', 'ring-blue-400', 'ring-offset-2', 'rounded-lg'); }}
        onDragLeave={(e) => { e.currentTarget.classList.remove('ring-2', 'ring-blue-400', 'ring-offset-2', 'rounded-lg'); }}
      >
        <Label>제품 이미지</Label>
        <p className="mt-1 mb-3 text-xs text-gray-400">
          제품 사진을 올리면 랜딩페이지에 직접 사용됩니다 (최대 5장, 선택)
        </p>

        {images.length === 0 ? (
          /* 이미지 없을 때: 큰 드롭 영역 */
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-10 transition-colors hover:border-gray-400 hover:bg-gray-100"
          >
            <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">클릭하거나 이미지를 드래그하세요</p>
              <p className="mt-1 text-xs text-gray-400">PNG, JPG, WEBP (최대 10MB, 5장)</p>
            </div>
          </div>
        ) : (
          /* 이미지 있을 때: 그리드 + 추가 버튼 */
          <div className="grid grid-cols-5 gap-2">
            {images.map((img) => (
              <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                {img.previewUrl ? (
                  <Image src={img.previewUrl} alt="제품 이미지" fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-400">
                    {img.storageKey ? '업로드됨' : '...'}
                  </div>
                )}
                {img.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}
                {!img.uploading && img.storageKey && (
                  <div className="absolute bottom-1 left-1">
                    <span className="rounded-full bg-green-500 px-1.5 py-0.5 text-[10px] text-white">완료</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {images.length < 5 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-gray-400 hover:bg-gray-100"
              >
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span className="mt-1 text-[10px] text-gray-400">{5 - images.length}장 더</span>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>
    </div>
  );
}
