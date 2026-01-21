import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, MapPin, Clock, Plus, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { sampleUsers } from '@/data/sampleUsers';
import { format } from 'date-fns';

interface ScheduledDate {
  id: string;
  withUser: typeof sampleUsers[0];
  dateTime: string;
  location: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const DateScheduler = () => {
  const navigate = useNavigate();
  const [dates, setDates] = useState<ScheduledDate[]>([
    {
      id: '1',
      withUser: sampleUsers[0],
      dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Coffee House Downtown',
      notes: 'Looking forward to it!',
      status: 'confirmed',
    },
    {
      id: '2',
      withUser: sampleUsers[1],
      dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'City Park',
      status: 'pending',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDate, setNewDate] = useState({
    userId: '',
    dateTime: '',
    location: '',
    notes: '',
  });

  const handleCreateDate = () => {
    if (!newDate.dateTime || !newDate.location) return;

    const selectedUser = sampleUsers.find(u => u.id.toString() === newDate.userId) || sampleUsers[2];
    
    setDates([
      ...dates,
      {
        id: `date_${Date.now()}`,
        withUser: selectedUser,
        dateTime: new Date(newDate.dateTime).toISOString(),
        location: newDate.location,
        notes: newDate.notes,
        status: 'pending',
      },
    ]);

    setNewDate({ userId: '', dateTime: '', location: '', notes: '' });
    setIsDialogOpen(false);
  };

  const updateDateStatus = (id: string, status: ScheduledDate['status']) => {
    setDates(dates.map(d => d.id === id ? { ...d, status } : d));
  };

  const getStatusColor = (status: ScheduledDate['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background/80 backdrop-blur-lg border-b z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Date Scheduler
            </h1>
            <p className="text-sm text-muted-foreground">Plan your upcoming dates</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                New Date
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule a Date</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>With</Label>
                  <select 
                    className="w-full p-2 border rounded-lg bg-background"
                    value={newDate.userId}
                    onChange={(e) => setNewDate({ ...newDate, userId: e.target.value })}
                  >
                    <option value="">Select a match</option>
                    {sampleUsers.slice(0, 5).map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={newDate.dateTime}
                    onChange={(e) => setNewDate({ ...newDate, dateTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="Where will you meet?"
                    value={newDate.location}
                    onChange={(e) => setNewDate({ ...newDate, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Textarea
                    placeholder="Any notes for the date..."
                    value={newDate.notes}
                    onChange={(e) => setNewDate({ ...newDate, notes: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateDate} className="w-full">
                  Schedule Date
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {dates.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-1">No dates scheduled</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Start scheduling dates with your matches
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Schedule Your First Date
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {dates.map((date, index) => (
              <motion.div
                key={date.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl border p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={date.withUser.photos[0]}
                      alt={date.withUser.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{date.withUser.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${getStatusColor(date.status)}`}>
                        {date.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(date.dateTime), 'PPp')}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {date.location}
                      </span>
                    </div>
                    
                    {date.notes && (
                      <p className="text-sm text-muted-foreground">{date.notes}</p>
                    )}

                    {date.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateDateStatus(date.id, 'confirmed')}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Confirm
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => updateDateStatus(date.id, 'cancelled')}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DateScheduler;
