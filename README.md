# Portfolio · Dang Tien Dat

Trang portfolio một trang, nền đen, kiểu bảng điều khiển kỹ thuật (bản **V2**). Hero là terminal chạy được (**kịch bản cố định, không phải AI**), kèm bảng đo đạc trực tiếp, hai công cụ chạy thử trong trình duyệt và sơ đồ kiến trúc minh họa. Song ngữ `/vi` và `/en`, xuất tĩnh, không backend, không script bên thứ ba. Bản V1 (hero chat mô phỏng) được giữ ở git tag `v1`: `git checkout v1`.

## Phiên bản (kiểm tra bằng `npm view` ngày 2026-11-14)

| Gói | Phiên bản | Ghi chú |
|---|---|---|
| next | 16.4.6 | App Router, `output: 'export'`, build bằng webpack (`next build --webpack`) |
| react / react-dom | 19.3.1 | chỉ dùng lúc build (render HTML); trang đăng lên không tải React |
| tailwindcss / @tailwindcss/postcss | 4.3.5 | |
| motion | 14.14.0 | `inView` (hiện dần khi cuộn), đóng gói vào `js/core.js` |
| esbuild | 0.28.2 | đóng gói `lib/client/*.ts` → `public/js/` (ES module, tách chunk) |
| puppeteer-core | 25.17.0 | chỉ dùng để đo (FPS, INP) bằng Chrome có sẵn; không vào bản đăng |
| lighthouse | 13.6.0 | chạy qua `npx` trong `scripts/lighthouse.mjs`, không cài vào dự án |
| typescript | 6.0.3 | 7.0.2 là bản mới nhất nhưng `typescript-eslint` (qua `eslint-config-next`) chưa hỗ trợ TS 7 nên `npm run lint` hỏng; dùng 6.0.3 cho tới khi hỗ trợ |
| eslint / eslint-config-next | 9.39.x / 16.4.6 | |
| gray-matter, marked | 4.0.3, 18.2.0 | chỉ chạy lúc build để đọc `content/notes/*.md` |

Node.js ≥ 20.9 (đã chạy trên Node 24).

## Chạy local

```bash
npm install
```

```bash
npm run dev
```

Mở http://localhost:3000 (tự chuyển sang `/vi/` hoặc `/en/` theo ngôn ngữ trình duyệt).

## Build production và xem thử

```bash
npm run build
```

```bash
npm run start
```

`npm run start` phục vụ thư mục `out/` (có gzip) tại http://localhost:4173. Các lệnh kiểm tra:

```bash
npm run lint
```

```bash
npm run typecheck
```

```bash
npm run size
```

`npm run size` in dung lượng JS (gzip) của từng route trong `out/`: **lần đầu** (script trong HTML + import tĩnh) và **tổng** sau khi nạp hết chunk lười.

```bash
npm test
```

`npm test` chạy test đơn vị (`node --test`) cho hai hàm của demo: `lib/demos/extract.ts` (trích xuất đơn hàng) và `lib/demos/reconcile.ts` (đối chiếu CSV), gồm ca bình thường, ca lỗi, ca rỗng.

### Đo hiệu năng (cần `npm run start` đang chạy)

```bash
CHROME_PATH="C:/Program Files/Google/Chrome/Application/chrome.exe" node scripts/lighthouse.mjs --runs 5
```

Chạy Lighthouse mobile N lần (mặc định 3) cho `/vi/` và `/en/`, ghi **trung vị** và từng lần chạy vào `content/lighthouse.json`. Bảng đo trên trang đọc file này sau lần build kế tiếp; **không sửa tay**. Chưa chạy thì trang hiện "chưa đo". Điểm Performance dao động vài điểm giữa các lần (chủ yếu qua TBT) nên chỉ so sánh trung vị.

```bash
CHROME_PATH=... node scripts/measure-fps.mjs
CHROME_PATH=... node scripts/measure-inp.mjs
```

Đo FPS thật (rAF) và INP của trang production dưới CPU giả lập 4x bằng Chrome DevTools Protocol. Với INP dùng `HEADFUL=1` (xem phần kết quả).

### Cách trang chạy JavaScript

