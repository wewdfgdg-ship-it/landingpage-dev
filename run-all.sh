#!/bin/bash
# 렌더러 v2 세션 11~18 자동 실행 (worktree 병렬)
# 사용법: chmod +x run-all.sh && ./run-all.sh

REPO_DIR="c:/Users/tip12/landingpage-dev"
WORKTREE_BASE="$REPO_DIR/.worktrees"
cd "$REPO_DIR"

run_session() {
  local name=$1
  local branch="session/$name"
  local worktree="$WORKTREE_BASE/$name"

  echo "🚀 시작: $name ($(date '+%H:%M:%S'))"

  # worktree 생성 (독립 디렉토리)
  cd "$REPO_DIR"
  git worktree add "$worktree" -b "$branch" master 2>&1

  # worktree에서 claude 실행
  cd "$worktree"
  claude -p "$(cat $REPO_DIR/sessions/$name.md)" --dangerously-skip-permissions

  # 커밋 + 푸시
  git add .
  git commit -m "auto: session $name complete" 2>&1
  git push -u origin "$branch" 2>&1
  gh pr create --title "세션: $name" --body "자동 생성 by run-all.sh" 2>&1

  # worktree 정리
  cd "$REPO_DIR"
  git worktree remove "$worktree" --force 2>/dev/null

  echo "✅ 완료: $name ($(date '+%H:%M:%S'))"
}

notify() {
  if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      -H "Content-Type: application/json; charset=utf-8" \
      -d "$(jq -n --arg chat "$TELEGRAM_CHAT_ID" --arg text "$1" '{chat_id: $chat, text: $text}')" > /dev/null 2>&1
  fi
  echo "$1"
}

# worktree 폴더 준비
mkdir -p "$WORKTREE_BASE"

echo "========================================="
echo "  렌더러 v2 자동 실행 (세션 11~18)"
echo "  worktree 병렬 모드"
echo "  시작: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="

# === Group 1: 4개 병렬 (독립 — 템플릿 파일 생성) ===
echo ""
echo "📦 Group 1 시작 (병렬: 세션 11,12,13,14 — 템플릿 16개)"
run_session "11-templates-hero" &
run_session "12-templates-feature" &
run_session "13-templates-proof-pricing" &
run_session "14-templates-cta-faq-misc" &
wait
notify "Group 1 완료 (세션 11~14, 템플릿 16개)"

# === Group 1 결과를 master에 머지 (Group 2가 참조) ===
cd "$REPO_DIR"
git fetch origin 2>&1
for branch in session/11-templates-hero session/12-templates-feature session/13-templates-proof-pricing session/14-templates-cta-faq-misc; do
  git merge "origin/$branch" --no-edit 2>&1 || true
done
git push origin master 2>&1 || true

# === Group 2: 2개 병렬 (Group 1 완료 후) ===
echo ""
echo "📦 Group 2 시작 (병렬: 세션 15,16 — registry + 이미지스펙)"
run_session "15-template-registry" &
run_session "16-image-spec" &
wait
notify "Group 2 완료 (세션 15~16, registry + 이미지스펙)"

# === Group 2 결과를 master에 머지 ===
cd "$REPO_DIR"
git fetch origin 2>&1
for branch in session/15-template-registry session/16-image-spec; do
  git merge "origin/$branch" --no-edit 2>&1 || true
done
git push origin master 2>&1 || true

# === Group 3: 순차 (Group 1+2 완료 후) ===
echo ""
echo "📦 Group 3 시작 (순차: 세션 17 — template-engine)"
run_session "17-template-engine"
notify "Group 3 완료 (세션 17, template-engine)"

# === Group 3 결과를 master에 머지 ===
cd "$REPO_DIR"
git fetch origin 2>&1
git merge "origin/session/17-template-engine" --no-edit 2>&1 || true
git push origin master 2>&1 || true

# === Group 4: 순차 (전체 완료 후) ===
echo ""
echo "📦 Group 4 시작 (순차: 세션 18 — 통합 + 빌드 검증)"
run_session "18-code-engine-integration"

echo ""
echo "========================================="
echo "  🎉 전체 완료: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="
notify "렌더러 v2 전체 완료! (세션 11~18, PR 8개)"

# worktree 폴더 정리
rm -rf "$WORKTREE_BASE"
