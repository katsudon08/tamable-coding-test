# コーディングルール

## 命名規則

| 対象 | 規則 | 例 |
|---|---|---|
| コンポーネント | PascalCase | `WeatherChart`, `CitySelect` |
| hooks | camelCase・`use` prefix | `useWeatherQuery`, `useWeatherStore` |
| 関数・変数 | camelCase | `fetchWeather`, `selectedCity` |
| 型・interface | PascalCase | `WeatherData`, `City` |
| 定数 | UPPER_SNAKE_CASE | `DEFAULT_CITY`, `API_BASE_URL` |
| ファイル名 | kebab-case | `weather-chart.tsx`, `use-weather-query.ts` |
| ディレクトリ名 | kebab-case | `select-city/`, `weather-chart/` |

---

## importルール

**スライス外からの参照はindex.ts経由のみ（FSD公開API）**

```ts
// ✅ 外部スライスからはindex.ts経由
import { WeatherChart } from '@/widgets/weather-chart';
import { useWeatherQuery } from '@/entities/weather';

// ❌ 内部セグメントへの直接参照は禁止
import { WeatherChart } from '@/widgets/weather-chart/ui/weather-chart';
```

**同スライス内は相対パス**

```ts
// ✅ 同スライス内は相対パス
import { weatherApi } from '../api/weather-api';

// ❌ 同スライス内でエイリアスは使わない
import { weatherApi } from '@/entities/weather/api/weather-api';
```

**shared層は直接セグメントにアクセス**

```ts
// ✅ shared層は直接セグメントにアクセス
import { Spinner } from '@/shared/ui/spinner';
import { debounce } from '@/shared/lib/debounce';

// ❌ shared層にindex.tsは置かない
import { Spinner } from '@/shared/ui';
```

**例外：セグメント内でモジュール分けを行った場合**

```
shared/
└── ui/
    └── select/         # モジュールディレクトリ
        ├── select.tsx
        ├── select-option.tsx
        └── index.ts    # ✅ このモジュール内のバレルファイルはOK
```

```ts
// ✅ モジュールディレクトリのindex.ts経由はOK
import { Select, SelectOption } from '@/shared/ui/select';
```

**importの順序（ESLintで強制）**

1. 外部ライブラリ（react, recharts 等）
2. 他レイヤー・他スライス（`@/widgets`, `@/features`, `@/entities`, `@/shared`）
3. 相対パス（`../`, `./`）

---

## ディレクトリ依存

FSDのレイヤー間依存ルールを `eslint-plugin-boundaries` で強制する。

```
pages → widgets → features → entities → shared
```

- 同一レイヤー内のスライス間参照は禁止
- 下位レイヤーから上位レイヤーへの参照は禁止
- `shared` はどのレイヤーからも参照可

---

## エラーハンドリング

**基本方針：TanStack Queryの `isError` で一元管理する**

```ts
const { data, isLoading, isError, refetch } = useWeatherQuery(params);

if (isLoading) return <Spinner />;
if (isError) return <ErrorMessage onRetry={refetch} />;
if (!data) return <EmptyState />;
```

- `isError` が `true` の場合、`shared/ui/error-message.tsx` のリトライボタン付きメッセージを表示する
- `refetch` をリトライ関数としてそのまま渡す
- fetchエラーはTanStack Queryが補足し、`isError` フラグとして呼び出し元に伝達する
