import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, MapPin, Landmark, Calendar } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

// Mock data for analytics
const provinceData = [
  { name: "Bali", cultures: 12, events: 8, regions: 5 },
  { name: "DI Yogyakarta", cultures: 10, events: 6, regions: 3 },
  { name: "Jawa Barat", cultures: 15, events: 9, regions: 6 },
  { name: "Jawa Tengah", cultures: 8, events: 5, regions: 4 },
  { name: "Jawa Timur", cultures: 14, events: 7, regions: 5 },
];

const cultureTypeData = [
  { name: "Dance", value: 18 },
  { name: "Music", value: 12 },
  { name: "Craft", value: 15 },
  { name: "Puppet", value: 8 },
  { name: "Ceremony", value: 10 },
  { name: "Culinary", value: 14 },
];

const eventTimelineData = [
  { month: "Jan", events: 4 },
  { month: "Feb", events: 6 },
  { month: "Mar", events: 8 },
  { month: "Apr", events: 5 },
  { month: "May", events: 7 },
  { month: "Jun", events: 10 },
  { month: "Jul", events: 12 },
  { month: "Aug", events: 9 },
  { month: "Sep", events: 6 },
  { month: "Oct", events: 8 },
  { month: "Nov", events: 7 },
  { month: "Dec", events: 11 },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
];

export default function HomeDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your super admin dashboard. Here's an overview of your
          cultural data.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Provinces
            </CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Regions</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+4 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Cultures
            </CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">59</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <p className="text-xs text-muted-foreground">+8 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cultures">Cultures</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cultures by Province</CardTitle>
                <CardDescription>
                  Distribution of cultural items across provinces
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    cultures: {
                      label: "Cultures",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <BarChart
                    data={provinceData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="cultures"
                      fill="hsl(var(--chart-1))"
                      name="Cultures"
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Events by Province</CardTitle>
                <CardDescription>
                  Distribution of events across provinces
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    events: {
                      label: "Events",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <BarChart
                    data={provinceData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="events"
                      fill="hsl(var(--chart-2))"
                      name="Events"
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Event Timeline</CardTitle>
                <CardDescription>
                  Number of events scheduled per month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    events: {
                      label: "Events",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <LineChart
                    data={eventTimelineData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="events"
                      stroke="hsl(var(--chart-3))"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Culture Types</CardTitle>
                <CardDescription>
                  Distribution of cultures by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={cultureTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {cultureTypeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="cultures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Culture Analytics</CardTitle>
              <CardDescription>
                Detailed analysis of cultural data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    cultures: {
                      label: "Cultures",
                      color: "hsl(var(--chart-1))",
                    },
                    regions: {
                      label: "Regions",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <BarChart
                    data={provinceData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="cultures"
                      fill="hsl(var(--chart-1))"
                      name="Cultures"
                    />
                    <Bar
                      dataKey="regions"
                      fill="hsl(var(--chart-2))"
                      name="Regions"
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Analytics</CardTitle>
              <CardDescription>Detailed analysis of event data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    events: {
                      label: "Events",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[400px]"
                >
                  <LineChart
                    data={eventTimelineData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="events"
                      stroke="hsl(var(--chart-3))"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
