# input_curator

インプットPWA（MVP）の開発リポジトリ。

## 命名の理由

**input_curator** = 複数ソースから流れ込む **input**（記事・フィード）を、ユーザーがスワイプ等で **curate**（選定・ラベル付け）し、Markdown で vault Inbox に渡す用途を表す。`vibe_fullstack_mvp` よりプロダクトの振る舞いが名前から伝わるようにした。

## 親ドキュメント

vault の `02_PJ/VibeFullstackBoot/0_PJ-VibeFullstackBoot.md`（このリポからの相対: `../../vault`）。

## 方針（リポジトリ構成）

- **単一リポジトリ**: MVP はこのリポ内の Next.js アプリ 1 本で進める（モノレポのサブパッケージ分割はしない）。
- **Track B**（`claude agent teams`）: 同一リポに `agents/` 等を置くか別リポかは vault の ISS-07 で決定。未決定までは本リポをアプリ本体の正とする。

## スタック（予定）

- Next.js（App Router）, TypeScript, Tailwind CSS, shadcn/ui
- Supabase（Auth + DB）— 要件・引き継ぎは vault の `1_REQ-VibeFullstackBoot-要件定義.md` / `3_ISS-VibeFullstackBoot-03-認証DBコアAPI.md`

## ローカルパス

- 絶対: `C:\Users\kurak\Documents\repos\input_curator`
- vault からの相対: `../repos/input_curator`

## リモート

- **GitHub**: https://github.com/k-kura84/input_curator（`origin`、既定ブランチ **`main`**）
