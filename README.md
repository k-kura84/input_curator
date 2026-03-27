# vibe_fullstack_mvp

インプットPWA（MVP）の開発リポジトリ。親ドキュメントは vault の `02_PJ/VibeFullstackBoot/0_PJ-VibeFullstackBoot.md`（相対: `../../vault`）。

## 方針（リポジトリ構成）

- **単一リポジトリ**: MVP はこのリポ内の Next.js アプリ 1 本で進める（モノレポのサブパッケージ分割はしない）。
- **Track B**（`claude agent teams`）: 同一リポに `agents/` 等を置くか別リポかは vault の ISS-07 で決定。未決定までは本リポをアプリ本体の正とする。

## スタック（予定）

- Next.js（App Router）, TypeScript, Tailwind CSS, shadcn/ui
- Supabase（Auth + DB）— 要件・引き継ぎは vault の `1_REQ-VibeFullstackBoot-要件定義.md` / `3_ISS-VibeFullstackBoot-03-認証DBコアAPI.md`

## ローカルパス

- 絶対: `C:\Users\kurak\Documents\repos\vibe_fullstack_mvp`
- vault からの相対: `../repos/vibe_fullstack_mvp`

## リモート

- GitHub 等のリモートは未設定の場合あり。追加後、この README の上に URL を追記する。
