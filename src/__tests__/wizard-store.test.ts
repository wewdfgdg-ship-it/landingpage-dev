import { describe, it, expect, beforeEach } from 'vitest';
import { useWizardStore } from '@/stores/wizard-store';

describe('Wizard Store — Zustand 상태 관리', () => {
  beforeEach(() => {
    useWizardStore.getState().reset();
  });

  describe('스텝 이동', () => {
    it('초기 스텝은 1이다', () => {
      expect(useWizardStore.getState().currentStep).toBe(1);
    });

    it('nextStep()은 스텝을 1 증가시킨다', () => {
      useWizardStore.getState().nextStep();
      expect(useWizardStore.getState().currentStep).toBe(2);
    });

    it('prevStep()은 스텝을 1 감소시킨다', () => {
      useWizardStore.getState().setStep(3);
      useWizardStore.getState().prevStep();
      expect(useWizardStore.getState().currentStep).toBe(2);
    });

    it('스텝 1 미만으로 내려가지 않는다', () => {
      useWizardStore.getState().prevStep();
      expect(useWizardStore.getState().currentStep).toBe(1);
    });

    it('스텝 4 초과로 올라가지 않는다', () => {
      useWizardStore.getState().setStep(4);
      useWizardStore.getState().nextStep();
      expect(useWizardStore.getState().currentStep).toBe(4);
    });
  });

  describe('기본 정보 업데이트', () => {
    it('productName을 업데이트한다', () => {
      useWizardStore.getState().updateBasicInfo('productName', 'AI 마케팅 엔진');
      expect(useWizardStore.getState().basicInfo.productName).toBe('AI 마케팅 엔진');
    });

    it('industry를 업데이트한다', () => {
      useWizardStore.getState().updateBasicInfo('industry', 'saas');
      expect(useWizardStore.getState().basicInfo.industry).toBe('saas');
    });

    it('여러 필드를 순차 업데이트한다', () => {
      const store = useWizardStore.getState();
      store.updateBasicInfo('productName', '테스트');
      store.updateBasicInfo('priceRange', '50,000원');
      store.updateBasicInfo('pageGoal', 'purchase');

      const info = useWizardStore.getState().basicInfo;
      expect(info.productName).toBe('테스트');
      expect(info.priceRange).toBe('50,000원');
      expect(info.pageGoal).toBe('purchase');
    });
  });

  describe('이미지 관리', () => {
    const mockImage = {
      id: 'img-1',
      file: null,
      previewUrl: 'blob://test',
      storageKey: 'uploads/test.jpg',
      uploading: false,
    };

    it('이미지를 추가한다', () => {
      useWizardStore.getState().addImage(mockImage);
      expect(useWizardStore.getState().images).toHaveLength(1);
      expect(useWizardStore.getState().images[0].id).toBe('img-1');
    });

    it('이미지를 제거한다', () => {
      useWizardStore.getState().addImage(mockImage);
      useWizardStore.getState().removeImage('img-1');
      expect(useWizardStore.getState().images).toHaveLength(0);
    });

    it('이미지를 업데이트한다', () => {
      useWizardStore.getState().addImage(mockImage);
      useWizardStore.getState().updateImage('img-1', { uploading: true });
      expect(useWizardStore.getState().images[0].uploading).toBe(true);
    });

    it('존재하지 않는 이미지 제거는 에러 없이 처리된다', () => {
      useWizardStore.getState().removeImage('nonexistent');
      expect(useWizardStore.getState().images).toHaveLength(0);
    });
  });

  describe('심층 질문', () => {
    const questions = [
      { id: 'q1', question: '핵심 차별점은?', answer: '', placeholder: '예: AI 기반 자동화' },
      { id: 'q2', question: '타겟 고객은?', answer: '', placeholder: '예: 스타트업 마케터' },
    ];

    it('질문을 설정한다', () => {
      useWizardStore.getState().setDeepQuestions(questions);
      expect(useWizardStore.getState().deepQuestions).toHaveLength(2);
    });

    it('답변을 업데이트한다', () => {
      useWizardStore.getState().setDeepQuestions(questions);
      useWizardStore.getState().updateAnswer('q1', 'AI가 자동으로 최적화합니다');

      const q = useWizardStore.getState().deepQuestions.find((q) => q.id === 'q1');
      expect(q?.answer).toBe('AI가 자동으로 최적화합니다');
    });

    it('로딩 상태를 토글한다', () => {
      useWizardStore.getState().setQuestionsLoading(true);
      expect(useWizardStore.getState().questionsLoading).toBe(true);

      useWizardStore.getState().setQuestionsLoading(false);
      expect(useWizardStore.getState().questionsLoading).toBe(false);
    });
  });

  describe('품질 점수 계산', () => {
    it('빈 상태면 점수 0이다', () => {
      useWizardStore.getState().calculateScore();
      expect(useWizardStore.getState().qualityScore).toBe(0);
    });

    it('기본 정보만 채우면 최대 30점이다', () => {
      const store = useWizardStore.getState();
      store.updateBasicInfo('productName', 'AI 엔진');
      store.updateBasicInfo('industry', 'saas');
      store.updateBasicInfo('priceRange', '50,000원');
      store.updateBasicInfo('pageGoal', 'purchase');
      store.updateBasicInfo('targetAudience', '마케터');

      useWizardStore.getState().calculateScore();
      const { scoreBreakdown } = useWizardStore.getState();
      expect(scoreBreakdown.basicInfo).toBe(30);
    });

    it('이미지 1장이면 10점이다', () => {
      useWizardStore.getState().addImage({
        id: 'img-1', file: null, previewUrl: '', storageKey: 'key1', uploading: false,
      });
      useWizardStore.getState().calculateScore();
      expect(useWizardStore.getState().scoreBreakdown.images).toBe(10);
    });

    it('이미지 3장이면 20점이다', () => {
      for (let i = 1; i <= 3; i++) {
        useWizardStore.getState().addImage({
          id: `img-${i}`, file: null, previewUrl: '', storageKey: `key${i}`, uploading: false,
        });
      }
      useWizardStore.getState().calculateScore();
      expect(useWizardStore.getState().scoreBreakdown.images).toBe(20);
    });

    it('심층 답변 비율에 따라 점수가 계산된다', () => {
      useWizardStore.getState().setDeepQuestions([
        { id: 'q1', question: '질문1', answer: '', placeholder: '' },
        { id: 'q2', question: '질문2', answer: '', placeholder: '' },
      ]);
      // 1개만 충분히 답변 (10자 이상)
      useWizardStore.getState().updateAnswer('q1', '이것은 충분히 긴 답변입니다');

      useWizardStore.getState().calculateScore();
      expect(useWizardStore.getState().scoreBreakdown.deepAnswers).toBe(25); // 50%
    });

    it('전체 점수는 세 영역의 합이다', () => {
      const store = useWizardStore.getState();
      store.updateBasicInfo('productName', 'Test');
      store.addImage({ id: 'img-1', file: null, previewUrl: '', storageKey: 'k', uploading: false });

      useWizardStore.getState().calculateScore();
      const { qualityScore, scoreBreakdown } = useWizardStore.getState();
      expect(qualityScore).toBe(
        scoreBreakdown.basicInfo + scoreBreakdown.images + scoreBreakdown.deepAnswers,
      );
    });
  });

  describe('초기화', () => {
    it('reset()으로 모든 상태를 초기화한다', () => {
      const store = useWizardStore.getState();
      store.updateBasicInfo('productName', '테스트');
      store.setStep(3);
      store.setSubmitting(true);

      useWizardStore.getState().reset();

      const state = useWizardStore.getState();
      expect(state.currentStep).toBe(1);
      expect(state.basicInfo.productName).toBe('');
      expect(state.submitting).toBe(false);
    });
  });
});