Mọi trang được Next.js render thành HTML đầy đủ lúc build, và không có component nào cần hydrate (dự án không có `"use client"`). Mọi tương tác nằm trong `lib/client/`, esbuild đóng gói thành ES module có tách chunk ở `public/js/`:

- `core.js` (~2,6KB gzip, **duy nhất** script được HTML tham chiếu): hiện dần khi cuộn, ánh sáng theo chuột, nút sao chép email, menu mobile, đổi ngôn ngữ giữ trang con, và các bộ nạp lười bên dưới.
- Chunk nạp lười bằng `import()`: `terminal` (sau idle), `palette` (lần đầu bấm Ctrl/Cmd+K), `telemetry` (khi mục đo đạc gần vào màn hình), `canvas` (sau idle, chỉ khi có chuột thật), `demos` và `diagram` (khi gần vào màn hình), `buildinfo`.

Bước postbuild gỡ runtime React/Next khỏi HTML xuất ra, nên JS cho lần hiển thị đầu chỉ vài KB (ngân sách ≤ 120KB). Hệ quả: liên kết giữa các trang là điều hướng thường, không có prefetch kiểu SPA. Trong `npm run dev` React vẫn hydrate như bình thường.

`npm run build` gồm 3 bước:
1. `prebuild`: `scripts/check-placeholders.mjs` **dừng build** nếu trong `content/` còn chỗ giữ chỗ dạng hai dấu ngoặc nhọn; `scripts/build-client.mjs` đóng gói `public/js/`.
2. `next build --webpack`: xuất tĩnh ra `out/` (CSS được nhúng thẳng vào HTML: `experimental.inlineCss`).
3. `postbuild`: gỡ script runtime của Next (chỉ giữ script có `id` là `pre-paint`, `core`, `lang-redirect` và JSON-LD), xóa file RSC và route tạm `__none`, **ghi `out/build-info.json`** (commit git, thời điểm build, JS gzip từng route, điểm Lighthouse gần nhất, đều là số đo/ghi lúc build), ghi `.nojekyll` và `CNAME`.

**Khi thêm tương tác mới:** viết vào `lib/client/` (module nạp lười nếu nặng), điều khiển bằng thuộc tính `data-*`, và để CSS quyết định bố cục ban đầu (dựa vào `html.js`) thay vì để JS đổi chiều cao sau khi tải: việc đó từng làm các anchor nhảy sai chỗ.

### Các khối V2

| Mục | Nội dung | Ghi chú trung thực |
|---|---|---|
| `[00]` hero | terminal chạy được: `help`, `whoami`, `ls projects`, `cat contact`, `stack`, `status`, `open`, `lang`, `clear`, `sudo hire me`; Tab gợi ý, ↑↓ lịch sử, Esc thoát | ghi rõ "kịch bản cố định, không phải AI"; bản ghi `whoami` + `status` có sẵn trong HTML |
| `[01]` status | FPS, LCP, CLS, INP, viewport, DPR, số lõi, JS đã tải (live); commit, build, JS gzip, Lighthouse (build) | chưa đo thì ghi "chưa đo"; không có uptime hay lượt truy cập |
| `[03]` run | trích xuất đơn hàng bằng regex; đối chiếu hai CSV, xuất CSV | chạy trong trình duyệt, không gửi dữ liệu; **không phải case study**, không nêu kết quả kinh doanh |
| `[04]` architecture | sơ đồ SVG có dòng chảy, mô tả từng khối | ghi "ví dụ minh họa, không phải hệ thống của khách nào" |
| Nền hero | canvas 2D, ≤ 25% cam | chỉ bật với chuột thật và không giảm chuyển động; tự giảm điểm dưới 50 FPS, tự tắt dưới 30 FPS |
| `Ctrl/Cmd+K` | bảng lệnh (nhảy tới mục, đổi ngôn ngữ, sao chép email) | nhãn nút theo hệ điều hành: `Ctrl K` / `⌘K` / biểu tượng trên cảm ứng |

Thẻ dự án "Công cụ web nhỏ" đã chuyển sang "Bản chạy thử" (hai demo ở `[03]`). Hai thẻ còn lại vẫn là "Sắp ra mắt". Chưa có liên kết mã nguồn vì chưa có repo công khai.

