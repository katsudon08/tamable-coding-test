import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Bar,
  Area,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { METRICS } from '../constants/metrics'
import type { ChartDataPoint, Metric, Period, UnitState } from '../model/types'

type WeatherChartProps = {
  data: ChartDataPoint[]
  metrics: Metric[]
  period: Period
  unitState: UnitState
}

function SectionTitle({ title, color, isActive }: { title: string; color: string; isActive: boolean }) {
  return (
    <div className={`flex items-center gap-2 font-bold mb-2 ml-1 ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
      <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: isActive ? color : '#cbd5e1' }} />
      <span>{title}</span>
    </div>
  )
}

function ChartContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-[280px] bg-[#F8F7F3] rounded-xl border border-slate-200 p-4 pt-6 pb-2">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

function Placeholder({ text }: { text: string }) {
  return (
    <div className="w-full h-[60px] flex items-center justify-center bg-[#fdfdfc] rounded-xl border border-dashed border-slate-300 text-slate-400 text-sm">
      {text}
    </div>
  )
}

// X軸のラベルフォーマット
const formatXAxisDate = (val: unknown, _index: number, period: Period) => {
  if (typeof val !== 'string') return val as string
  try {
    const date = parseISO(val)
    if (period === '48h') {
      return format(date, 'MM/dd HH:mm')
    }
    return format(date, 'MM/dd')
  } catch {
    return val
  }
}

const getMetricUnit = (metric: Metric, unitState: UnitState) => {
  if (metric.includes('temperature')) return unitState.temp === 'C' ? '°C' : '°F'
  if (metric === 'precipitation') return 'mm'
  if (metric === 'windspeed_10m') return unitState.wind === 'ms' ? 'm/s' : 'km/h'
  return ''
}

// デフォルトツールチップの代わりに独自ツールチップを定義し、temp_rangeを除外する
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label, period, unitState }: any) => {
  if (active && payload && payload.length) {
    // temp_rangeのデータポイントはTooltipから除外する
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredPayload = payload.filter((p: any) => p.dataKey !== 'temp_range')
    
    return (
      <div className="bg-white/95 p-3 border border-slate-200 shadow-sm rounded-xl text-xs min-w-[140px]">
        <p className="font-bold text-slate-700 mb-2">{formatXAxisDate(label, 0, period)}</p>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {filteredPayload.map((p: any) => {
          const labelName = METRICS[p.dataKey as Metric]?.label ?? String(p.dataKey)
          const unit = getMetricUnit(p.dataKey as Metric, unitState)
          const numericValue = typeof p.value === 'number' ? p.value.toFixed(1) : p.value
          return (
            <div key={p.dataKey} className="flex items-center gap-2 mt-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></span>
              <span className="text-slate-500 whitespace-nowrap">{labelName}:</span>
              <span className="font-bold text-slate-800 ml-auto">{numericValue} {unit}</span>
            </div>
          )
        })}
      </div>
    )
  }
  return null
}

// カスタム凡例（テキストの高さとアイコンを完璧に揃える）
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderCustomLegend = (props: any) => {
  const { payload } = props
  if (!payload) return null

  return (
    <ul className="flex items-center justify-center gap-6 text-[12px] text-slate-600 h-[36px]">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((entry: any, index: number) => {
        if (entry.value === 'temp_range') return null
        const stringName = String(entry.value) as Metric
        const label = METRICS[stringName]?.label ?? stringName

        return (
          <li key={`legend-${index}`} className="flex items-center gap-1.5 leading-none">
            {stringName === 'precipitation' ? (
              // フォントの文字高（1em）と完全に同一サイズの四角形
              <div className="w-[1em] h-[1em] rounded-sm" style={{ backgroundColor: entry.color }} />
            ) : stringName === 'apparent_temperature' ? (
              // 体感温度（破線）
              <div className="w-4 h-[2px] border-b-[2px] border-dashed" style={{ borderColor: entry.color }} />
            ) : (
              // その他（実線）
              <div className="w-4 h-[2px]" style={{ backgroundColor: entry.color }} />
            )}
            <span>{label}</span>
          </li>
        )
      })}
    </ul>
  )
}

// X軸の縦線区切り用カスタムグリッド（最背面に描画されるCartesianGridに相乗りさせる）
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomVerticalGrid = (props: any) => {
  const { verticalPoints, y, height } = props
  if (!verticalPoints) return null

  return (
    <g>
      {verticalPoints.map((xPos: number, index: number) => (
        <line 
          key={`v-grid-${index}`} 
          x1={xPos} 
          y1={y} 
          x2={xPos} 
          y2={y + height} 
          stroke="#cbd5e1" 
          strokeDasharray="4 4" 
        />
      ))}
    </g>
  )
}

export function WeatherChart({
  data,
  metrics,
  period,
  unitState,
}: WeatherChartProps) {
  const hasTemp = metrics.includes('temperature_2m') || metrics.includes('apparent_temperature')
  const hasPrecip = metrics.includes('precipitation')
  const hasWind = metrics.includes('windspeed_10m')

  if (period === '7d') {
    // Areaの塗りつぶし用に [min, max] の配列を持ったデータを生成
    const dailyData = data.map((d) => ({
      ...d,
      temp_range: [d.temperature_2m_min ?? 0, d.temperature_2m_max ?? 0],
    }))

    return (
      <div className="w-full space-y-8 pb-4">
        <div>
          <SectionTitle title="最高気温 / 最低気温" color="#ef4444" isActive={true} />
          <ChartContainer>
            <ComposedChart data={dailyData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
              <CartesianGrid vertical={<CustomVerticalGrid />} horizontal={true} strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" tickFormatter={(v, i) => formatXAxisDate(v, i, period)} axisLine={{ stroke: '#cbd5e1' }} tickLine={{ stroke: '#cbd5e1' }} tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-45} textAnchor="end" height={70} tickMargin={8} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v}${getMetricUnit('temperature_2m_max', unitState)}`} className="text-xs text-slate-500" width={60} />
              <Tooltip content={<CustomTooltip period={period} unitState={unitState} />} cursor={{ fill: '#f1f5f9' }} />
              <Legend verticalAlign="bottom" content={renderCustomLegend} />
              <Area type="monotone" dataKey="temp_range" fill="#f3e8ff" stroke="none" activeDot={false} legendType="none" />
              <Line type="monotone" dataKey="temperature_2m_max" stroke="#ef4444" strokeWidth={2} dot={true} />
              <Line type="monotone" dataKey="temperature_2m_min" stroke="#3b82f6" strokeWidth={2} dot={true} />
            </ComposedChart>
          </ChartContainer>
        </div>
      </div>
    )
  }

  // 48時間（Hourly）の場合
  return (
    <div className="w-full space-y-6 pb-4">
      {/* 気温 / 体感温度 */}
      <div>
        <SectionTitle title="気温 / 体感温度" color="#f97316" isActive={hasTemp} />
        {hasTemp ? (
          <ChartContainer>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
              <CartesianGrid vertical={<CustomVerticalGrid />} horizontal={true} strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" tickFormatter={(v, i) => formatXAxisDate(v, i, period)} axisLine={{ stroke: '#cbd5e1' }} tickLine={{ stroke: '#cbd5e1' }} tick={{ fontSize: 10, fill: '#64748b' }} interval={5} angle={-45} textAnchor="end" height={70} tickMargin={8} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v}${getMetricUnit('temperature_2m', unitState)}`} className="text-xs text-slate-500" width={60} />
              <Tooltip content={<CustomTooltip period={period} unitState={unitState} />} cursor={{ fill: '#f1f5f9' }} />
              <Legend verticalAlign="bottom" content={renderCustomLegend} />
              {metrics.includes('temperature_2m') && (
                <Line type="monotone" dataKey="temperature_2m" stroke="#f97316" strokeWidth={2} />
              )}
              {metrics.includes('apparent_temperature') && (
                <Line type="monotone" dataKey="apparent_temperature" stroke="#60A5FA" strokeWidth={2} />
              )}
            </LineChart>
          </ChartContainer>
        ) : (
          <Placeholder text="気温のチェックをONにすると表示されます" />
        )}
      </div>

      {/* 降水量 */}
      <div>
        <SectionTitle title="降水量" color="#14b8a6" isActive={hasPrecip} />
        {hasPrecip ? (
          <ChartContainer>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
              <CartesianGrid vertical={<CustomVerticalGrid />} horizontal={true} strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" tickFormatter={(v, i) => formatXAxisDate(v, i, period)} axisLine={{ stroke: '#cbd5e1' }} tickLine={{ stroke: '#cbd5e1' }} tick={{ fontSize: 10, fill: '#64748b' }} interval={5} angle={-45} textAnchor="end" height={70} tickMargin={8} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v}mm`} className="text-xs text-slate-500" width={60} />
              <Tooltip content={<CustomTooltip period={period} unitState={unitState} />} cursor={{ fill: '#14b8a528' }} />
              <Legend verticalAlign="bottom" content={renderCustomLegend} />
              <Bar dataKey="precipitation" fill="#14b8a6" activeBar={{ fill: '#14b8a5af' }} radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ChartContainer>
        ) : (
          <Placeholder text="降水量のチェックをONにすると表示されます" />
        )}
      </div>

      {/* 風速 */}
      <div>
        <SectionTitle title="風速" color="#0ccc3cff" isActive={hasWind} />
        {hasWind ? (
          <ChartContainer>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
              <CartesianGrid vertical={<CustomVerticalGrid />} horizontal={true} strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" tickFormatter={(v, i) => formatXAxisDate(v, i, period)} axisLine={{ stroke: '#cbd5e1' }} tickLine={{ stroke: '#cbd5e1' }} tick={{ fontSize: 10, fill: '#64748b' }} interval={5} angle={-45} textAnchor="end" height={70} tickMargin={8} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v}${getMetricUnit('windspeed_10m', unitState)}`} className="text-xs text-slate-500" width={60} />
              <Tooltip content={<CustomTooltip period={period} unitState={unitState} />} cursor={{ fill: '#f1f5f9' }} />
              <Legend verticalAlign="bottom" content={renderCustomLegend} />
              <Line type="monotone" dataKey="windspeed_10m" stroke="#0ccc3cff" strokeWidth={2} dot={true} />
            </LineChart>
          </ChartContainer>
        ) : (
          <Placeholder text="風速のチェックをONにすると表示されます" />
        )}
      </div>
    </div>
  )
}
