#!/bin/bash
# landingpage-dev 세션 3~10 자동 실행
# 사용법: ./run-all.sh

REPO_DIR="c:/Users/tip12/landingpage-dev"
cd "$REPO_DIR"

run_session() {
  local name=$1
  local branch="session/$name"

  echo "🚀 시작: $name ($(date '+%H:%M:%S'))"

  cd "$REPO_DIR"
  git checkout master
  git pull origin master
  git checkout -b "$branch"

  claude -p "$(cat sessions/$name.md)" --dangerously-skip-permissions

  git add .
  git commit -m "auto: session $name complete"
  git push -u origin "$branch"
  gh pr create --title "세션: $name" --body "자동 생성 by run-all.sh"

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

echo "========================================="
echo "  landingpage-dev 자동 실행 (세션 3~10)"
echo "  시작: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="

# === Group 1: 4개 병렬 (독립 작업) ===
echo ""
echo "📦 Group 1 시작 (병렬: 세션 3,4,5,6)"
run_session "03-rules-01-06" &
run_session "04-rules-07-12" &
run_session "05-prompts-01-06" &
run_session "06-prompts-07-12" &
wait
notify "✅ [landingpage-dev] Group 1 완료 (세션 3~6, rules+prompts 분리)"

# === Group 2: 2개 병렬 (Group 1 완료 후) ===
echo ""
echo "📦 Group 2 시작 (병렬: 세션 7,8)"
run_session "07-editor" &
run_session "08-e2e-test" &
wait
notify "✅ [landingpage-dev] Group 2 완료 (세션 7~8, 에디터+E2E)"

# === Group 3: 순차 (전체 코드 확정 후) ===
echo ""
echo "📦 Group 3 시작 (순차: 세션 9)"
run_session "09-lint-fix"
notify "✅ [landingpage-dev] Group 3 완료 (세션 9, 린트 정리)"

# === Group 4: 순차 (최종) ===
echo ""
echo "📦 Group 4 시작 (순차: 세션 10)"
run_session "10-final-qa"

echo ""
echo "========================================="
echo "  🎉 전체 완료: $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================="
notify "🎉 [landingpage-dev] 전체 세션 완료! (세션 3~10, PR 8개 생성)"
