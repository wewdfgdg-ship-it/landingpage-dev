import { create } from 'zustand';

// ============================================================
// 타입 정의
// ============================================================

export type Industry =
  | 'saas'
  | 'ecommerce'
  | 'education'
  | 'health'
  | 'beauty'
  | 'food'
  | 'finance'
  | 'lifestyle'
  | 'b2b'
  | 'other';

export type PageGoal =
  | 'purchase'
  | 'signup'
  | 'inquiry'
  | 'download'
  | 'registration'
  | 'newsletter';

export interface BasicInfo {
  productName: string;
  industry: Industry | '';
  priceRange: string;
  pageGoal: PageGoal | '';
  targetAudience: string;
  competitorUrl: string;
}

export interface UploadedImage {
  id: string;
  file: File | null;
  previewUrl: string;
  storageKey: string;
  uploading: boolean;
}

export interface DeepQuestion {
  id: string;
  question: string;
  answer: string;
  placeholder: string;
}

export interface WizardState {
  // 현재 스텝
  currentStep: number;

  // Step 1: 기본 정보
  basicInfo: BasicInfo;

  // Step 2: 이미지
  images: UploadedImage[];

  // Step 3: AI 심층 질문
  deepQuestions: DeepQuestion[];
  questionsLoading: boolean;

  // Step 4: 품질 점수
  qualityScore: number;
  scoreBreakdown: {
    basicInfo: number;
    images: number;
    deepAnswers: number;
  };

  // 제출 상태
  submitting: boolean;
}

export interface WizardActions {
  // 스텝 이동
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Step 1
  updateBasicInfo: (field: keyof BasicInfo, value: string) => void;

  // Step 2
  addImage: (image: UploadedImage) => void;
  removeImage: (id: string) => void;
  updateImage: (id: string, updates: Partial<UploadedImage>) => void;

  // Step 3
  setDeepQuestions: (questions: DeepQuestion[]) => void;
  updateAnswer: (id: string, answer: string) => void;
  setQuestionsLoading: (loading: boolean) => void;

  // Step 4
  calculateScore: () => void;

  // 제출
  setSubmitting: (submitting: boolean) => void;

  // 초기화
  reset: () => void;
}

// ============================================================
// 초기값
// ============================================================

const INITIAL_BASIC_INFO: BasicInfo = {
  productName: '',
  industry: '',
  priceRange: '',
  pageGoal: '',
  targetAudience: '',
  competitorUrl: '',
};

const INITIAL_STATE: WizardState = {
  currentStep: 1,
  basicInfo: INITIAL_BASIC_INFO,
  images: [],
  deepQuestions: [],
  questionsLoading: false,
  qualityScore: 0,
  scoreBreakdown: { basicInfo: 0, images: 0, deepAnswers: 0 },
  submitting: false,
};

// ============================================================
// 품질 점수 계산
// ============================================================

function calcBasicInfoScore(info: BasicInfo): number {
  let score = 0;
  if (info.productName.trim()) score += 8;
  if (info.industry) score += 6;
  if (info.priceRange.trim()) score += 6;
  if (info.pageGoal) score += 6;
  if (info.targetAudience.trim()) score += 4;
  return score; // max 30
}

function calcImageScore(images: UploadedImage[]): number {
  const uploaded = images.filter((img) => img.storageKey).length;
  if (uploaded === 0) return 0;
  if (uploaded === 1) return 10;
  if (uploaded === 2) return 15;
  return 20; // max 20 (3장 이상)
}

function calcDeepAnswerScore(questions: DeepQuestion[]): number {
  if (questions.length === 0) return 0;
  const answered = questions.filter((q) => q.answer.trim().length >= 10).length;
  const ratio = answered / questions.length;
  return Math.round(ratio * 50); // max 50
}

// ============================================================
// 스토어
// ============================================================

export const useWizardStore = create<WizardState & WizardActions>((set, get) => ({
  ...INITIAL_STATE,

  setStep: (step): void => set({ currentStep: step }),
  nextStep: (): void => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 4) })),
  prevStep: (): void => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

  updateBasicInfo: (field, value): void =>
    set((s) => ({
      basicInfo: { ...s.basicInfo, [field]: value },
    })),

  addImage: (image): void => set((s) => ({ images: [...s.images, image] })),
  removeImage: (id): void => set((s) => ({ images: s.images.filter((img) => img.id !== id) })),
  updateImage: (id, updates): void =>
    set((s) => ({
      images: s.images.map((img) => (img.id === id ? { ...img, ...updates } : img)),
    })),

  setDeepQuestions: (questions): void => set({ deepQuestions: questions }),
  updateAnswer: (id, answer): void =>
    set((s) => ({
      deepQuestions: s.deepQuestions.map((q) => (q.id === id ? { ...q, answer } : q)),
    })),
  setQuestionsLoading: (loading): void => set({ questionsLoading: loading }),

  calculateScore: (): void => {
    const { basicInfo, images, deepQuestions } = get();
    const bi = calcBasicInfoScore(basicInfo);
    const img = calcImageScore(images);
    const da = calcDeepAnswerScore(deepQuestions);
    set({
      qualityScore: bi + img + da,
      scoreBreakdown: { basicInfo: bi, images: img, deepAnswers: da },
    });
  },

  setSubmitting: (submitting): void => set({ submitting }),

  reset: (): void => set(INITIAL_STATE),
}));
