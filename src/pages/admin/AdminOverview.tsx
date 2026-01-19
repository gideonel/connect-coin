import { Users, DollarSign, TrendingUp, Crown, AlertTriangle, MessageSquare } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { mockAnalytics, mockReports, mockAdminUsers } from '@/data/adminData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AdminOverview() {
  const pendingReports = mockReports.filter(r => r.status === 'pending').length;
  const activeUsers = mockAdminUsers.filter(u => u.status === 'active').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
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
          title="Premium Users"
          value={mockAnalytics.premiumUsers.toLocaleString()}
          change="+8.2% from last month"
          changeType="positive"
          icon={Crown}
          iconColor="bg-amber-100 text-amber-600"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${mockAnalytics.totalRevenue.toLocaleString()}`}
          change="+15.3% from last month"
          changeType="positive"
          icon={DollarSign}
          iconColor="bg-green-100 text-green-600"
        />
        <StatsCard
          title="Pending Reports"
          value={pendingReports}
          change={pendingReports > 0 ? "Needs attention" : "All clear"}
          changeType={pendingReports > 0 ? "negative" : "positive"}
          icon={AlertTriangle}
          iconColor="bg-red-100 text-red-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Revenue (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockAnalytics.revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v}`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`$${value}`, 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Signups Chart */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Daily Signups (Last 7 Days)</h3>
          <div className="h-64">
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Recent Reports</h3>
          <div className="space-y-3">
            {mockReports.slice(0, 4).map((report) => (
              <div key={report.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                <img 
                  src={report.photoUrl} 
                  alt={report.reportedName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{report.reportedName}</p>
                  <p className="text-xs text-muted-foreground">{report.reason}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  report.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  report.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                  report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {report.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Users by Plan */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Users by Plan</h3>
          <div className="space-y-4">
            {mockAnalytics.usersByPlan.map((item) => (
              <div key={item.plan} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">{item.plan}</span>
                  <span className="text-muted-foreground">{item.count.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      item.plan === 'Free' ? 'bg-gray-400' :
                      item.plan === 'Silver' ? 'bg-gray-500' :
                      item.plan === 'Gold' ? 'bg-amber-500' :
                      'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}
                    style={{ width: `${(item.count / mockAnalytics.totalUsers) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
