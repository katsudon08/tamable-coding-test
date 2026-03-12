---
trigger: always_on
---

# プロジェクト概要

Open-Meteo の Forecast API を利用し、都市・指標・期間を選択式UIで指定することで、時系列の天気情報をチャートとして可視化する1ページ完結のSPAです。

---

## プロダクト設計（詳細はdocs/product-design.mdを参照）

- 東京・大阪・札幌・福岡・那覇の5都市をセレクトボックスで選択できる
- 気温・体感温度・降水量・風速を複数同時選択し、多系列重ね描きができる
- 48時間（hourly）と7日間（daily）をトグルで切り替えられる
- 気温は °C / °F、風速は m/s / km/h をトグルで切り替えられる
- 都市・指標・期間・単位の選択状態を localStorage に永続化する
- Recharts の折れ線グラフでツールチップ・凡例・Y軸単位・X軸フォーマット付きで描画する
- ローディング中はスピナー、エラー時はリトライボタン付きメッセージ、指標未選択時は空状態を表示する

---

## アーキテクチャ構成（詳細はdocs/architecture.mdを参照）

Feature-Sliced Design（FSD）を採用する。

```
src/
├── main.tsx
├── app/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

レイヤーの依存方向は `pages → widgets → features → entities → shared` の一方向のみ。同一レイヤー内のスライス間参照は禁止。

---

## 技術スタック（詳細はdocs/tech-stack.mdを参照）

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

## コーディングルール（詳細はdocs/coding-rules.mdを参照）

- ファイル名・ディレクトリ名はkebab-case、コンポーネントはPascalCase、hooks は `use` prefix のcamelCase
- スライス外からの参照は `index.ts` 経由のみ（FSD公開API）
- 同スライス内は相対パス、他レイヤーは `@/` エイリアスを使用
- `shared` 層はindex.tsを置かず直接セグメントにアクセスする
- importの順序は「外部ライブラリ → 他レイヤー → 相対パス」
- `eslint-plugin-boundaries` でFSDのレイヤー間依存ルールをLintで強制する
- エラーハンドリングはTanStack Queryの `isError` で一元管理する

---

## API設計（詳細はdocs/api-design.mdを参照）

- エンドポイント：`https://api.open-meteo.com/v1/forecast`
- 48時間は `hourly`、7日間は `daily` パラメータを使い分ける
- 単位変換（°C→°F・m/s→km/h）はAPIパラメータでは行わず、フロントで変換する
- クエリキーは `['weather', city, period, [...metrics].sort()]` で一意に管理する
- `staleTime: 5分`、`gcTime: 10分` でキャッシュを管理する

---

## テスト戦略

Testing Trophyを採用し、TDDで開発する。

```
         / E2E \          # 最小限（主要な操作フローのみ）
       /  統合  \         # 重点的にカバー（useWeatherQuery・データ整形・store）
      / ユニット \        # ロジック単体（unit-converter・weather-formatter）
     /  静的解析  \       # TypeScript strict + ESLint（常時）
```

- **静的解析**：TypeScript（strict: true）・ESLint・eslint-plugin-boundariesで常時担保する
- **ユニットテスト**：`unit-converter.ts`・`weather-formatter.ts` 等の純粋関数を対象とする
- **統合テスト**：`useWeatherQuery`・Zustand store・データ整形フローを重点的にカバーする
- **E2E**：都市選択→チャート描画・期間切替・単位切替の主要操作フローのみを対象とする
- **Storybook**：`shared` レイヤーのUIコンポーネント（spinner・error-message・empty-state・select・toggle）に対して使用する