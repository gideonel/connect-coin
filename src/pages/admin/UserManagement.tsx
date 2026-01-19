import { useState } from 'react';
import { Search, MoreVertical, Ban, CheckCircle, XCircle, Eye, Mail, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockAdminUsers, AdminUser } from '@/data/adminData';
import { toast } from 'sonner';

export default function UserManagement() {
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [premiumFilter, setPremiumFilter] = useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesPremium = premiumFilter === 'all' || user.premium === premiumFilter;
    return matchesSearch && matchesStatus && matchesPremium;
  });

  const handleStatusChange = (userId: string, newStatus: 'active' | 'suspended' | 'banned') => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    toast.success(`User status updated to ${newStatus}`);
  };

  const handleVerify = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, verified: true } : u));
    toast.success('User verified successfully');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground">Manage and moderate platform users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
        <Select value={premiumFilter} onValueChange={setPremiumFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="silver">Silver</SelectItem>
            <SelectItem value="gold">Gold</SelectItem>
            <SelectItem value="platinum">Platinum</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Plan</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Active</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Spent</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Reports</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose to-coral flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{user.name}</span>
                          {user.verified && (
                            <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-100" />
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge 
                      variant={
                        user.status === 'active' ? 'default' : 
                        user.status === 'suspended' ? 'secondary' : 'destructive'
                      }
                      className={
                        user.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                        user.status === 'suspended' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
                        ''
                      }
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      {user.premium !== 'free' && <Crown className="w-4 h-4 text-amber-500" />}
                      <span className="text-sm capitalize text-foreground">{user.premium}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">{user.joinedDate}</td>
                  <td className="p-4 text-sm text-muted-foreground">{user.lastActive}</td>
                  <td className="p-4 text-sm font-medium text-foreground">${user.totalSpent}</td>
                  <td className="p-4">
                    <span className={`text-sm font-medium ${user.reports > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {user.reports}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          {!user.verified && (
                            <DropdownMenuItem onClick={() => handleVerify(user.id)}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Verify User
                            </DropdownMenuItem>
                          )}
                          {user.status === 'active' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'suspended')}>
                              <XCircle className="w-4 h-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          )}
                          {user.status === 'suspended' && (
                            <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Reactivate User
                            </DropdownMenuItem>
                          )}
                          {user.status !== 'banned' && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(user.id, 'banned')}
                              className="text-red-600"
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              Ban User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>Showing {filteredUsers.length} of {users.length} users</span>
      </div>
    </div>
  );
}
