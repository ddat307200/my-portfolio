# Portfolio · Dang Tien Dat

Trang portfolio một trang, nền đen, hero dạng hội thoại (hoạt ảnh **mô phỏng** có kịch bản, không phải AI thật). Song ngữ `/vi` và `/en`, xuất tĩnh, không backend, không script bên thứ ba.

## Phiên bản (kiểm tra bằng `npm view` ngày 2026-11-14)

| Gói | Phiên bản | Ghi chú |
|---|---|---|
| next | 16.4.6 | App Router, `output: 'export'`, build bằng webpack (`next build --webpack`) |
| react / react-dom | 19.3.1 | chỉ dùng lúc build (render HTML); trang đăng lên không tải React |
| tailwindcss / @tailwindcss/postcss | 4.3.5 | |
| motion | 14.14.0 | `inView` (hiện dần khi cuộn), đóng gói vào `enhance.js` |
| esbuild | 0.28.2 | đóng gói `lib/client/enhance.ts` → `public/enhance.js` |
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

`npm run size` in dung lượng JS tải ban đầu (gzip) của từng route trong `out/`.

### Cách trang chạy JavaScript

Mọi trang được Next.js render thành HTML đầy đủ lúc build, và không có component nào cần hydrate (dự án không có `"use client"`). Mọi tương tác nằm trong **một** script nhỏ là `lib/client/enhance.ts`: hoạt ảnh hero, hiện dần khi cuộn bằng Motion `inView`, ánh sáng theo chuột, nút sao chép email, và nút đổi ngôn ngữ giữ nguyên trang con. esbuild đóng gói script này thành `public/enhance.js`, khoảng 1,6KB gzip.

Bước postbuild gỡ runtime React/Next khỏi HTML xuất ra. Nhờ vậy JS ban đầu giảm từ khoảng 133KB xuống khoảng 1,6KB, nằm trong ngân sách 120KB của brief. Hệ quả: liên kết giữa các trang là điều hướng thường (tải lại trang), không có prefetch kiểu SPA. Trong `npm run dev`, React vẫn hydrate như bình thường.

`npm run build` gồm 3 bước:
1. `prebuild`:
   - `scripts/check-placeholders.mjs` **dừng build** nếu trong `content/` còn chỗ giữ chỗ dạng hai dấu ngoặc nhọn. Muốn bỏ qua khi thử nghiệm thì đặt `NODE_ENV=development`.
   - `scripts/build-enhance.mjs` đóng gói `enhance.js`.
2. `next build --webpack`: xuất tĩnh ra `out/`.
3. `postbuild` (`scripts/postbuild.mjs`):
   - Gỡ các script runtime của Next. Chỉ giữ các script có `id` là `pre-paint`, `enhance`, `lang-redirect`, và JSON-LD.
   - Xóa file payload RSC và các route canh gác `__none`.
   - Ghi `out/.nojekyll`, và ghi `out/CNAME` từ `domain` trong `content/site.ts` (khi không dùng `basePath`).

**Lưu ý khi thêm component mới:** nếu cần tương tác, viết vào `lib/client/enhance.ts` rồi điều khiển qua thuộc tính `data-*`. Không dùng `"use client"`, vì trên trang đăng lên component đó sẽ không chạy.

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

## Kiểm thử đã làm (bản build production, 2026-11-14)

- Lighthouse 13.6.0, **mobile**, Chrome headless, server `npm run start`:

| Route | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/vi/` | 100 | 100 | 100 | 100 | 1,0 s | 0,002 | 70 ms |
| `/en/` | 100 | 100 | 100 | 100 | 0,9 s | 0,001 | 0 ms |

- JS ban đầu (`npm run size`, gzip): `/vi/` và `/en/` **1,6KB** (`enhance.js`); Lighthouse đo được 1,9KB truyền về. Trang `/` và trang 404 không tải file JS nào (`/` chỉ có script chuyển hướng nội tuyến).
- Các bước của workflow CI (`npm ci` → lint → typecheck → build) đã chạy thử trên một bản sao sạch, cả có và không có `BASE_PATH`. `typecheck` chạy `next typegen` trước `tsc`, vì kiểu `PageProps`/`LayoutProps` do Next sinh ra. Việc đăng thật lên Pages/Cloudflare chưa làm: cần repo và tên miền của chủ trang.
- Đã kiểm tra: bàn phím (liên kết bỏ qua, thứ tự tab, vòng focus 3px), `prefers-reduced-motion`, không JavaScript, các độ rộng 360/768/1280/1920px không tràn ngang, console không lỗi (cả bản production và `npm run dev`).

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
components/          HeroChat, các section (đều là server component)
content/             dữ liệu: site.ts, copy.ts, projects.ts, notes/
lib/                 i18n, đọc Markdown, tiện ích
lib/client/enhance.ts  script duy nhất chạy trên trình duyệt
scripts/             kiểm tra chỗ giữ chỗ, đóng gói enhance, postbuild, server xem thử, đo JS
```
