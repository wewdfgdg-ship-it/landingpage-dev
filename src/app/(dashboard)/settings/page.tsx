'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  User,
  Building2,
  CreditCard,
  Save,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { cn, formatDate, formatCurrency } from '@/lib/utils';

// ============================================================
// 타입
// ============================================================

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

interface OrgInfo {
  id: string;
  name: string;
  plan: string;
  quotaUsed: number;
  quotaLimit: number;
  memberCount: number;
  createdAt: string;
}

interface PlanDetail {
  name: string;
  price: number;
  quotaLimit: number;
  generateLimit: number;
  deployLimit: number;
  features: string[];
}

interface SettingsData {
  user: UserProfile;
  organization: OrgInfo;
  plan: PlanDetail;
}

// ============================================================
// 플랜 뱃지
// ============================================================

const PLAN_VARIANTS: Record<string, 'default' | 'secondary' | 'outline'> = {
  FREE: 'outline',
  PRO: 'default',
  BUSINESS: 'secondary',
};

const PLAN_LABELS: Record<string, string> = {
  FREE: '무료',
  PRO: 'Pro',
  BUSINESS: 'Business',
};

// ============================================================
// 메인 페이지
// ============================================================

export default function SettingsPage(): React.ReactElement {
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 폼 상태
  const [userName, setUserName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingOrg, setSavingOrg] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchSettings = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('설정 정보를 불러올 수 없습니다');
      const json = (await res.json()) as SettingsData;
      setData(json);
      setUserName(json.user.name ?? '');
      setOrgName(json.organization.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  const showSuccess = (msg: string): void => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSaveProfile = async (): Promise<void> => {
    if (!data) return;
    setSavingProfile(true);
    setError(null);
    try {
      const res = await fetch('/api/settings/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName.trim() }),
      });
      if (!res.ok) throw new Error('프로필 저장 실패');
      setData({
        ...data,
        user: { ...data.user, name: userName.trim() },
      });
      showSuccess('프로필이 저장되었습니다');
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveOrg = async (): Promise<void> => {
    if (!data) return;
    setSavingOrg(true);
    setError(null);
    try {
      const res = await fetch('/api/settings/organization', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: orgName.trim() }),
      });
      if (!res.ok) throw new Error('조직 정보 저장 실패');
      setData({
        ...data,
        organization: { ...data.organization, name: orgName.trim() },
      });
      showSuccess('조직 정보가 저장되었습니다');
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장 실패');
    } finally {
      setSavingOrg(false);
    }
  };

  // 로딩 스켈레톤
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // 에러 상태
  if (!data) {
    return (
      <div className="mx-auto max-w-3xl">
        <ErrorState
          message={error ?? '설정 정보를 불러올 수 없습니다'}
          onRetry={() => {
            setLoading(true);
            setError(null);
            void fetchSettings();
          }}
        />
      </div>
    );
  }

  const profileDirty = userName.trim() !== (data.user.name ?? '');
  const orgDirty = orgName.trim() !== data.organization.name;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">설정</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          계정과 워크스페이스를 관리하세요
        </p>
      </div>

      {/* 상태 메시지 */}
      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMsg}
        </div>
      )}

      {/* 탭 */}
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4" />
            프로필
          </TabsTrigger>
          <TabsTrigger value="organization">
            <Building2 className="h-4 w-4" />
            조직
          </TabsTrigger>
          <TabsTrigger value="plan">
            <CreditCard className="h-4 w-4" />
            플랜
          </TabsTrigger>
        </TabsList>

        {/* 프로필 탭 */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>프로필 정보</CardTitle>
              <CardDescription>
                다른 팀원에게 표시되는 기본 정보입니다
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  value={data.user.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  이메일은 변경할 수 없습니다
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="이름을 입력하세요"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => void handleSaveProfile()}
                disabled={!profileDirty || savingProfile}
              >
                {savingProfile ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-1.5 h-4 w-4" />
                )}
                저장
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 조직 탭 */}
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>워크스페이스</CardTitle>
              <CardDescription>
                조직 정보와 사용량을 확인하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">워크스페이스 이름</Label>
                <Input
                  id="orgName"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="워크스페이스 이름"
                />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  label="멤버 수"
                  value={`${data.organization.memberCount}명`}
                />
                <InfoItem
                  label="프로젝트"
                  value={`${data.organization.quotaUsed} / ${data.organization.quotaLimit}`}
                />
                <InfoItem
                  label="현재 플랜"
                  value={PLAN_LABELS[data.organization.plan] ?? data.organization.plan}
                />
                <InfoItem
                  label="생성일"
                  value={formatDate(data.organization.createdAt)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => void handleSaveOrg()}
                disabled={!orgDirty || savingOrg}
              >
                {savingOrg ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-1.5 h-4 w-4" />
                )}
                저장
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* 플랜 탭 */}
        <TabsContent value="plan">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                현재 플랜
                <Badge variant={PLAN_VARIANTS[data.organization.plan] ?? 'outline'}>
                  {data.plan.name}
                </Badge>
              </CardTitle>
              <CardDescription>
                {data.plan.price === 0
                  ? '무료 플랜을 사용 중입니다'
                  : `월 ${formatCurrency(data.plan.price)}의 유료 플랜을 사용 중입니다`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 사용량 요약 */}
              <div className="grid grid-cols-3 gap-4">
                <UsageItem
                  label="프로젝트"
                  current={data.organization.quotaUsed}
                  limit={data.plan.quotaLimit}
                />
                <UsageItem
                  label="월 생성"
                  current={0}
                  limit={data.plan.generateLimit}
                />
                <UsageItem
                  label="배포"
                  current={0}
                  limit={data.plan.deployLimit}
                />
              </div>

              <Separator />

              {/* 플랜 기능 */}
              <div>
                <h4 className="mb-2 text-sm font-medium">포함된 기능</h4>
                <ul className="space-y-1.5">
                  {data.plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <svg
                        className="h-4 w-4 shrink-0 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => {
                  globalThis.location.href = '/billing';
                }}
              >
                플랜 변경
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================
// 서브 컴포넌트
// ============================================================

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.ReactElement {
  return (
    <div className="rounded-lg border border-border/50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}

function UsageItem({
  label,
  current,
  limit,
}: {
  label: string;
  current: number;
  limit: number;
}): React.ReactElement {
  const isUnlimited = limit === -1;
  const percent = isUnlimited ? 0 : Math.min((current / Math.max(limit, 1)) * 100, 100);
  const isNearLimit = !isUnlimited && percent >= 80;

  return (
    <div className="rounded-lg border border-border/50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn('mt-0.5 text-sm font-bold', isNearLimit && 'text-destructive')}>
        {current}
        {isUnlimited ? '' : ` / ${limit}`}
      </p>
      {!isUnlimited && (
        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              isNearLimit ? 'bg-destructive' : 'bg-primary',
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
      {isUnlimited && (
        <p className="mt-1 text-xs text-muted-foreground">무제한</p>
      )}
    </div>
  );
}

