'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

// ============================================================
// 타입
// ============================================================

interface DomainInfo {
  domain: string | null;
  verified: boolean;
  dnsRecords?: { type: string; value: string; status: string }[];
  instructions?: { cname: string; a: string; txt: string } | null;
}

interface ExportPanelProps {
  projectId: string;
  hasGenerated: boolean;
  isDeployed: boolean;
  slug: string | null;
}

// ============================================================
// 컴포넌트
// ============================================================

export function ExportPanel({
  projectId,
  hasGenerated,
  isDeployed,
  slug,
}: ExportPanelProps): React.ReactElement {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [domainInfo, setDomainInfo] = useState<DomainInfo | null>(null);
  const [domainInput, setDomainInput] = useState('');
  const [domainLoading, setDomainLoading] = useState(false);
  const [domainError, setDomainError] = useState('');
  const [domainSuccess, setDomainSuccess] = useState('');

  const fetchDomain = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch(`/api/projects/${projectId}/domain`);
      if (res.ok) {
        const data = (await res.json()) as DomainInfo;
        setDomainInfo(data);
        if (data.domain) setDomainInput(data.domain);
      }
    } catch {
      // 도메인 정보 로딩 실패 — 무시
    }
  }, [projectId]);

  useEffect(() => {
    if (isDeployed) void fetchDomain();
  }, [isDeployed, fetchDomain]);

  const handleDownload = async (format: 'html' | 'react-zip'): Promise<void> => {
    setDownloading(format);
    try {
      const res = await fetch(`/api/projects/${projectId}/export?format=${format}`);
      if (!res.ok) {
        const data = (await res.json()) as { error: string };
        throw new Error(data.error);
      }

      const blob = await res.blob();
      const ext = format === 'html' ? 'html' : 'zip';
      const contentDisposition = res.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+?)"/);
      const filename = filenameMatch?.[1] ?? `landing-page.${ext}`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : '다운로드 실패');
    } finally {
      setDownloading(null);
    }
  };

  const handleDomainSave = async (): Promise<void> => {
    if (!domainInput.trim()) return;
    setDomainLoading(true);
    setDomainError('');
    setDomainSuccess('');

    try {
      const res = await fetch(`/api/projects/${projectId}/domain`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domainInput.trim() }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error: string };
        throw new Error(data.error);
      }

      setDomainSuccess('도메인이 설정되었습니다. DNS 설정 후 검증해주세요.');
      await fetchDomain();
    } catch (err) {
      setDomainError(err instanceof Error ? err.message : '도메인 설정 실패');
    } finally {
      setDomainLoading(false);
    }
  };

  const handleDomainRemove = async (): Promise<void> => {
    setDomainLoading(true);
    setDomainError('');
    try {
      await fetch(`/api/projects/${projectId}/domain`, { method: 'DELETE' });
      setDomainInfo(null);
      setDomainInput('');
      setDomainSuccess('도메인이 제거되었습니다.');
    } catch {
      setDomainError('도메인 제거 실패');
    } finally {
      setDomainLoading(false);
    }
  };

  const handleDomainVerify = async (): Promise<void> => {
    setDomainLoading(true);
    setDomainError('');
    setDomainSuccess('');
    try {
      await fetchDomain();
      if (domainInfo?.verified) {
        setDomainSuccess('DNS 검증 완료!');
      } else {
        setDomainError('DNS 레코드가 아직 반영되지 않았습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setDomainLoading(false);
    }
  };

  if (!hasGenerated) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-gray-200 py-16">
        <p className="text-gray-500">먼저 AI 분석을 실행하세요</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 파일 내보내기 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-bold text-gray-700">파일 내보내기</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* HTML 다운로드 */}
          <div className="rounded-lg border border-gray-100 p-4">
            <div className="mb-3">
              <p className="font-medium text-gray-800">HTML 파일</p>
              <p className="mt-1 text-xs text-gray-500">
                단일 HTML 파일로 다운로드합니다. 브라우저에서 바로 열 수 있습니다.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => handleDownload('html')}
              disabled={downloading !== null}
              className="w-full"
            >
              {downloading === 'html' ? '다운로드 중...' : 'HTML 다운로드'}
            </Button>
          </div>

          {/* React ZIP */}
          <div className="rounded-lg border border-gray-100 p-4">
            <div className="mb-3">
              <p className="font-medium text-gray-800">React 프로젝트</p>
              <p className="mt-1 text-xs text-gray-500">
                Next.js + TypeScript 프로젝트로 내보냅니다. npm install 후 바로 실행 가능합니다.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => handleDownload('react-zip')}
              disabled={downloading !== null}
              className="w-full"
            >
              {downloading === 'react-zip' ? '다운로드 중...' : 'React ZIP 다운로드'}
            </Button>
          </div>
        </div>
      </div>

      {/* 배포 URL */}
      {isDeployed && slug && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-bold text-gray-700">배포 URL</h3>
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
            <code className="flex-1 text-sm text-gray-700">{`${typeof window !== 'undefined' ? window.location.origin : ''}/p/${slug}`}</code>
            <button
              onClick={() => {
                void navigator.clipboard.writeText(`${window.location.origin}/p/${slug}`);
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              복사
            </button>
            <a
              href={`/p/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              열기 ↗
            </a>
          </div>
        </div>
      )}

      {/* 커스텀 도메인 */}
      {isDeployed && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-bold text-gray-700">커스텀 도메인</h3>

          {/* 도메인 입력 */}
          <div className="flex gap-2">
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="example.com"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <Button
              onClick={handleDomainSave}
              disabled={domainLoading || !domainInput.trim()}
            >
              {domainLoading ? '처리 중...' : domainInfo?.domain ? '변경' : '설정'}
            </Button>
            {domainInfo?.domain && (
              <Button variant="outline" onClick={handleDomainRemove} disabled={domainLoading}>
                제거
              </Button>
            )}
          </div>

          {/* 상태 메시지 */}
          {domainError && (
            <p className="mt-2 text-xs text-red-600">{domainError}</p>
          )}
          {domainSuccess && (
            <p className="mt-2 text-xs text-green-600">{domainSuccess}</p>
          )}

          {/* DNS 설정 안내 */}
          {domainInfo?.domain && (
            <div className="mt-4 space-y-3">
              {/* 검증 상태 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex h-2 w-2 rounded-full ${domainInfo.verified ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="text-sm text-gray-600">
                    {domainInfo.verified ? 'DNS 검증 완료' : 'DNS 설정 대기 중'}
                  </span>
                </div>
                {!domainInfo.verified && (
                  <button
                    onClick={handleDomainVerify}
                    disabled={domainLoading}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    검증 확인
                  </button>
                )}
              </div>

              {/* DNS 레코드 */}
              {domainInfo.dnsRecords && domainInfo.dnsRecords.length > 0 && (
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="mb-2 text-xs font-medium text-gray-500">DNS 레코드 상태</p>
                  {domainInfo.dnsRecords.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className={`inline-flex h-1.5 w-1.5 rounded-full ${
                        r.status === 'verified' ? 'bg-green-500'
                          : r.status === 'mismatch' ? 'bg-yellow-500'
                            : 'bg-gray-300'
                      }`} />
                      <span className="font-mono text-gray-600">{r.type}: {r.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 설정 안내 */}
              {!domainInfo.verified && domainInfo.instructions && (
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                  <p className="mb-2 text-xs font-medium text-blue-700">DNS 설정 방법</p>
                  <div className="space-y-1 text-xs text-blue-600">
                    <p>방법 1: <code className="rounded bg-blue-100 px-1">{domainInfo.instructions.cname}</code></p>
                    <p>방법 2: <code className="rounded bg-blue-100 px-1">{domainInfo.instructions.a}</code></p>
                    <p className="mt-2 text-blue-500">{domainInfo.instructions.txt}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
