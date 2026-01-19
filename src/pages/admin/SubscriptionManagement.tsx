import { useState } from 'react';
import { Crown, Users, DollarSign, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { mockSubscriptionPlans, SubscriptionPlan } from '@/data/adminData';
import { toast } from 'sonner';

export default function SubscriptionManagement() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockSubscriptionPlans);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SubscriptionPlan>>({});

  const totalSubscribers = plans.reduce((acc, p) => acc + p.subscribers, 0);
  const monthlyRevenue = plans.reduce((acc, p) => acc + (p.subscribers * p.price), 0);

  const startEditing = (plan: SubscriptionPlan) => {
    setEditingId(plan.id);
    setEditForm({ ...plan });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEditing = () => {
    if (!editingId || !editForm) return;
    setPlans(plans.map(p => 
      p.id === editingId ? { ...p, ...editForm } as SubscriptionPlan : p
    ));
    setEditingId(null);
    setEditForm({});
    toast.success('Plan updated successfully');
  };

  const togglePlanActive = (id: string) => {
    setPlans(plans.map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    ));
  };

  const getPlanGradient = (name: string) => {
    switch (name.toLowerCase()) {
      case 'silver': return 'from-gray-300 to-gray-400';
      case 'gold': return 'from-amber-400 to-amber-600';
      case 'platinum': return 'from-purple-400 to-pink-500';
      default: return 'from-gray-300 to-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Subscription Management</h1>
          <p className="text-muted-foreground">Manage premium plans and pricing</p>
        </div>
        <Button variant="gradient">
          <Plus className="w-4 h-4 mr-2" />
          Add Plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <Crown className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Subscribers</p>
              <p className="text-2xl font-bold text-foreground">{totalSubscribers.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold text-foreground">${monthlyRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold text-foreground">12.1%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`bg-card rounded-xl border overflow-hidden transition-all ${
              plan.active ? 'border-border' : 'border-dashed opacity-60'
            }`}
          >
            {/* Header */}
            <div className={`p-6 bg-gradient-to-r ${getPlanGradient(plan.name)} text-white`}>
              <div className="flex items-center justify-between mb-4">
                <Crown className="w-8 h-8" />
                <Switch
                  checked={plan.active}
                  onCheckedChange={() => togglePlanActive(plan.id)}
                />
              </div>
              
              {editingId === plan.id ? (
                <div className="space-y-2">
                  <Input
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={editForm.price || 0}
                      onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                      className="bg-white/20 border-white/30 text-white w-24"
                      step={0.01}
                    />
                    <span>/ month</span>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-serif font-bold">{plan.name}</h3>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-white/80">/{plan.period}</span>
                  </div>
                </>
              )}
            </div>

            {/* Features */}
            <div className="p-6">
              {editingId === plan.id ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Token Discount (%)</label>
                  <Input
                    type="number"
                    value={editForm.tokenDiscount || 0}
                    onChange={(e) => setEditForm({ ...editForm, tokenDiscount: parseInt(e.target.value) || 0 })}
                    min={0}
                    max={100}
                  />
                </div>
              ) : (
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              {/* Stats */}
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subscribers</span>
                  <span className="font-medium text-foreground">{plan.subscribers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Token Discount</span>
                  <span className="font-medium text-green-600">{plan.tokenDiscount}%</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                {editingId === plan.id ? (
                  <>
                    <Button variant="outline" className="flex-1" onClick={cancelEditing}>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button variant="gradient" className="flex-1" onClick={saveEditing}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1" onClick={() => startEditing(plan)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
