# セキュリティ実装ガイドライン (REQ-06)

本プロジェクト（input_curator）におけるセキュリティ対策のベースラインを以下に示します。

## 1. 認証と認可 (Supabase Auth & RLS)
- **Supabase Auth**: Next.js App Router と連携し、サーバーサイドでのセッション検証（`proxy.ts` / `middleware.ts`）を必須としています。
- **Row Level Security (RLS)**: PostgreSQL レベルで、すべてのテーブルに RLS を有効化しています。
  - `auth.uid() = user_id`: 各ユーザーは、自分が作成したデータのみを CRUD 可能です。
  - `anon` キーを用いた直接アクセスは、RLS によって安全に制限されています。

## 2. インジェクション対策
- **SQLi (SQL Injection)**: Supabase オートメーション（PostgREST）および Server Actions 内での Supabase クライアント利用により、クエリはすべてパラメータ化されており、開発者が直接生成した SQL 文字列を実行することはありません。
- **XSS (Cross-Site Scripting)**: 
  - React/Next.js のデフォルト機能により、JSX 内での出力は自動的にエスケープされます。
  - `dangerouslySetInnerHTML` の使用は原則禁止し、RSS コンテンツのパース・表示が必要な場合はサニタイズ処理を挟みます。

## 3. その他の対策
- **CSRF**: Server Actions は Next.js によって標準で CSRF 対策が施されています。
- **環境変数の秘匿**: サーバー専用の `service_role` キーはクライアントサイドに露出させないよう、`NEXT_PUBLIC_` プレフィックスを付けずに管理します。

## 4. 今後の課題
- レートリミットの実装（API経由の大量リクエスト対策）。
- セッションのタイムアウト設定。
