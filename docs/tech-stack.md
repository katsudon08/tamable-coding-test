# 技術スタック設計

## 技術スタック

| 分類 | 採用技術 |
|---|---|
| フレームワーク | React + Vite |
| 言語 | TypeScript（strict: true） |
| UIグローバル状態管理 | Zustand |
| サーバー状態管理 | TanStack Query |
| チャート | Recharts |
| スタイリング | Tailwind CSS |
| 日付処理 | date-fns |
| Linter / Formatter | ESLint + Prettier |

---

## 採用理由

**React + Vite**
1ページ完結のSPAであり、Next.jsのSSR/RSCは不要。ViteはHMRが高速で、シンプルなSPAに対してオーバースペックなボイラープレートを持ち込まない。

**TypeScript（strict: true）**
型安全性を最大限に確保し、APIレスポンスの型ミスや状態の取り扱い誤りをコンパイル時に検出する。採点観点にも型安全性が明示されているため、strictモードを採用する。

**Zustand**
都市・指標・期間・単位という横断的なUI状態を複数コンポーネントから参照・更新するため採用。Context + useReducerよりボイラープレートが少なく、Providerが不要なためReactツリーへの侵食がない。`persist` ミドルウェアによりlocalStorage永続化も宣言的に実現できる。

**TanStack Query**
Open-Meteo APIへのフェッチ・キャッシュ・ローディング/エラー状態・再フェッチ制御を一元管理できる。`staleTime` の設定で同一パラメータへの重複リクエストをキャッシュで吸収し、レート制限への配慮も容易。

**Recharts**
Reactコンポーネントとして宣言的に記述でき、多系列折れ線・ツールチップ・凡例・カスタムY軸/X軸フォーマットをシンプルなAPIで実現できる。

**Tailwind CSS**
ユーティリティファーストで素早くUIを構築できる。コンポーネントとスタイルの距離が近く、レスポンシブ対応も直感的に記述できる。

**date-fns**
関数型・immutableなAPIで型安全性が高く、Open-MeteoのISO 8601レスポンスのパースとX軸フォーマット（`MM/dd HH:mm` / `MM/dd`）を可読性高く記述できる。tree-shake可能なためバンドルサイズへの影響も最小限。

**ESLint + Prettier**
ESLintで静的解析・コード品質を担保し、Prettierでフォーマットを自動統一する。採点観点にリンター・フォーマッターの適切な設定・利用が明示されているため、両ツールを適切に設定する。

---

## スタックの詳細

### バージョン方針
全パッケージは導入時点の最新安定版を採用する。

### TanStack Query キャッシュ設定方針
- `staleTime`：5分（天気予報データは短時間で変化しないため、同一パラメータへの重複フェッチを抑制）
- `gcTime`：10分（非アクティブなキャッシュの保持期間）
- クエリキーは `[city, metrics, period]` の組み合わせで一意に管理する

### Zustand persist 設定方針
- 都市・指標・期間・単位の選択状態を localStorage に永続化する
- キーは `weather-dashboard-settings` とする

### ESLint 設定方針
- `@eslint/js` + `eslint-plugin-react` + `eslint-plugin-react-hooks` をベースとする
- `eslint-plugin-react-refresh` を追加し、Viteのfast refreshと連携する
- `@typescript-eslint` を追加し、TypeScript固有のルールを適用する
- Prettierとの競合ルールは `eslint-config-prettier` で無効化する
- `eslint-plugin-boundaries` を導入し、FSDのレイヤー間依存ルール（pages → widgets → features → entities → shared）をLintで強制する
