// ============================================================
// Learning Loop ⑫ — 타입 정의
// A/B 테스트 + 자동 최적화 + 진단 시스템
// ============================================================

// ---------- 트래킹 이벤트 ----------

export type TrackingEventType =
  | 'page_view'
  | 'scroll_depth'
  | 'section_view'
  | 'section_dwell'
  | 'cta_click'
  | 'conversion'
  | 'bounce';

export interface TrackingEvent {
  projectId: string;
  versionId?: string;
  eventType: TrackingEventType;
  payload: {
    sectionId?: string;
    sectionOrder?: number;
    scrollPercent?: number;
    dwellTimeMs?: number;
    ctaLabel?: string;
    referrer?: string;
    device?: 'mobile' | 'desktop' | 'tablet';
    timestamp: number;
  };
  sessionId: string;
}

// ---------- 일일 분석 ----------

export interface DailyMetrics {
  totalVisits: number;
  uniqueVisitors: number;
  totalConversions: number;
  conversionRate: number;
  avgScrollDepth: number;
  avgTimeOnPage: number;
  bounceRate: number;
  sourceBreakdown: Record<string, number>;
  deviceBreakdown: Record<string, number>;
}

export interface SectionMetrics {
  sectionId: string;
  sectionOrder: number;
  impressions: number;
  avgDwellTime: number;
  exitRate: number;
  ctaClicks: number;
}

// ---------- 진단 ----------

export type DiagnosisType =
  | 'hero_weak'
  | 'section_dropout'
  | 'cta_ignored'
  | 'scroll_cliff'
  | 'mobile_gap'
  | 'bounce_high'
  | 'dwell_low';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Diagnosis {
  type: DiagnosisType;
  severity: Severity;
  details: {
    metric: string;
    currentValue: number;
    threshold: number;
    affectedSection?: string;
    message: string;
  };
}

// ---------- 처방 ----------

export interface Prescription {
  level: 1 | 2 | 3;
  actions: PrescriptionAction[];
}

export interface PrescriptionAction {
  type: 'copy_tweak' | 'layout_swap' | 'section_reorder' | 'section_replace' | 'full_regenerate';
  target?: string;
  description: string;
  expectedImprovement: number;
}

// ---------- A/B 테스트 ----------

export interface ABTestConfig {
  projectId: string;
  optimizationLevel: 1 | 2 | 3;
  targetMetric: string;
  minSampleSize: number;
  trafficSplit: number;
}

export interface ABTestResult {
  testId: string;
  status: 'running' | 'concluded' | 'cancelled';
  controlRate: number;
  variantRate: number;
  winner?: 'control' | 'variant';
  confidence: number;
  sampleSize: { control: number; variant: number };
}

// ---------- 승리 패턴 ----------

export interface WinningPatternData {
  patternType: string;
  patternData: Record<string, unknown>;
  winRate: number;
  sampleSize: number;
  improvement: number;
}

// ---------- 엔진 출력 ----------

export interface LearningLoopOutput {
  diagnoses: Diagnosis[];
  prescriptions: Prescription[];
  activeTests: ABTestResult[];
  winningPatterns: WinningPatternData[];
}
