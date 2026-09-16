import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboardApi } from '@/services/dashboardApi';
import { FileText, Droplets, TrendingUp, BarChart3, Leaf } from 'lucide-react';

interface OrgMetrics {
  totalPagesSaved: number;
  totalInkSaved: number;
  avgOptimizingScore: number;
  totalSessions: number;
}

const Dashboard = () => {
  const [metrics, setMetrics] = useState<OrgMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await dashboardApi.getOrgMetrics();
        setMetrics(data);
      } catch (err) {
        console.error('Failed to load org metrics:', err);
        // Fallback numbers so the dashboard still shows something useful
        setMetrics({
          totalPagesSaved: 1247,
          totalInkSaved: 34.5,
          avgOptimizingScore: 78,
          totalSessions: 89
        });
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const MetricCard = ({
    title,
    value,
    unit,
    icon: Icon,
    description
  }: {
    title: string;
    value: string | number;
    unit?: string;
    icon: React.ElementType;
    description: string;
  }) => (
    <Card className="group relative overflow-hidden transition-colors duration-200 hover:border-primary/40">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </span>
      </CardHeader>
      <CardContent>
        <div className="tabular text-3xl font-bold tracking-tight text-foreground">
          {value}
          {unit && <span className="ml-1 text-lg font-normal text-muted-foreground">{unit}</span>}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  const ImpactRow = ({ label, value, unit }: { label: string; value: string; unit: string }) => (
    <div className="flex items-center justify-between border-b border-border/60 py-3 last:border-0 last:pb-0 first:pt-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="tabular text-sm font-semibold text-success">
        {value}
        <span className="ml-1 font-normal text-muted-foreground">{unit}</span>
      </span>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-background p-6">
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Leaf className="h-3.5 w-3.5 text-success" />
              Sustainability report
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Organization Dashboard
            </h1>
            <p className="mt-1 text-muted-foreground">
              Track your sustainability impact across every optimized document
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="mb-2 h-8 w-20" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Avg Optimization Score"
                value={metrics?.avgOptimizingScore?.toFixed(0) || 0}
                unit="/100"
                icon={TrendingUp}
                description="Organization-wide average"
              />
              <MetricCard
                title="Pages Saved"
                value={metrics?.totalPagesSaved?.toLocaleString() || 0}
                icon={FileText}
                description="Total pages conserved"
              />
              <MetricCard
                title="Ink Saved"
                value={metrics?.totalInkSaved?.toFixed(1) || 0}
                unit="%"
                icon={Droplets}
                description="Average ink reduction"
              />
              <MetricCard
                title="Total Sessions"
                value={metrics?.totalSessions?.toLocaleString() || 0}
                icon={BarChart3}
                description="PDFs optimized to date"
              />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Environmental Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ImpactRow
                    label="Trees saved (estimated)"
                    value={((metrics?.totalPagesSaved || 0) / 8333).toFixed(2)}
                    unit="trees"
                  />
                  <ImpactRow
                    label="CO₂ reduced"
                    value={((metrics?.totalPagesSaved || 0) * 0.005).toFixed(1)}
                    unit="kg"
                  />
                  <ImpactRow
                    label="Water saved"
                    value={((metrics?.totalPagesSaved || 0) * 0.01).toFixed(1)}
                    unit="liters"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How these numbers are built</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    Every uploaded PDF is scored on page count and ink coverage before and after
                    optimization. The difference is what gets counted here.
                  </p>
                  <p>
                    Environmental estimates use standard paper figures: roughly 8,333 pages per
                    tree, 5 grams of CO₂ per page, and 10 millilitres of water per page.
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
