import { NextResponse } from 'next/server';
import { collectEvent } from '@/engine/12-learning-loop';
import type { TrackingEvent, TrackingEventType } from '@/engine/12-learning-loop/types';

// ============================================================
// 트래킹 이벤트 수집 API — 인증 불필요 (공개 랜딩페이지에서 호출)
// POST /api/track
// ============================================================

const VALID_EVENTS: TrackingEventType[] = [
  'page_view',
  'scroll_depth',
  'section_view',
  'section_dwell',
  'cta_click',
  'conversion',
  'bounce',
];

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();

    // 기본 검증
    if (!body.projectId || !body.eventType || !body.sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!VALID_EVENTS.includes(body.eventType)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
    }

    const event: TrackingEvent = {
      projectId: body.projectId,
      versionId: body.versionId,
      eventType: body.eventType,
      payload: {
        sectionId: body.payload?.sectionId,
        sectionOrder: body.payload?.sectionOrder,
        scrollPercent: body.payload?.scrollPercent,
        dwellTimeMs: body.payload?.dwellTimeMs,
        ctaLabel: body.payload?.ctaLabel,
        referrer: body.payload?.referrer,
        device: body.payload?.device,
        timestamp: body.payload?.timestamp ?? Date.now(),
      },
      sessionId: body.sessionId,
    };

    await collectEvent(event);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
