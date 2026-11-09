import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DayRecord } from '../lib/storage'
import { ALERT_LITERS, IDEAL_LITERS } from '../lib/consumption'
import { formatChartLabel, formatLiters, lastDays } from '../lib/format'

export function TrendChart({ days }: { days: DayRecord[] }) {
  const totalByDate = new Map(days.map((day) => [day.date, day.total]))
  const data = lastDays(7).map((date) => ({
    date,
    label: formatChartLabel(date),
    total: totalByDate.get(date) ?? 0,
  }))

  return (
    <div>
      <div className="h-64 w-full" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 14, right: 4, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="rgba(20,54,78,0.1)" strokeDasharray="3 4" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'rgba(20,54,78,0.58)', fontSize: 11 }}
              dy={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'rgba(20,54,78,0.5)', fontSize: 11 }}
              tickFormatter={(value: number) => `${value}`}
            />
            <Tooltip
              cursor={{ fill: 'rgba(20,54,78,0.05)' }}
              contentStyle={{
                borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.8)',
                background: 'rgba(245,251,255,0.96)',
                boxShadow: '0 18px 40px -24px rgba(11,34,53,0.55)',
                color: '#14364e',
                fontSize: 12,
              }}
              formatter={(value) => [`${formatLiters(Number(value))} L`, 'Consumo']}
              labelFormatter={(label) => `Dia ${label}`}
            />
            <ReferenceLine
              y={IDEAL_LITERS}
              stroke="#8a1c1c"
              strokeDasharray="5 4"
              ifOverflow="extendDomain"
              label={{
                value: `ideal ${IDEAL_LITERS} L`,
                position: 'insideTopRight',
                fill: '#8a1c1c',
                fontSize: 10,
              }}
            />
            <ReferenceLine
              y={ALERT_LITERS}
              stroke="#b45309"
              strokeDasharray="5 4"
              ifOverflow="extendDomain"
              label={{
                value: `alerta ${ALERT_LITERS} L`,
                position: 'insideTopRight',
                fill: '#b45309',
                fontSize: 10,
              }}
            />
            <Bar
              dataKey="total"
              fill="#0f80cd"
              radius={[8, 8, 2, 2]}
              maxBarSize={42}
              isAnimationActive
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.68rem] font-semibold text-navy/60">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-agua-600" /> Consumo
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-px w-4 border-t-2 border-dashed border-[#8a1c1c]" /> Ideal
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-px w-4 border-t-2 border-dashed border-warning" /> Alerta
        </span>
      </div>

      <table className="sr-only">
        <caption>Consumo dos últimos sete dias</caption>
        <thead>
          <tr>
            <th scope="col">Dia</th>
            <th scope="col">Consumo em litros</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.date}>
              <th scope="row">{item.date}</th>
              <td>{formatLiters(item.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