## Sửa nội dung

| Muốn đổi | Sửa ở |
|---|---|
| Tên, email, Zalo, Facebook, GitHub, tên miền, bio, stack | `content/site.ts` (nơi **duy nhất** chứa thông tin liên hệ) |
| Mọi chữ giao diện VI/EN (hero, dịch vụ, quy trình, liên hệ…) | `content/copy.ts` |
| Dự án | `content/projects.ts` |
| Ghi chú (blog) | `content/notes/*.md` |

**Dự án.** Thẻ `status: "soon"` hiện "Sắp ra mắt", viền nét đứt, không có liên kết. Khi có dự án thật, đổi sang `status: "published"` và điền `summary`, `problem`, `approach`, `result`, `tech`, `links`. Trang `/vi/projects/<slug>/` và `/en/projects/<slug>/` sẽ tự sinh và được thêm vào sitemap. Chỉ thêm `links.source` khi repo đã công khai.

**Ghi chú.** Mỗi bài là một file `.md` có frontmatter:

```md
---
title: "Tiêu đề"
lang: vi            # vi hoặc en
date: "2026-11-20"
category: "AUTOMATION"
summary: "Tóm tắt hai dòng."
draft: false        # thiếu hoặc true thì không xuất bản
---
```

Bài mẫu `content/notes/ghi-chu-dau-tien.md` đang để `draft: true`, nên không xuất hiện trên trang.

Khi chưa có dự án hay ghi chú nào được xuất bản, Next.js (chế độ export) không cho phép danh sách route rỗng. Vì vậy build sinh một route canh gác `__none`, và postbuild xóa nó khỏi `out/`. URL lạ sẽ rơi về `404.html` (lấy từ `app/global-not-found.tsx`). Khi có nội dung thật, các trang thật được sinh như bình thường.

## Đăng lên mạng

### Cách 1: GitHub Pages (đã có workflow)

1. Tạo repo trên GitHub (ví dụ `ddat307200/portfolio`) rồi đẩy mã lên nhánh `main`.
2. Vào repo → **Settings → Pages → Source: GitHub Actions**.
3. Workflow `.github/workflows/deploy.yml` sẽ chạy lint, typecheck, build rồi đăng `out/`.
4. **Có tên miền riêng:** để trống biến `BASE_PATH`; postbuild sẽ ghi file `CNAME`. Tiếp theo vào **Settings → Pages → Custom domain**, nhập tên miền, rồi bật **Enforce HTTPS** khi chứng chỉ sẵn sàng.
5. **Không có tên miền** (chạy ở `ddat307200.github.io/portfolio`): vào **Settings → Secrets and variables → Actions → Variables**, thêm `BASE_PATH` = `/portfolio`. Lưu ý canonical/OG vẫn trỏ về tên miền trong `content/site.ts`.

Bản ghi DNS khi trỏ tên miền gốc (apex) vào GitHub Pages:

| Loại | Tên | Giá trị |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153 |
| CNAME | www | `ddat307200.github.io` |

Nên xác minh tên miền trong **GitHub → Settings (tài khoản) → Pages → Verified domains** để tránh bị người khác chiếm.

Build thử với `basePath` trên Windows/Git Bash cần `MSYS_NO_PATHCONV=1`, nếu không Git Bash sẽ đổi `/portfolio` thành đường dẫn ổ đĩa:

```bash
MSYS_NO_PATHCONV=1 NEXT_PUBLIC_BASE_PATH=/portfolio npm run build
```

### Cách 2: Cloudflare Pages

1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**, chọn repo.
2. Build command: `npm run build`. Output directory: `out`. Biến môi trường: `NODE_VERSION=24`.
3. **Custom domains → Set up a domain**: nếu tên miền đã quản lý DNS ở Cloudflare thì bản ghi được tạo tự động. Cloudflare phục vụ thêm Brotli nên JS tải về nhỏ hơn gzip.
4. File `CNAME` trong `out/` không ảnh hưởng gì trên Cloudflare.

### Repo hồ sơ GitHub (chủ trang tự làm sau)

