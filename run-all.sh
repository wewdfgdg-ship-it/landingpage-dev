#!/bin/bash
# landingpage-dev 세션 3~10 자동 실행 (worktree 병렬)

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
  git worktree add "$worktree" -b "$branch" master

  # worktree에서 claude 실행
  cd "$worktree"
  claude -p "$(cat $REPO_DIR/sessions/$name.md)" --dangerously-skip-permissions

  # 커밋 + 푸시
  git add .
  git commit -m "auto: session $name complete"
  git push -u origin "$branch"
  gh pr create --title "세션: $name" --body "자동 생성 by run-all.sh"

  # worktree 정리
  cd "$REPO_DIR"
  git worktree remove "$worktree" --force

  echo "✅ 완료: $name ($(date '+%H:%M:%S'))"
}

notify() {
  if [ -n "$TELEGRAM_BOT_TOKEN" ] && [ -n "$TELEGRAM_CHAT_ID" ]; then
    curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
      -H "Content-Type: application/json" \
      -d "{\"chat_id\":\"${TELEGRAM_CHAT_ID}\",\"text\":\"$1\"}"
  fi
  echo "$1"
}

# worktree 폴더 준비
mkdir -p "$WORKTREE_BASE"

echo "========================================="
echo "  landingpage-dev 자동 실행 (세션 3~10)"
echo "  worktree 병렬 모드"
echo "  시작: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="

# === Group 1: 4개 병렬 (각각 독립 worktree) ===
echo ""
echo "📦 Group 1 시작 (병렬: 세션 3,4,5,6)"
run_session "03-rules-01-06" &
run_session "04-rules-07-12" &
run_session "05-prompts-01-06" &
run_session "06-prompts-07-12" &
wait
notify "✅ [landingpage-dev] Group 1 완료 (세션 3~6, rules+prompts 분리)"

# === Group 2: 2개 병렬 ===
echo ""
echo "📦 Group 2 시작 (병렬: 세션 7,8)"
run_session "07-editor" &
run_session "08-e2e-test" &
wait
notify "✅ [landingpage-dev] Group 2 완료 (세션 7~8, 에디터+E2E)"

# === Group 3: 순차 ===
echo ""
echo "📦 Group 3 시작 (순차: 세션 9)"
run_session "09-lint-fix"
notify "✅ [landingpage-dev] Group 3 완료 (세션 9, 린트 정리)"

# === Group 4: 순차 ===
echo ""
echo "📦 Group 4 시작 (순차: 세션 10)"
run_session "10-final-qa"

echo ""
echo "========================================="
echo "  🎉 전체 완료: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="
notify "🎉 [landingpage-dev] 전체 완료! (세션 3~10, PR 8개 생성)"

# worktree 폴더 정리
rm -rf "$WORKTREE_BASE"
