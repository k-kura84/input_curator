# input_curator — AI エージェント向けメモ

@AGENTS.md（Next.js 16 の注意）を併読すること。

## コマンド

| 用途 | コマンド |
|------|----------|
| 開発サーバー | `npm run dev`（localhost:3000） |
| 本番ビルド | `npm run build` |
| 本番起動 | `npm start` |
| Lint | `npm run lint` |

## 構成（MVP スキャフォールド）

- **App Router**: `app/`（`app/page.tsx` がトップ）
- **UI**: `components/ui/`（shadcn/ui + `components.json`）
- **ユーティリティ**: `lib/utils.ts`（`cn`）
- **スタイル**: `app/globals.css`（Tailwind v4）

## 方針

- ドメイン・要件・ISS の正は vault（`02_PJ/VibeFullstackBoot/`）。コードは本リポ。
- Supabase は未接続。認証・DB は後続 ISS で接続する。
