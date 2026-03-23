# 天気ダッシュボード

> Open-Meteo API を利用し、都市・指標・期間を柔軟に切り替え可能な時系列天気予報可視化 SPA

---

## 目次

- [起動手順](#起動手順)
- [技術選定理由](#技術選定理由)
- [ディレクトリ構成](#ディレクトリ構成)
- [工夫点](#工夫点)
- [既知の制約](#既知の制約)

---

## 起動手順

### 前提条件

| ツール | バージョン |
| ------ | ---------- |
| Node.js | v20 以上 |
| npm | v10 以上 |

### セットアップ

```bash
# 1. リポジトリをクローン
git clone https://github.com/katsudon08/tamable-coding-test.git
cd tamable-coding-test

# 2. 依存パッケージをインストール
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開く。

### ビルド & プレビュー

```bash
npm run build     # 本番用ビルド
npm run preview   # ビルド成果物をローカルで確認
```

### テスト & Storybook

```bash
npm run test           # ユニット・統合テスト
npm run storybook      # UI コンポーネントのカタログ（Storybook）
npm run build-storybook # Storybook のビルド
```

---

## 技術選定理由

| カテゴリ | 採用技術 | 選定理由 |
| -------- | -------- | -------- |
| フレームワーク | React + Vite | HMR が高速で、シンプルな SPA 構成に最適。 |
| 言語 | TypeScript | `strict: true` 設定による厳格な型安全性の確保。 |
| 状態管理 | Zustand | シンプルな API と `persist` による localStorage 連携。 |
| データフェッチ | TanStack Query | 高度なキャッシュ制御とエラーハンドリングの一元化。 |
| チャート | Recharts | React に最適化された、宣言的で多機能なチャート描画。 |
| スタイリング | Tailwind CSS | ユーティリティファーストによる迅速かつ統一感のあるスタイリング。 |
| 日付処理 | date-fns | 軽量かつ型安全で、柔軟な日付フォーマットが可能。 |


---

## ディレクトリ構成

FSD（Feature-Sliced Design）アーキテクチャに基づき、関心事（レイヤーとスライス）を明確に分離しています。

```
src/
├── app/              # アプリ全体の初期化・プロバイダ
├── pages/            # ページコンポーネント
├── widgets/          # 複数機能を組み合わせた UI ブロック（Chart, ControlPanel）
├── features/         # ユーザー操作に紐づく機能単位（SelectCity, TogglePeriod等）
├── entities/         # ビジネスロジック・API・状態管理（Weatherドメイン）
└── shared/           # 汎用 UI・ユーティリティ
```

> `eslint-plugin-boundaries` により、レイヤー間の依存関係（pages → widgets → features → entities → shared）を機械的に担保しています。

---

## 工夫点

### 1. FSD アーキテクチャの徹底

レイヤーと責務を明示的に定義する FSD を採用。`eslint-plugin-boundaries` を導入することで、設計の意図に反する依存関係（例：下位から上位への参照）をビルド時に検出できるよう構成しました。

### 2. 高度なキャッシュと API 負荷軽減

TanStack Query を活用し、`staleTime` の適切な設定や入力値のデバウンスを実装。Open-Meteo API のレート制限に配慮しつつ、無駄なリクエストを排除し UX を向上させています。

### 3. フロントエンド主導の単位変換

API パラメータに依存せず、摂氏・華氏、秒速・時速の変換をフロントエンドのロジック層（`entities/weather/lib`）に集約。これにより、再フェッチなしで瞬時に表示単位を切り替えることが可能です。

---

## 既知の制約

| # | 内容 | 影響範囲 | 対応方針 |
| - | ---- | -------- | -------- |
| 1 | 7日間表示時の指標制限 | チャート画面 | API 仕様に基づき、7日間は最高/最低気温のみ表示可能としています。 |
| 2 | localStorage 依存 | 全体 | ユーザー設定の保存に localStorage を使用するため、シークレットブラウジング等ではリロード時に初期化されます。 |
| 3 | API レート制限 | 全体 | 無料版 API を使用しているため、短期間の過度なリクエストによりエラーが出る可能性があります。 |

---

## 作者

- **松原昭彦** — [@katsudon08](https://github.com/katsudon08)
