# API設計

## エンドポイント設計

ベースURL：`https://api.open-meteo.com/v1/forecast`

**48時間（hourly）**

```
GET /v1/forecast
  ?latitude={lat}
  &longitude={lon}
  &hourly=temperature_2m,apparent_temperature,precipitation,windspeed_10m
  &forecast_days=2
  &timezone=auto
  &temperature_unit=celsius
```

**7日間（daily）**

```
GET /v1/forecast
  ?latitude={lat}
  &longitude={lon}
  &daily=temperature_2m_max,temperature_2m_min
  &forecast_days=7
  &timezone=auto
  &temperature_unit=celsius
```

> 7日間表示では `temperature_2m_max / temperature_2m_min` のみ表示可能。体感温度・降水量・風速は48時間（hourly）でのみ選択可能とする。

---

## リクエスト設計

単位変換はAPIパラメータでは行わず、すべてフロント側で処理する。

| 指標 | API取得単位 | フロント変換 |
|---|---|---|
| 気温・体感温度 | °C（celsius固定） | °F表示時はフロントで変換 |
| 風速 | m/s | km/h表示時はフロントで変換 |
| 降水量 | mm | 変換なし |

---

## レスポンス型定義

共通部分をベース型として切り出し、hourly・dailyそれぞれとintersection typeで結合する。

```ts
// entities/weather/model/types.ts

type BaseResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
};

type HourlyResponse = BaseResponse & {
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    precipitation: number[];
    windspeed_10m: number[];
  };
};

type DailyResponse = BaseResponse & {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
};

// フェッチ関数・useWeatherQueryで使用する型
type City = 'tokyo' | 'osaka' | 'sapporo' | 'fukuoka' | 'naha';
type Period = '48h' | '7d';
type HourlyMetric = 'temperature_2m' | 'apparent_temperature' | 'precipitation' | 'windspeed_10m';
type DailyMetric = 'temperature_2m_max' | 'temperature_2m_min';
type Metric = HourlyMetric | DailyMetric;

type ChartDataPoint = {
  time: string;
  temperature_2m?: number;
  apparent_temperature?: number;
  precipitation?: number;
  windspeed_10m?: number;
  temperature_2m_max?: number;
  temperature_2m_min?: number;
};
```

---

## データ整形

APIレスポンス→`ChartDataPoint` への整形と単位変換は責務を分離し、それぞれ別ファイルで管理する。

```
entities/weather/lib/
├── unit-converter.ts    # °C→°F、m/s→km/h の変換のみ
└── weather-formatter.ts # APIレスポンス→ChartDataPoint への整形
```

```ts
// entities/weather/lib/weather-formatter.ts

export const formatHourlyData = (
  response: HourlyResponse,
  unit: Unit
): ChartDataPoint[] =>
  response.hourly.time.map((t, i) => ({
    time: format(new Date(t), 'MM/dd HH:mm'),
    temperature_2m: convertTemp(response.hourly.temperature_2m[i], unit),
    apparent_temperature: convertTemp(response.hourly.apparent_temperature[i], unit),
    precipitation: response.hourly.precipitation[i],
    windspeed_10m: convertWindSpeed(response.hourly.windspeed_10m[i], unit),
  }));

export const formatDailyData = (
  response: DailyResponse,
  unit: Unit
): ChartDataPoint[] =>
  response.daily.time.map((t, i) => ({
    time: format(new Date(t), 'MM/dd'),
    temperature_2m_max: convertTemp(response.daily.temperature_2m_max[i], unit),
    temperature_2m_min: convertTemp(response.daily.temperature_2m_min[i], unit),
  }));
```

```ts
// entities/weather/lib/unit-converter.ts

export const convertTemp = (celsius: number, unit: Unit): number =>
  unit.temp === 'F' ? (celsius * 9) / 5 + 32 : celsius;

export const convertWindSpeed = (ms: number, unit: Unit): number =>
  unit.wind === 'kmh' ? ms * 3.6 : ms;
```

---

## クエリキー設計

指標・期間・都市の組み合わせで一意に管理する。`metrics` は選択順序によるキャッシュ不一致を防ぐためソートして正規化する。

```ts
queryKey: ['weather', city, period, [...metrics].sort()]
// 例: ['weather', 'tokyo', '48h', ['apparent_temperature', 'temperature_2m']]
```

---

## フェッチ関数の設計

```ts
// entities/weather/api/weather-api.ts

type FetchHourlyParams = {
  city: City;
  metrics: HourlyMetric[];
};

type FetchDailyParams = {
  city: City;
};

export const fetchHourlyWeather = async (
  params: FetchHourlyParams
): Promise<HourlyResponse> => { ... };

export const fetchDailyWeather = async (
  params: FetchDailyParams
): Promise<DailyResponse> => { ... };
```

```ts
// entities/weather/model/use-weather-query.ts

export const useWeatherQuery = (
  city: City,
  period: Period,
  metrics: Metric[]
) => {
  return useQuery({
    queryKey: ['weather', city, period, [...metrics].sort()],
    queryFn: () =>
      period === '48h'
        ? fetchHourlyWeather({
            city,
            metrics: metrics.filter((m): m is HourlyMetric =>
              ['temperature_2m', 'apparent_temperature', 'precipitation', 'windspeed_10m'].includes(m)
            ),
          })
        : fetchDailyWeather({ city }), // 7d時はmetricsを無視しdaily固定
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
```
