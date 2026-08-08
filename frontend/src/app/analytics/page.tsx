"use client";

import { useEffect, useState } from "react";
import { getAnalytics } from "@/lib/api/analytics";
import { AnalyticsData } from "@/types";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Clock, Users, AlertCircle, RefreshCw } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { Button } from "@/components/ui/button";

const VOLUME_DATA = [
  { time: '08:00', patients: 12 },
  { time: '10:00', patients: 25 },
  { time: '12:00', patients: 45 },
  { time: '14:00', patients: 58 },
  { time: '16:00', patients: 40 },
  { time: '18:00', patients: 68 },
];

export default function AnalyticsPage() {
  const [kpis, setKpis] = useState<AnalyticsData | null>(null);
  const [severityData, setSeverityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnalytics();
      setKpis(data.kpis);
      setSeverityData(data.severityData);
    } catch (err: any) {
      setError(err.message || "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Clinical Analytics</h1>
          <p className="text-muted-foreground">Loading operations metrics...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <Card key={i} className="bg-card/50 border-border animate-pulse h-32"></Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/50 border-border animate-pulse h-96"></Card>
          <Card className="bg-card/50 border-border animate-pulse h-96"></Card>
        </div>
      </div>
    );
  }

  if (error || !kpis) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-7xl space-y-6">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-destructive">Error Loading Analytics</h2>
          <p className="text-muted-foreground mb-6">{error || "An unknown error occurred"}</p>
          <Button onClick={fetchAnalytics}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Clinical Analytics</h1>
          <p className="text-muted-foreground">Enterprise operations and triage performance metrics.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAnalytics}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-muted-foreground">Total Patients</span>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{kpis.patientsCount}</div>
            <p className="text-xs text-safe mt-2 flex items-center">Real-time DB count</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-muted-foreground">Critical Cases</span>
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div className="text-3xl font-bold">{kpis.criticalCases}</div>
            <p className="text-xs text-destructive mt-2 flex items-center">ESI Level 1 & 2</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-muted-foreground">Avg Triage Time</span>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold">{kpis.latency} min</div>
            <p className="text-xs text-safe mt-2 flex items-center">Performance SLA met</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-muted-foreground">AI Confidence</span>
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold">{kpis.avgConfidence}%</div>
            <p className="text-xs text-muted-foreground mt-2">Average across assessments</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
            <CardDescription>Current patient volume by triage level</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'hsl(var(--muted))'}}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '6px' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Patient Volume (24h)</CardTitle>
            <CardDescription>Emergency department arrivals</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={VOLUME_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '6px' }}
                />
                <Line type="monotone" dataKey="patients" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
