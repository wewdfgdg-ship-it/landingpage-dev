# ChatGPT 프롬프트 5개 — 레퍼런스 기반 Hero 섹션

레퍼런스 폴더: C:\Users\tip12\Downloads\레퍼런스\01-헤더배너

---

## 1. 수상배지 연두 (Green Tomato Ampoule — 6d1e9d08)

```
Create a single landing page hero section. Pure HTML + Tailwind CDN only.

Reference image analysis:
- Background: light sage green/olive (#e6ead4), with decorative wheat/laurel leaf patterns on left and right sides
- Top section: subtitle "뷰티어워즈 수상으로 증명된" (16px, gray) + bold headline "모공 개선 효과!" (44px, black, font-weight 900)
- Middle: 4 award badge circles (80px) horizontally — each with brand logo text and "1위" or "91%" in large bold. Badges have thin borders, white fill, subtle shadow
- Below badges: achievement text list centered — "올리브영 스킨케어 카테고리 1위" / "글로우픽 어워드 1위" / "얼루어 코리아 Editor's pick" — each "1위" is bold black
- Bottom: 3 product bottles (green ampoule style) arranged with center one tallest, slight overlap

Design style: clean Korean beauty brand, natural/organic feel, editorial award showcase
Typography: Pretendard font, Korean text, premium but approachable
Min-height: 100vh, mobile responsive
Do NOT use external images — use CSS shapes/gradients for product placeholders
Add subtle leaf/botanical decorative elements on sides using CSS
```

---

## 2. 다크 볼드 (본고장 우동 — 7a01caf5)

```
Create a single landing page hero section. Pure HTML + Tailwind CDN only.

Reference image analysis:
- Background: very dark, near black (#111), with subtle dark gradient
- Top center: white product icon/logo (stylized bowl icon, ~50px, white outline style)
- Main headline: "본고장" in BRIGHT RED (#e53935), massive font-size 72-80px, font-weight 900
- Sub-headline: "가쏘오우동, 얼큰유부 우동" — mixed colors: red for first part, YELLOW (#ffb300) for "얼큰", white for rest. Font-size 48-54px, font-weight 900
- Product image area: large food bowl photo overlapping with headline text area — the bowl sits between the headline and the description, creating depth
- Description: 3 lines centered below, white text, 15px, opacity 0.65: "뜨거운물만 부으면 포차에서 먹던 그 맛!" / "2분30분초면 조리 끝!" / "시원하고 따뜻한 우동 한그릇 하세요"
- Disclaimer at bottom: "※ 연출된 조리컷입니다." very small, very low opacity

Design style: bold Korean food advertising, maximum impact, text feels like it's punching out of the screen
The RED + YELLOW on dark background creates urgency and appetite appeal
Min-height: 100vh, mobile responsive
Do NOT use external images — use CSS gradient circle/oval for food bowl placeholder
```

---

## 3. 다크 이벤트 (에어팟 빙고 — 8c20e772)

```
Create a single landing page hero section. Pure HTML + Tailwind CDN only.

Reference image analysis:
- Background: dark charcoal (#232323), near black
- Floating green accent marks (small diagonal lines, lime green #a3e635) scattered around — 4-5 pieces
- Background watermark text: "BINGO" in massive faded text (30vw, opacity 0.03, white)
- Top: "월간 사진 빙고 EVENT" (16px, white, bold, letter-spacing wide)
- Main headline: "사진을 채우고 빙고를 외치면?" (40-48px, white, font-weight 300, elegant thin style) — note the THIN font weight, NOT bold
- Product area: large product floating with slight rotation (-15deg), white/silver color, rounded corners, with strong drop shadow — simulating AirPods Pro floating
- Bottom text: "오늘의집 마이페이지에 있는 사진 영역을 한 줄 이상 채우면" (regular weight)
- Highlight text: "추첨을 통해 애플 에어팟 PRO를 선물로 드려요!" where "애플 에어팟 PRO" is colored in cyan/sky blue (#38bdf8) and bold

Design style: sleek Apple-inspired, dark minimal, elegant thin typography, floating product
The contrast between thin headline and bold accent creates sophistication
Min-height: 100vh, mobile responsive
Do NOT use external images — use CSS rounded box with gradient for product placeholder
```

---

## 4. 다크 스펙 (BROWN VIP — cb3e14a6)

```
Create a single landing page hero section. Pure HTML + Tailwind CDN only.

Reference image analysis:
- Background: pure black (#050505) with very subtle gradient
- Top left: category label "| 최고 평량 & 최대 사이즈 |" — left-aligned, white text with left border accent
- Main headline: "최고 평량 88gsm 최대 사이즈 195x200mm" — regular weight for Korean text, GOLD color (#d4af37) for numbers "88gsm" and "195x200mm", font-weight 900 for gold parts
- Center: dimension diagram — a product shape (rectangular with rounded corners) with measurement arrows showing width and height. Arrow lines are thin gray (#666). Dimension numbers displayed at arrow endpoints
- Product area: dark product package sitting on a subtle surface/pedestal, with dramatic uplighting
- Bottom: "최고만을 선사하는 'VIP 골드 블랙'" — where "VIP 골드 블랙" is in warm gold color. Regular weight for description text

Design style: ultra premium, luxury black & gold, technical specification showcase, high-end Korean product
The gold on black creates extreme luxury feel. Dimension graphics add credibility.
Min-height: 100vh, mobile responsive
Do NOT use external images — use CSS for dimension diagram and product placeholder
```

---

## 5. 세일 클라우드 (Green Tomato Super Sale — e1a332e0)

```
Create a single landing page hero section. Pure HTML + Tailwind CDN only.

Reference image analysis:
- Background: sky blue gradient top (#dbeafe) fading to white bottom, with cloud-like soft shapes
- Top right: date "06.10 ~ 06.30" (small, gray)
- Brand name: "GREEN TOMATO" (28px, green #16a34a, bold, letter-spacing wide)
- MASSIVE sale text: "SUPER SALE" in 3D-like large text (72-80px), green color, with glass/ice block effect behind it — the text appears to be frozen in a glass cube
- Product display: multiple products on a green circular pedestal/stage, arranged like a product photoshoot with center product tallest
- Bottom: 3 info cards in a row with green top border:
  - "그린토마토 ~70%" (discount)
  - "한정수량 기획세트" (limited set)
  - "금액대별 사은품" (gift with purchase)

Design style: fresh, vibrant Korean beauty sale event. Ice/glass effect for headline creates premium feel despite being a sale page. Cloud/sky background is light and fresh.
Min-height: 100vh, mobile responsive
Do NOT use external images — use CSS for product placeholders and 3D glass text effect
```

---

## 사용법

1. ChatGPT에 각 프롬프트 붙여넣기
2. 결과 HTML 복사
3. Claude에게 주면 슬롯 변환 + 템플릿 시스템 연결
