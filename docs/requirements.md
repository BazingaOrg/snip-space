# Snipspace Requirements

## 1. Product Vision
- Personal cross-platform snippet library for storing mixed media collected during browsing.
- Emulates macOS 2026 aesthetic with glassmorphism, soft shadows, and dynamic accents.
- Focus on quick capture, easy recall, and organized daily timelines.

## 2. Target Platforms
- Responsive web app optimized for desktop (macOS, Windows) and mobile (iOS, iPadOS, Android) browsers.
- Designed to behave consistently across Chrome, Edge, Safari, and Firefox.

## 3. Access & Security
- Entry gated by a single access password displayed via a macOS 2026-style lock screen.
- Password validation handled server-side via Supabase Edge Function.
- Session cookie stores verified state for the current browser session only; closing the tab or window clears access and forces re-entry of the password.
- Rate limiting and exponential backoff for incorrect attempts.

## 4. Core Features
### 4.1 Content Ingestion
- Unlock screen transitions into main dashboard.
- Floating capture button opens multi-input modal accepting pasted/typed content.
- Auto-detect content type (text, link, image, video URL, code snippet) with optional manual override.
- Extract metadata where possible (link previews, dominant image color, video provider info).
- Clipboard support for images and text via Async Clipboard API; fallback to file input or drag-and-drop when unavailable.
- Enforce 10 MB max image size; attempt client-side compression when exceeded, and prompt the user to reselect a smaller image if the compressed file still violates the limit.

### 4.2 Content Storage & Grouping
- Daily timeline view with entries grouped by `created_day`.
- Each entry captures: id, content, content_type, source_url, media_metadata (JSON), tags, created_at, created_day.
- Images stored in Supabase Storage using date/UUID folder structure.
- Video entries store remote URLs only; no local upload.
- Provide quick tagging on creation; tags editable post-save.

### 4.3 Browsing & Discovery
- Middle column lists daily groups; cards show preview, type icon, and quick actions.
- Right column (or drawer on mobile) displays full entry details with copy/open/download controls.
- Dock at bottom with primary navigation (Today, All, Types, Tags, Search, Settings) and quick access to the notification tray.
- Type filter segmented control integrated with Dock; supports multi-select.
- Global search bar with Supabase full-text search and filters (type, date range, tags).
- URL query parameters persist current filters/search.

### 4.4 Motion & Feedback
- Smooth animations (120–180 ms) using GPU-friendly transforms and `backdrop-filter`.
- Unlock transition mirrors macOS 2026 lock screen (blur fade, card slide).
- Hover states, card expand, Dock bounce utilize easing `cubic-bezier(0.16, 1, 0.3, 1)`.
- Error states (e.g., wrong password) trigger subtle vibration and inline messaging.
- Toast notifications slide in from the upper-right, use concise copy, and follow macOS 2026 styling cues.

## 5. Non-Goals
- No multi-user accounts, collaboration, or sharing beyond personal access.
- No browser extension for capture (future consideration).
- No localization/i18n within initial scope.

## 6. Technical Stack
- Next.js 14 (stable/LTS) with App Router.
- TypeScript everywhere.
- shadcn/ui components customized with Tailwind CSS and design tokens.
- State management via React states + Server Actions; Zustand for client-side filters if needed.
- Supabase (Postgres, Storage, Edge Functions) as backend.
- Deployment target: Vercel; environment variables manage secrets.

## 7. Supabase Schema & Operations
### 7.1 Database Schema
- `entries` table with columns: id (uuid), content (text/jsonb), content_type (enum), source_url (text), media_meta (jsonb), tags (text[]), created_at (timestamptz), created_day (date), user_agent (text optional).
- `assets` table for uploaded binaries with columns: id, entry_id, storage_path, mime_type, size_bytes, width, height, created_at.
- `tags` lookup (optional) for tag metadata.
- Database extensions: `pg_trgm`, `unaccent` for search.

### 7.2 Edge Functions
- `verify-password`: validates provided password against hashed secret stored in Supabase config or KV; responds with signed JWT/session.
- `capture-entry` (optional future): pre-process metadata or call third-party preview services.

### 7.3 Storage Buckets
- `entry-images`: restricted bucket for user-uploaded images; policy allows read with session, write via service role.
- Versioning enabled; max object size 10 MB enforced via client-side validation and storage policy.

### 7.4 Required Credentials
- Supabase project URL.
- Service role key (secure server-side usage only).
- Public anon key for client interactions.
- Optional: dedicated password secret stored in Supabase config or Vercel env.
- Edge Function endpoint `SUPABASE_VERIFY_PASSWORD_URL` 和授权密钥 `SUPABASE_VERIFY_PASSWORD_KEY`（未指定时默认使用 service role key）。

