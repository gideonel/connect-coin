import { useState } from 'react';
import { Search, CheckCircle, XCircle, Eye, AlertTriangle, Clock, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockReports, Report } from '@/data/adminData';
import { toast } from 'sonner';

export default function ContentModeration() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.reportedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (reportId: string, newStatus: Report['status']) => {
    setReports(reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
    setSelectedReport(null);
    toast.success(`Report marked as ${newStatus}`);
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'reviewed': return 'bg-blue-100 text-blue-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'dismissed': return 'bg-gray-100 text-gray-700';
    }
  };

  const getReasonIcon = (reason: string) => {
    if (reason.toLowerCase().includes('inappropriate')) return '🚫';
    if (reason.toLowerCase().includes('spam')) return '📧';
    if (reason.toLowerCase().includes('harassment')) return '😡';
    if (reason.toLowerCase().includes('fake')) return '🎭';
    return '⚠️';
  };

  const pendingCount = reports.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Content Moderation</h1>
          <p className="text-muted-foreground">Review and manage reported content</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">{pendingCount} pending reports</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report) => (
          <div 
            key={report.id}
            className="bg-card rounded-xl border border-border p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedReport(report)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <img 
                  src={report.photoUrl} 
                  alt={report.reportedName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">{report.reportedName}</p>
                  <p className="text-xs text-muted-foreground">Reported by {report.reporterName}</p>
                </div>
              </div>
              <Badge className={getStatusColor(report.status)}>
                {report.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getReasonIcon(report.reason)}</span>
                <span className="text-sm font-medium text-foreground">{report.reason}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{report.description}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {report.createdAt}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">All caught up!</h3>
          <p className="text-muted-foreground">No reports match your filters</p>
        </div>
      )}

      {/* Report Detail Dialog */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>Review and take action on this report</DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4">
              {/* Reported User */}
              <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
                <img 
                  src={selectedReport.photoUrl} 
                  alt={selectedReport.reportedName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-foreground">{selectedReport.reportedName}</p>
                  <p className="text-sm text-muted-foreground">Reported User</p>
                </div>
              </div>

              {/* Report Info */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reason</label>
                  <p className="text-foreground">{selectedReport.reason}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-foreground">{selectedReport.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reported by</label>
                  <p className="text-foreground">{selectedReport.reporterName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date</label>
                  <p className="text-foreground">{selectedReport.createdAt}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleUpdateStatus(selectedReport.id, 'dismissed')}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Dismiss
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleUpdateStatus(selectedReport.id, 'reviewed')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Mark Reviewed
                </Button>
                <Button 
                  variant="gradient" 
                  className="flex-1"
                  onClick={() => handleUpdateStatus(selectedReport.id, 'resolved')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Resolve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
