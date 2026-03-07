// ============================================================
// 이메일 알림 시스템 — Resend REST API (npm 패키지 불필요)
// ============================================================

const RESEND_API_URL = 'https://api.resend.com/emails';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(params: SendEmailParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM ?? 'noreply@landingengine.kr';

  if (!apiKey) {
    // 개발 환경에서는 콘솔 출력만
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(`[EMAIL] To: ${params.to} | Subject: ${params.subject}`);
      return true;
    }
    return false;
  }

  try {
    const res = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: params.to,
        subject: params.subject,
        html: params.html,
      }),
    });

    return res.ok;
  } catch {
    return false;
  }
}

// ============================================================
// 이메일 템플릿
// ============================================================

function baseTemplate(title: string, content: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1f2937;">
  <div style="border-bottom:2px solid #3b82f6;padding-bottom:16px;margin-bottom:24px;">
    <h1 style="font-size:20px;margin:0;color:#1f2937;">자율 주행 마케팅 엔진</h1>
  </div>
  <h2 style="font-size:18px;margin:0 0 16px;color:#1f2937;">${title}</h2>
  ${content}
  <div style="border-top:1px solid #e5e7eb;margin-top:32px;padding-top:16px;font-size:12px;color:#9ca3af;">
    <p>이 메일은 자동 발송되었습니다. 문의사항은 support@landingengine.kr로 연락해주세요.</p>
  </div>
</body></html>`;
}

// ============================================================
// 구독 관련 이메일
// ============================================================

/** 구독 시작 */
export async function sendSubscriptionStarted(
  email: string,
  planName: string,
  periodEnd: Date,
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: `[마케팅 엔진] ${planName} 플랜 구독이 시작되었습니다`,
    html: baseTemplate(
      `${planName} 플랜 구독 시작`,
      `<p style="color:#4b5563;line-height:1.6;">
        구독이 성공적으로 활성화되었습니다.
      </p>
      <div style="background:#f0f9ff;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="margin:0;color:#1e40af;font-weight:600;">구독 기간</p>
        <p style="margin:4px 0 0;color:#3b82f6;">
          오늘 ~ ${periodEnd.toLocaleDateString('ko-KR')}
        </p>
      </div>
      <p style="color:#4b5563;">
        지금 바로 대시보드에서 새로운 기능을 활용해보세요.
      </p>`,
    ),
  });
}

/** 결제 실패 */
export async function sendPaymentFailed(
  email: string,
  planName: string,
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: `[마케팅 엔진] ${planName} 플랜 결제에 실패했습니다`,
    html: baseTemplate(
      '결제 실패 알림',
      `<p style="color:#4b5563;line-height:1.6;">
        ${planName} 플랜의 정기결제가 실패했습니다.
      </p>
      <div style="background:#fef2f2;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="margin:0;color:#991b1b;font-weight:600;">조치 필요</p>
        <p style="margin:4px 0 0;color:#dc2626;">
          7일 이내에 결제 수단을 확인하고 재결제해주세요.
          미처리 시 유예 기간으로 전환됩니다.
        </p>
      </div>`,
    ),
  });
}

/** 구독 만료 예정 */
export async function sendSubscriptionExpiring(
  email: string,
  planName: string,
  expireDate: Date,
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: `[마케팅 엔진] ${planName} 플랜이 곧 만료됩니다`,
    html: baseTemplate(
      '구독 만료 예정',
      `<p style="color:#4b5563;line-height:1.6;">
        ${planName} 플랜 구독이
        <strong>${expireDate.toLocaleDateString('ko-KR')}</strong>에 만료됩니다.
      </p>
      <div style="background:#fffbeb;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="margin:0;color:#92400e;font-weight:600;">안내</p>
        <p style="margin:4px 0 0;color:#b45309;">
          만료 후 무료 플랜으로 전환되며, 일부 기능이 제한됩니다.
          계속 사용하시려면 구독을 갱신해주세요.
        </p>
      </div>`,
    ),
  });
}

/** 구독 해지 완료 */
export async function sendSubscriptionCancelled(
  email: string,
  planName: string,
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: `[마케팅 엔진] ${planName} 플랜 구독이 해지되었습니다`,
    html: baseTemplate(
      '구독 해지 완료',
      `<p style="color:#4b5563;line-height:1.6;">
        ${planName} 플랜 구독이 해지되었습니다.
        무료 플랜으로 전환되었습니다.
      </p>
      <p style="color:#4b5563;">
        언제든 다시 업그레이드하실 수 있습니다.
      </p>`,
    ),
  });
}

// ============================================================
// 사용량 알림 이메일
// ============================================================

/** 사용량 임계치 경고 (80%) */
export async function sendUsageWarning(
  email: string,
  resourceName: string,
  current: number,
  limit: number,
  planName: string,
): Promise<boolean> {
  const percent = Math.round((current / limit) * 100);
  return sendEmail({
    to: email,
    subject: `[마케팅 엔진] ${resourceName} 사용량이 ${percent}%에 도달했습니다`,
    html: baseTemplate(
      `${resourceName} 사용량 경고`,
      `<p style="color:#4b5563;line-height:1.6;">
        현재 ${planName} 플랜의 ${resourceName} 사용량이 한도에 가까워지고 있습니다.
      </p>
      <div style="background:#fef2f2;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="margin:0;font-size:24px;font-weight:700;color:#dc2626;">
          ${current} / ${limit} (${percent}%)
        </p>
        <div style="background:#fee2e2;border-radius:4px;height:8px;margin-top:8px;">
          <div style="background:#ef4444;border-radius:4px;height:8px;width:${percent}%;"></div>
        </div>
      </div>
      <p style="color:#4b5563;">
        한도 초과 시 해당 기능이 제한됩니다. 플랜 업그레이드를 고려해주세요.
      </p>`,
    ),
  });
}

/** 환불 완료 */
export async function sendRefundCompleted(
  email: string,
  amount: number,
  planName: string,
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: `[마케팅 엔진] ${amount.toLocaleString()}원 환불이 완료되었습니다`,
    html: baseTemplate(
      '환불 완료',
      `<p style="color:#4b5563;line-height:1.6;">
        ${planName} 플랜 결제 건에 대한 환불이 완료되었습니다.
      </p>
      <div style="background:#f0fdf4;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="margin:0;color:#166534;font-weight:600;">환불 금액</p>
        <p style="margin:4px 0 0;font-size:24px;font-weight:700;color:#16a34a;">
          ${amount.toLocaleString()}원
        </p>
      </div>
      <p style="color:#4b5563;">
        환불 금액은 결제 수단에 따라 3~7 영업일 내에 반영됩니다.
      </p>`,
    ),
  });
}
