# アーキテクチャ設計

## 採用アーキテクチャ

**Feature-Sliced Design（FSD）**

## 採用理由

レイヤー単位の構成（components / hooks / stores）は小規模では手軽だが、機能が増えると関心事が分散しやすい。FSDはレイヤーと責務を明示的に定義するため、「どこに何を置くか」の判断基準が一貫する。今回は機能ドメイン（天気データ取得・チャート表示・コントロールパネル）が明確に分離できるため、FSDの恩恵を受けやすい。

## アーキテクチャの詳細

### ディレクトリ構成

```
src/
├── main.tsx
│
├── app/
│   ├── providers.tsx
│   └── index.css
│
├── pages/
│   └── weather/
│       ├── ui/
│       │   └── page.tsx
│       └── index.ts
│
├── widgets/
│   ├── control-panel/
│   │   ├── ui/
│   │   │   └── control-panel.tsx
│   │   └── index.ts
│   └── weather-chart/
│       ├── ui/
│       │   └── weather-chart.tsx
│       └── index.ts
│
├── features/
│   ├── select-city/
│   │   ├── ui/
│   │   │   └── city-select.tsx
│   │   └── index.ts
│   ├── select-metrics/
│   │   ├── ui/
│   │   │   └── metrics-select.tsx
│   │   └── index.ts
│   ├── toggle-period/
│   │   ├── ui/
│   │   │   └── period-toggle.tsx
│   │   └── index.ts
│   └── toggle-unit/
│       ├── ui/
│       │   └── unit-toggle.tsx
│       └── index.ts
│
├── entities/
│   └── weather/
│       ├── api/
│       │   └── weather-api.ts
│       ├── model/
│       │   ├── use-weather-query.ts
│       │   ├── weather-store.ts
│       │   └── types.ts
│       ├── lib/
│       │   ├── unit-converter.ts
│       │   └── weather-formatter.ts
│       ├── constants/
│       │   ├── cities.ts
│       │   └── metrics.ts
│       └── index.ts
│
└── shared/
    ├── ui/
    │   ├── select.tsx
    │   ├── toggle.tsx
    │   ├── spinner.tsx
    │   ├── error-message.tsx
    │   └── empty-state.tsx
    └── lib/
        └── debounce.ts
```

### レイヤーの依存ルール

FSDの原則に従い、**上位レイヤーは下位レイヤーのみ参照可**とする。

```
pages → widgets → features → entities → shared
```

同一レイヤー内のスライス間参照は禁止。共有したいロジックは `shared` 経由とする。

### 各レイヤーの責務

| レイヤー | 責務 |
|---|---|
| `app` | QueryClientProvider等のアプリ初期化。`main.tsx` はViteエントリポイントのためFSD外に配置 |
| `pages` | WidgetsをComposeするだけのページ相当エントリーポイント |
| `widgets` | ページを構成する自律的なUIブロック（ControlPanel・WeatherChart） |
| `features` | ユーザー操作に紐づく機能単位（都市選択・指標選択・期間切替・単位切替） |
| `entities` | 天気ドメインのモデル・APIフェッチ・Zustand store・定数 |
| `shared` | ドメイン非依存の汎用UIコンポーネント・ユーティリティ |

### 主要な責務の配置

| 関心事 | 配置先 |
|---|---|
| Open-Meteo APIフェッチ関数 | `entities/weather/api/weather-api.ts` |
| useQueryラッパーhook | `entities/weather/model/use-weather-query.ts` |
| Zustand store（UI状態） | `entities/weather/model/weather-store.ts` |
| 型定義（APIレスポンス・ドメイン型・ChartDataPoint） | `entities/weather/model/types.ts` |
| 単位変換ロジック（°C→°F・m/s→km/h） | `entities/weather/lib/unit-converter.ts` |
| APIレスポンス→ChartDataPoint整形 | `entities/weather/lib/weather-formatter.ts` |
| 都市リスト・lat/lon定数 | `entities/weather/constants/cities.ts` |
| 指標定義定数 | `entities/weather/constants/metrics.ts` |
| 汎用UIコンポーネント | `shared/ui/` |
| デバウンス | `shared/lib/debounce.ts` |
