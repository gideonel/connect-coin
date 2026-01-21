import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Ban, Flag, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { sampleUsers } from '@/data/sampleUsers';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const REPORT_REASONS = [
  { id: 'inappropriate', label: 'Inappropriate content', icon: '🚫' },
  { id: 'spam', label: 'Spam or scam', icon: '📧' },
  { id: 'fake', label: 'Fake profile', icon: '🎭' },
  { id: 'harassment', label: 'Harassment or bullying', icon: '😤' },
  { id: 'underage', label: 'Appears underage', icon: '⚠️' },
  { id: 'other', label: 'Other', icon: '📝' },
];

const BlockReport = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('user') || '1';
  const action = searchParams.get('action') || 'report';
  
  const user = sampleUsers.find(u => u.id.toString() === userId) || sampleUsers[0];
  const { user: currentUser, updateProfile } = useAuth();

  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmBlock, setShowConfirmBlock] = useState(false);

  const isBlocked = currentUser?.blocked?.includes(userId);

  const handleBlock = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentBlocked = currentUser?.blocked || [];
    updateProfile({
      blocked: [...currentBlocked, userId],
    });
    
    toast.success(`${user.name} has been blocked`);
    setShowConfirmBlock(false);
    navigate(-1);
    setIsSubmitting(false);
  };

  const handleUnblock = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentBlocked = currentUser?.blocked || [];
    updateProfile({
      blocked: currentBlocked.filter(id => id !== userId),
    });
    
    toast.success(`${user.name} has been unblocked`);
    navigate(-1);
    setIsSubmitting(false);
  };

  const handleReport = async () => {
    if (!selectedReason) {
      toast.error('Please select a reason');
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const currentReported = currentUser?.reported || [];
    updateProfile({
      reported: [...currentReported, userId],
    });

    toast.success('Report submitted. Thank you for keeping our community safe.');
    navigate(-1);
    setIsSubmitting(false);
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
              {action === 'block' ? (
                <>
                  <Ban className="w-5 h-5 text-destructive" />
                  Block User
                </>
              ) : (
                <>
                  <Flag className="w-5 h-5 text-destructive" />
                  Report User
                </>
              )}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* User preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-card rounded-xl border mb-6"
        >
          <div className="w-16 h-16 rounded-full overflow-hidden">
            <img src={user.photos[0]} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-semibold">{user.name}, {user.age}</h3>
            <p className="text-sm text-muted-foreground">{user.location}</p>
          </div>
        </motion.div>

        {action === 'block' ? (
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">What happens when you block someone?</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• They won't be able to see your profile</li>
                    <li>• They won't be able to message you</li>
                    <li>• You won't see them in discovery</li>
                    <li>• Any existing matches will be removed</li>
                    <li>• They won't be notified that you blocked them</li>
                  </ul>
                </div>
              </div>
            </div>

            {isBlocked ? (
              <Button 
                onClick={handleUnblock} 
                className="w-full" 
                variant="outline"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Unblocking...' : 'Unblock User'}
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => setShowConfirmBlock(true)} 
                  className="w-full" 
                  variant="destructive"
                >
                  <Ban className="w-4 h-4 mr-2" />
                  Block {user.name}
                </Button>

                <Dialog open={showConfirmBlock} onOpenChange={setShowConfirmBlock}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Block</DialogTitle>
                    </DialogHeader>
                    <p className="text-muted-foreground">
                      Are you sure you want to block {user.name}? This action can be undone later.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setShowConfirmBlock(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="flex-1"
                        onClick={handleBlock}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Blocking...' : 'Block'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}

            <p className="text-center text-sm text-muted-foreground">
              You can also{' '}
              <button 
                onClick={() => navigate(`/block-report?user=${userId}&action=report`)}
                className="text-primary hover:underline"
              >
                report this user
              </button>
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Why are you reporting this user?</h3>
              <div className="space-y-2">
                {REPORT_REASONS.map((reason) => (
                  <button
                    key={reason.id}
                    onClick={() => setSelectedReason(reason.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3 ${
                      selectedReason === reason.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-xl">{reason.icon}</span>
                    <span className="flex-1">{reason.label}</span>
                    {selectedReason === reason.id && (
                      <Check className="w-5 h-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {selectedReason && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <label className="block text-sm font-medium mb-2">
                  Additional details (optional)
                </label>
                <Textarea
                  placeholder="Provide any additional context..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={4}
                />
              </motion.div>
            )}

            <Button 
              onClick={handleReport} 
              className="w-full"
              disabled={!selectedReason || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Your report is anonymous. We take all reports seriously.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BlockReport;
