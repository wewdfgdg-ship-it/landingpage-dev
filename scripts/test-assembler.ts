// assembler.ts 검증 스크립트
import {
  assembleAllMoods,
  getSupportedMoods,
  assembleMood,
  resolveAssemblerMood,
} from '@/engine/10-code-engine/assembler';

console.log('=== Template Assembler 검증 ===\n');

// 1. 지원 무드 목록
const moods = getSupportedMoods();
console.log(`지원 무드 (${moods.length}개): ${moods.join(', ')}`);

// 2. 전체 어셈블리
const all = assembleAllMoods();
let passCount = 0;
let failCount = 0;

for (const mood of moods) {
  const a = all[mood];
  const errors: string[] = [];

  // tokens 필수 필드
  if (!a.tokens.colors.primary) errors.push('colors.primary 없음');
  if (!a.tokens.colors.background) errors.push('colors.background 없음');
  if (!a.tokens.colors.textPrimary) errors.push('colors.textPrimary 없음');
  if (!a.tokens.typography.display) errors.push('typography.display 없음');
  if (!a.tokens.fontFamily) errors.push('fontFamily 없음');
  if (!a.tokens.spacing) errors.push('spacing 없음');
  if (!a.tokens.radius) errors.push('radius 없음');
  if (!a.tokens.sectionPadding) errors.push('sectionPadding 없음');

  // fonts 필수 필드
  if (!a.fonts.url) errors.push('fonts.url 없음');
  if (!a.fonts.displayFont) errors.push('fonts.displayFont 없음');
  if (!a.fonts.bodyFont) errors.push('fonts.bodyFont 없음');

  // patterns 필수 필드
  const requiredPatterns = ['hero', 'features', 'pricing', 'cta', 'faq', 'reviews'] as const;
  for (const p of requiredPatterns) {
    if (!a.patterns[p]) errors.push(`patterns.${p} 없음`);
  }

  if (errors.length === 0) {
    console.log(`  ✅ ${mood.toUpperCase().padEnd(8)} | ${a.tokens.colors.background.padEnd(10)} | ${a.fonts.displayFont.split(',')[0].replace(/'/g, '').padEnd(22)} | ${a.patterns.hero}`);
    passCount++;
  } else {
    console.log(`  ❌ ${mood.toUpperCase()} — ${errors.join(', ')}`);
    failCount++;
  }
}

// 3. MoodPreset 호환성
console.log('\n--- MoodPreset 호환 매핑 ---');
const presets = ['luxury', 'clean', 'tech', 'natural', 'bold', 'premium', 'fun_pop', 'professional', 'startup', 'minimal'] as const;
for (const preset of presets) {
  const resolved = resolveAssemblerMood(preset);
  console.log(`  ${preset.padEnd(14)} → ${resolved}`);
}

// 4. 결과
console.log(`\n=== 결과: ${passCount} passed, ${failCount} failed ===`);
process.exit(failCount > 0 ? 1 : 0);