- **README hồ sơ:** tạo repo công khai tên đúng bằng username (`ddat307200/ddat307200`), thêm `README.md` (vài dòng giới thiệu và liên kết tới trang). Nội dung sẽ hiện trên trang hồ sơ GitHub.
- **Repo trang cá nhân:** đẩy dự án này lên repo công khai (ví dụ `portfolio`). Khi đó mới thêm `links.source` cho dự án nào có mã nguồn thật.

## Kết quả đo (bản build production, commit ghi trong `content/lighthouse.json`)

Lighthouse 13.6.0 **mobile** (4G giả lập + CPU 4x), Chrome headless, trung vị của 5 lần chạy:

| Route | Performance | A11y | Best Practices | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| `/vi/` | 100 (99–100) | 100 | 100 | 100 | 1048 ms | 21 ms | 0 |
| `/en/` | 100 (98–100) | 100 | 100 | 100 | 937 ms | 91 ms | 0 |

- JS (`npm run size`, gzip): lần đầu **2,6KB**, tổng sau khi nạp hết chunk **22,9KB** (ngân sách: ≤ 120KB lần đầu, ≤ 300KB tổng). Phần tử LCP là đoạn chữ hero, không phải canvas.
- FPS đo bằng rAF dưới CPU 4x (headless, máy dev, 5 giây rê chuột): desktop 71,2; mobile 360px 71,7 (canvas tắt trên cảm ứng, dùng nền tĩnh).
- **INP** (≤ 200ms), đo bằng Chrome có cửa sổ thật dưới CPU 4x, kịch bản gõ lệnh terminal + chạy hai demo + mở bảng lệnh, 3 lần: desktop **80–96ms**, mobile 360px **48–72ms** (lần đo cuối: 96ms / 56ms) (`HEADFUL=1 node scripts/measure-inp.mjs`). **Đừng đo INP bằng headless**: cùng kịch bản cho 344–500ms vì headless trễ dựng khung hình (kiểm chứng: trace không có tác vụ nào trên 14ms ở bất kỳ luồng nào; cùng lần bấm là 40ms ở Chrome thật).
- Style & Layout trong Lighthouse: khoảng 0,6–0,7 giây (trước khoảng 1,0–1,3 giây). Giảm nhờ `font-display: optional` (font đã preload, không còn bước đổi font làm layout lại cả trang). Trade-off: lần truy cập đầu trên mạng rất chậm có thể hiển thị font dự phòng cho đến khi tải lại.
- Đã kiểm tra: bàn phím (menu mobile, Esc, Ctrl/Cmd+K, vòng focus 3px), `prefers-reduced-motion`, không JavaScript, 360/1280px không tràn ngang, console không lỗi, không còn chữ dưới 12px, anchor nhảy đúng chỗ.
- **Chưa kiểm tra:** điện thoại thật (CPU 4x chỉ là giả lập), Mac thật (nhãn `⌘K` mới giả lập), trình đọc màn hình thật.

## Cấu trúc

```
app/
  (root)/            trang "/" chuyển hướng theo ngôn ngữ (có liên kết dự phòng khi không có JS)
  [lang]/            layout gốc cho /vi và /en (html lang, metadata, hreflang)
    projects/[slug]/ trang chi tiết dự án
    notes/[slug]/    trang ghi chú
  og.png/            ảnh Open Graph tĩnh, sinh lúc build
  sitemap.ts, robots.ts
  global-not-found.tsx  trang 404 chung (out/404.html)
components/          Terminal, Frame, các section (đều là server component)
content/             dữ liệu: site.ts, copy.ts, console.ts, demos.ts, projects.ts, lighthouse.json, notes/
lib/                 i18n, đọc Markdown, tiện ích
lib/client/          core.ts (entry) + terminal, palette, telemetry, canvas, demos, diagram (nạp lười)
lib/demos/           extract.ts, reconcile.ts, samples.ts (không phụ thuộc gì, tách repo được)
lib/terminal/        commands.ts (lệnh terminal, dùng cả lúc build lẫn trên trình duyệt)
tests/               test đơn vị cho lib/demos
scripts/             kiểm tra chỗ giữ chỗ, đóng gói client, postbuild, server xem thử, đo JS/Lighthouse/FPS/INP
```