### 7.5 Setup Checklist
1. Create Supabase project and enable required extensions (`pg_trgm`, `unaccent`).
2. Define tables via SQL migration or Supabase Studio.
3. Configure storage bucket with RLS policies.
4. Deploy Edge Function for password verification.
5. Store secrets in Vercel environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ACCESS_PASSWORD_HASH`).
6. Generate service bindings within Next.js (Supabase client per server/client context).

## 8. Frontend Architecture
- Layout split into `LockScreen`, `DashboardLayout`, `Dock`, `Timeline`, `EntryDetail`, `CaptureModal` components.
- Use Server Components for data fetching; progressively enhance with Client Components for interactivity.
- Animations centralized in `motion` helpers to reuse durations/easing.
- Tailwind config defines macOS palette, blur, shadow presets, responsive breakpoints.
- Theme tokens set via CSS variables to support dark/light adaptation based on system preference.

## 9. Accessibility & Performance
- WCAG AA contrast despite glassmorphism (apply overlays/dropshadow for legibility).
- Keyboard navigation: focus rings, `Tab` through Dock, `Ctrl/Cmd+K` open search.
- Lazy load heavy assets; responsive images with `next/image` for optimized formats.
- Pre-fetch metadata server-side to avoid layout shifts.

## 10. Testing & Monitoring
- Unit tests for parsing/type detection utilities (Vitest or Jest).
- Playwright/E2E for lockscreen flow, capture modal happy path, filter/search behavior.
- Supabase logs monitored via dashboard; optional Sentry integration for runtime errors.

## 11. Future Enhancements (Backlog)
- PWA support with offline cache for recent entries.
- Browser share targets (Web Share API).
- Automatic tag suggestions via ML or keyword extraction.

## 12. Implementation Roadmap
1. ✅ Initialize Next.js, Tailwind CSS, shadcn/ui baseline with global macOS 2026 tokens (completed on 2025-10-23).
2. ⏳ Integrate Supabase client, configure environment variables, and set up `verify-password` Edge Function and storage bucket policies。（客户端工厂已就绪，暂以环境变量校验密码；Supabase 时间线查询与上传接口已搭建，Edge Function 暂不启用）。
3. ✅ Build lock screen flow with session-scoped authentication cookie and animation（完成于 2025-10-23，支持环境变量与 Supabase Edge Function 双通道校验）。
4. 🔄 Implement dashboard layout: Dock, timeline grouping, entry detail drawer, toast notifications（2025-10-23 搭建 Dock 与时间线占位骨架，并接入 Dock 视图状态与时间线 mock 数据分组；新增剪藏弹窗骨架与 toast 管道）。
5. ⏳ Develop capture modal with type detection, clipboard ingestion, 10 MB compression workflow, and storage upload pipeline.
6. ⏳ Add type filters, search with Supabase full-text queries, and URL-based state persistence.
7. ⏳ Polish motion curves, accessibility, responsive behavior; add tests and monitoring hooks.

## 13. Implementation Progress
- **2025-10-23**: 完成项目初始化，采用稳定版 Next.js + Tailwind + shadcn/ui，设置 macOS 2026 主题令牌，并在首页保留占位壳体以便后续接入实际功能。
- **2025-10-23**: 构建仿 macOS 锁屏界面，使用 Server Action + 环境变量校验访问密码并发放会话 Cookie（关闭标签页即失效）。
- **2025-10-23**: 接入 Supabase server/browser 客户端工厂、锁屏 Supabase Edge Function 占位、完成 Dock 与时间线骨架布局并实现基础视图切换与 mock 数据分组展示；新增剪藏弹窗（粘贴识别、10 MB 图片校验占位）与 toast 通知。
- **2025-10-24**: 实现 `/api/entries` Supabase 上传管道（文本/链接入库、图片上传至 `entry-images`），时间线读取改为优先查询 Supabase，失败时回退到 mock 数据。

## 14. Decision Log
- **2025-10-23**: 首页暂不展示功能预览，改为提示性占位，防止误导；所有功能实现以需求文档为准并在完成后更新进度。
- **2025-10-23**: 要求在每个主要功能交付后同步更新文档进度，避免方向偏离与重复开发。
- **2025-10-23**: 锁屏校验阶段依赖 `ACCESS_PASSWORD_HASH`（或临时 `ACCESS_PASSWORD`）环境变量与 `snipspace-session` Cookie；支持配置 `SUPABASE_VERIFY_PASSWORD_URL` 切换到 Edge Function 校验。
- **2025-10-24**: 暂不启用 Edge Function，改为直接调用 `/api/entries` 接口；若 Supabase 不可用则回退到本地 mock 数据并提示配置。

## 15. Open Questions
- Any third-party metadata preview services to integrate?
