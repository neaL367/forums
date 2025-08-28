"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Sample data for visitors
const visitorsData = [
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
];

// Sample data for members
const membersData = [
  { date: "2024-06-24", newMembers: 11, activeMembers: 72 },
  { date: "2024-06-25", newMembers: 12, activeMembers: 75 },
  { date: "2024-06-26", newMembers: 36, activeMembers: 158 },
  { date: "2024-06-27", newMembers: 38, activeMembers: 168 },
  { date: "2024-06-28", newMembers: 14, activeMembers: 80 },
  { date: "2024-06-29", newMembers: 10, activeMembers: 68 },
  { date: "2024-06-30", newMembers: 37, activeMembers: 162 },
];

// Sample data for topics
const topicsData = [
  { date: "2024-06-25", newTopics: 13, totalPosts: 62 },
  { date: "2024-06-26", newTopics: 34, totalPosts: 152 },
  { date: "2024-06-27", newTopics: 38, totalPosts: 168 },
  { date: "2024-06-28", newTopics: 15, totalPosts: 68 },
  { date: "2024-06-29", newTopics: 8, totalPosts: 38 },
  { date: "2024-06-30", newTopics: 36, totalPosts: 162 },
];

// Sample data for forums
const forumsData = [
  { date: "2024-06-24", newForums: 2, activeForums: 12 },
  { date: "2024-06-25", newForums: 3, activeForums: 16 },
  { date: "2024-06-26", newForums: 8, activeForums: 38 },
  { date: "2024-06-27", newForums: 10, activeForums: 43 },
  { date: "2024-06-28", newForums: 3, activeForums: 18 },
  { date: "2024-06-29", newForums: 2, activeForums: 11 },
  { date: "2024-06-30", newForums: 9, activeForums: 41 },
];

const visitorsConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const membersConfig = {
  members: {
    label: "Members",
  },
  newMembers: {
    label: "New Members",
    color: "var(--chart-3)",
  },
  activeMembers: {
    label: "Active Members",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const topicsConfig = {
  topics: {
    label: "Topics",
  },
  newTopics: {
    label: "New Topics",
    color: "var(--chart-5)",
  },
  totalPosts: {
    label: "Total Posts",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const forumsConfig = {
  forums: {
    label: "Forums",
  },
  newForums: {
    label: "New Forums",
    color: "var(--chart-2)",
  },
  activeForums: {
    label: "Active Forums",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

interface ChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  config: ChartConfig;
  title: string;
  description: string;
  dataKeys: {
    key1: string;
    key2: string;
  };
}

function BaseChart({ data, config, title, description, dataKeys }: ChartProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            <span className="hidden @[540px]/card:block">{description}</span>
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
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={config}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient
                  id={`fill${dataKeys.key1}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--color-chart-1)`}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-chart-1)`}
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id={`fill${dataKeys.key2}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--color-chart-4`}
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-chart-4`}
                    stopOpacity={0.1}
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
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                defaultIndex={isMobile ? -1 : 10}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey={dataKeys.key1}
                type="natural"
                fill={`url(#fill${dataKeys.key1})`}
                stroke={`var(--color-chart-1)`}
                stackId="a"
              />
              <Area
                dataKey={dataKeys.key2}
                type="natural"
                fill={`url(#fill${dataKeys.key2})`}
                stroke={`var(--color-chart-4`}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export function VisitorsChart() {
  return (
    <BaseChart
      data={visitorsData}
      config={visitorsConfig}
      title="Total Visitors"
      description="Desktop and mobile visitors for the last 3 months"
      dataKeys={{ key1: "mobile", key2: "desktop" }}
    />
  );
}

export function MembersChart() {
  return (
    <BaseChart
      data={membersData}
      config={membersConfig}
      title="Members Activity"
      description="New and active members for the last 3 months"
      dataKeys={{ key1: "newMembers", key2: "activeMembers" }}
    />
  );
}

export function TopicsChart() {
  return (
    <BaseChart
      data={topicsData}
      config={topicsConfig}
      title="Topics & Posts"
      description="New topics and total posts for the last 3 months"
      dataKeys={{ key1: "newTopics", key2: "totalPosts" }}
    />
  );
}

export function ForumsChart() {
  return (
    <BaseChart
      data={forumsData}
      config={forumsConfig}
      title="Forums Activity"
      description="New and active forums for the last 3 months"
      dataKeys={{ key1: "newForums", key2: "activeForums" }}
    />
  );
}
