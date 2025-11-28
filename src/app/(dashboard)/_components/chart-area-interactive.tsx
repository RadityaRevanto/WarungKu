"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Calendar } from "lucide-react"

import { useIsMobile } from "@/src/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/src/components/ui/toggle-group"

export const description = "An interactive area chart"

type ChartPoint = {
  date: string
  totalAmount: number
  itemsSold: number
}

const fallbackChartData: ChartPoint[] = [
  { date: "2024-04-01", totalAmount: 0, itemsSold: 0 },
]

const chartConfig = {
  totalAmount: {
    label: "Omzet",
    color: "var(--primary)",
  },
  itemsSold: {
    label: "Item Terjual",
    color: "var(--primary)",
  },
} satisfies ChartConfig

type ChartAreaInteractiveProps = {
  data?: ChartPoint[]
  isLoading?: boolean
}

export function ChartAreaInteractive({ data, isLoading }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const chartData = data && data.length ? data : fallbackChartData

  const filteredData = React.useMemo(() => {
    const referenceDate =
      chartData.length > 0
        ? new Date(chartData[chartData.length - 1].date)
        : new Date()

    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract + 1)

    return chartData.filter((item) => {
      const date = new Date(item.date)
      return date >= startDate && date <= referenceDate
    })
  }, [chartData, timeRange])

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="text-black-600 size-5" />
          <CardTitle>Grafik Penjualan</CardTitle>
        </div>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Tren Penjualan harian Dan Mingguan
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="relative px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillOmzet" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-totalAmount)"
                  stopOpacity={0.9}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-totalAmount)"
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient id="fillItems" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-itemsSold)"
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-itemsSold)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="itemsSold"
              name="Item Terjual"
              type="linear"
              fill="url(#fillItems)"
              stroke="var(--color-itemsSold)"
              strokeWidth={2}
            />
            <Area
              dataKey="totalAmount"
              name="Omzet"
              type="linear"
              fill="url(#fillOmzet)"
              stroke="var(--color-totalAmount)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 text-sm font-medium text-muted-foreground">
            Memuat data laporan...
          </div>
        )}
        {!isLoading && data && data.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            Belum ada data penjualan pada rentang ini.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
