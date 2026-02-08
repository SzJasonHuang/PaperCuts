import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboardApi } from '@/services/dashboardApi';
import { FileText, Droplets, TrendingUp, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface OrgMetrics {
  totalPagesSaved: number;
  totalInkSaved: number;
  avgOptimizingScore: number;
  totalSessions: number;
}

const Dashboard = () => {
  const [metrics, setMetrics] = useState<OrgMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await dashboardApi.getOrgMetrics();
        setMetrics(data);
      } catch (err) {
        setError('Failed to load metrics. Make sure the backend is running.');
        // Set mock data for demo purposes
        setMetrics({
          totalPagesSaved: 1247,
          totalInkSaved: 34.5,
          avgOptimizingScore: 78,
          totalSessions: 89,
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
    description,
  }: {
    title: string;
    value: string | number;
    unit?: string;
    icon: React.ElementType;
    description: string;
  }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">
          {value}
          {unit && <span className="text-lg font-normal text-muted-foreground ml-1">{unit}</span>}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Organization Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track your sustainability impact</p>
          </div>
          <Link to="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
                {error} (Showing demo data)
              </div>
            )}

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

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Environmental Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Trees saved (estimated)</span>
                    <span className="font-semibold text-primary">
                      {((metrics?.totalPagesSaved || 0) / 8333).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">CO₂ reduced (kg)</span>
                    <span className="font-semibold text-primary">
                      {((metrics?.totalPagesSaved || 0) * 0.005).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Water saved (liters)</span>
                    <span className="font-semibold text-primary">
                      {((metrics?.totalPagesSaved || 0) * 0.01).toFixed(1)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/" className="block">
                    <Button className="w-full" variant="default">
                      Optimize a PDF
                    </Button>
                  </Link>
                  <Button className="w-full" variant="outline" disabled>
                    Export Report (Coming Soon)
                  </Button>
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
