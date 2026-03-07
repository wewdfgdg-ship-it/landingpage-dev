// ============================================================
// PayApp API 연동 라이브러리
// https://www.payapp.kr/dev_center/dev_center01.html
// ============================================================

const PAYAPP_API_URL = 'https://api.payapp.kr/oapi/apiLoad.html';

// 환경변수
function getConfig(): { userId: string; linkKey: string; linkVal: string; feedbackUrl: string } {
  const userId = process.env.PAYAPP_USER_ID;
  const linkKey = process.env.PAYAPP_LINK_KEY;
  const linkVal = process.env.PAYAPP_LINK_VAL;
  const feedbackUrl = process.env.PAYAPP_FEEDBACK_URL;

  if (!userId || !linkKey || !linkVal || !feedbackUrl) {
    throw new Error('PayApp 환경변수 미설정 (PAYAPP_USER_ID, PAYAPP_LINK_KEY, PAYAPP_LINK_VAL, PAYAPP_FEEDBACK_URL)');
  }

  return { userId, linkKey, linkVal, feedbackUrl };
}

// ============================================================
// 타입
// ============================================================

export interface PayAppPaymentRequest {
  goodname: string;    // 상품명
  price: number;       // 결제 금액 (원)
  recvphone: string;   // 수신 휴대폰번호
  var1?: string;       // 임의변수 1 (orgId)
  var2?: string;       // 임의변수 2 (planId)
  memo?: string;       // 메모
}

export interface PayAppPaymentResponse {
  state: number;       // 1=성공
  errorMessage: string;
  mulNo: string;       // 결제 요청번호
  payUrl: string;      // 결제 URL
}

export interface PayAppCancelRequest {
  mulNo: string;       // 결제 요청번호
  cancelmemo: string;  // 취소 사유
  partcancel?: 0 | 1;  // 0=전체, 1=부분
  cancelPrice?: number; // 부분취소 시 금액
}

export interface PayAppCancelResponse {
  state: number;       // 1=성공
  errorMessage: string;
}

export interface PayAppRebillRequest {
  goodname: string;
  price: number;
  recvphone: string;
  rebillCycleType: 'month' | 'week' | 'day';
  rebillCycle: number;         // 주기 (1=매월)
  rebillExpire: string;        // 만료일 YYYYMMDD
  var1?: string;
  var2?: string;
}

export interface PayAppRebillResponse {
  state: number;
  errorMessage: string;
  mulNo: string;
}

/** PayApp 피드백(웹훅)에서 수신하는 파라미터 */
export interface PayAppWebhookPayload {
  pay_state: string;   // 4=결제완료, 8/32=취소요청, 9/64=취소승인
  pay_date: string;    // 결제 승인 일시
  pay_type: string;    // 1=신용카드, 2=휴대전화, 7=가상계좌
  mul_no: string;      // 결제 요청번호
  linkkey: string;     // 검증용
  linkval: string;     // 검증용
  var1?: string;       // orgId
  var2?: string;       // planId
  price?: string;      // 결제 금액
  goodname?: string;   // 상품명
  recvphone?: string;
}

// ============================================================
// API 호출 유틸
// ============================================================

async function callPayApp(params: Record<string, string>): Promise<Record<string, string>> {
  const config = getConfig();
  const body = new URLSearchParams({
    userid: config.userId,
    linkkey: config.linkKey,
    linkval: config.linkVal,
    ...params,
  });

  const res = await fetch(PAYAPP_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error(`PayApp API 오류: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();
  const result: Record<string, string> = {};
  for (const pair of text.split('&')) {
    const [key, val] = pair.split('=');
    if (key) result[decodeURIComponent(key)] = decodeURIComponent(val ?? '');
  }
  return result;
}

// ============================================================
// 결제 요청
// ============================================================

export async function requestPayment(req: PayAppPaymentRequest): Promise<PayAppPaymentResponse> {
  const config = getConfig();

  const params: Record<string, string> = {
    cmd: 'payrequest',
    goodname: req.goodname,
    price: String(req.price),
    recvphone: req.recvphone,
    feedbackurl: config.feedbackUrl,
    currency: 'KRW',
  };
  if (req.var1) params.var1 = req.var1;
  if (req.var2) params.var2 = req.var2;
  if (req.memo) params.memo = req.memo;

  const result = await callPayApp(params);

  return {
    state: Number(result.state ?? 0),
    errorMessage: result.errorMessage ?? '',
    mulNo: result.mul_no ?? '',
    payUrl: result.payurl ?? '',
  };
}

// ============================================================
// 결제 취소
// ============================================================

export async function cancelPayment(req: PayAppCancelRequest): Promise<PayAppCancelResponse> {
  const params: Record<string, string> = {
    cmd: 'paycancel',
    mul_no: req.mulNo,
    cancelmemo: req.cancelmemo,
    partcancel: String(req.partcancel ?? 0),
  };
  if (req.cancelPrice) params.cancelprice = String(req.cancelPrice);

  const result = await callPayApp(params);

  return {
    state: Number(result.state ?? 0),
    errorMessage: result.errorMessage ?? '',
  };
}

// ============================================================
// 정기결제 등록
// ============================================================

export async function registerRebill(req: PayAppRebillRequest): Promise<PayAppRebillResponse> {
  const config = getConfig();

  const params: Record<string, string> = {
    cmd: 'rebillRegist',
    goodname: req.goodname,
    price: String(req.price),
    recvphone: req.recvphone,
    feedbackurl: config.feedbackUrl,
    rebillCycleType: req.rebillCycleType,
    rebillCycle: String(req.rebillCycle),
    rebillExpire: req.rebillExpire,
  };
  if (req.var1) params.var1 = req.var1;
  if (req.var2) params.var2 = req.var2;

  const result = await callPayApp(params);

  return {
    state: Number(result.state ?? 0),
    errorMessage: result.errorMessage ?? '',
    mulNo: result.mul_no ?? '',
  };
}

// ============================================================
// 정기결제 해지
// ============================================================

export async function cancelRebill(mulNo: string): Promise<PayAppCancelResponse> {
  const result = await callPayApp({
    cmd: 'rebillCancel',
    mul_no: mulNo,
  });

  return {
    state: Number(result.state ?? 0),
    errorMessage: result.errorMessage ?? '',
  };
}

// ============================================================
// 웹훅 검증
// ============================================================

export function verifyWebhook(payload: PayAppWebhookPayload): boolean {
  const config = getConfig();
  return payload.linkkey === config.linkKey && payload.linkval === config.linkVal;
}

// 결제 상태 상수
export const PAY_STATE = {
  COMPLETED: '4',        // 결제 완료
  CANCEL_REQUESTED: '8', // 취소 요청 (관리자)
  CANCEL_APPROVED: '9',  // 취소 승인
  CANCEL_REQUESTED_2: '32', // 취소 요청 (사용자)
  CANCEL_APPROVED_2: '64',  // 취소 승인 2
} as const;

export function isPaymentCompleted(payState: string): boolean {
  return payState === PAY_STATE.COMPLETED;
}

export function isCancelled(payState: string): boolean {
  return (
    payState === PAY_STATE.CANCEL_APPROVED ||
    payState === PAY_STATE.CANCEL_APPROVED_2
  );
}
