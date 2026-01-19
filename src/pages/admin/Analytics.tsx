import { TrendingUp, Users, DollarSign, Crown, Globe, ArrowUp, ArrowDown } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { mockAnalytics } from '@/data/adminData';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

const COLORS = ['hsl(var(--muted-foreground))', 'hsl(var(--secondary-foreground))', 'hsl(var(--accent))', 'hsl(var(--primary))'];

export default function Analytics() {
  const avgRevenuePerUser = (mockAnalytics.totalRevenue / mockAnalytics.totalUsers).toFixed(2);
  const premiumPercentage = ((mockAnalytics.premiumUsers / mockAnalytics.totalUsers) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Detailed insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={mockAnalytics.totalUsers.toLocaleString()}
          change="+12.5% from last month"
          changeType="positive"
          icon={Users}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Active Users"
          value={mockAnalytics.activeUsers.toLocaleString()}
          change={`${((mockAnalytics.activeUsers / mockAnalytics.totalUsers) * 100).toFixed(1)}% of total`}
          changeType="neutral"
          icon={TrendingUp}
          iconColor="bg-green-100 text-green-600"
        />
        <StatsCard
          title="Avg Revenue/User"
          value={`$${avgRevenuePerUser}`}
          change="+5.2% from last month"
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-amber-100 text-amber-600"
        />
        <StatsCard
          title="Premium Rate"
          value={`${premiumPercentage}%`}
          change="+2.3% from last month"
          changeType="positive"
          icon={Crown}
          iconColor="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Revenue Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockAnalytics.revenueByDay}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Daily Signups</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAnalytics.dailySignups}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [value, 'Signups']}
                />
                <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users by Plan */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Users by Plan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockAnalytics.usersByPlan}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="plan"
                >
                  {mockAnalytics.usersByPlan.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={
                        entry.plan === 'Free' ? '#9ca3af' :
                        entry.plan === 'Silver' ? '#6b7280' :
                        entry.plan === 'Gold' ? '#f59e0b' :
                        '#ec4899'
                      } 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number, name: string) => [value.toLocaleString(), name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {mockAnalytics.usersByPlan.map((item, index) => (
              <div key={item.plan} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ 
                    backgroundColor: 
                      item.plan === 'Free' ? '#9ca3af' :
                      item.plan === 'Silver' ? '#6b7280' :
                      item.plan === 'Gold' ? '#f59e0b' :
                      '#ec4899'
                  }} 
                />
                <span className="text-sm text-muted-foreground">{item.plan}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-card rounded-xl border border-border p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Top Countries</h3>
          </div>
          <div className="space-y-4">
            {mockAnalytics.topCountries.map((country, index) => {
              const percentage = (country.users / mockAnalytics.totalUsers) * 100;
              return (
                <div key={country.country} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-medium text-muted-foreground w-6">
                        {index + 1}.
                      </span>
                      <span className="font-medium text-foreground">{country.country}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-foreground">{country.users.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground ml-2">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-coral rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Matches Today</span>
            <div className="flex items-center text-green-600">
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm">12%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">2,847</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Messages Sent</span>
            <div className="flex items-center text-green-600">
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm">8%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">48,291</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Voice Calls</span>
            <div className="flex items-center text-red-500">
              <ArrowDown className="w-4 h-4" />
              <span className="text-sm">3%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">1,204</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Video Calls</span>
            <div className="flex items-center text-green-600">
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm">15%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground mt-1">892</p>
        </div>
      </div>
    </div>
  );
}
