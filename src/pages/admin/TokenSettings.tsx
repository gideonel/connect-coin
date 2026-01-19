import { useState } from 'react';
import { Coins, MessageSquare, Phone, Video, Image, Sparkles, Zap, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { mockTokenSettings, mockCoinPackages, TokenSettings, CoinPackage } from '@/data/adminData';
import { toast } from 'sonner';

export default function TokenSettingsPage() {
  const [tokenSettings, setTokenSettings] = useState<TokenSettings>(mockTokenSettings);
  const [coinPackages, setCoinPackages] = useState<CoinPackage[]>(mockCoinPackages);
  const [hasChanges, setHasChanges] = useState(false);

  const handleTokenChange = (key: keyof TokenSettings, value: number) => {
    setTokenSettings({ ...tokenSettings, [key]: value });
    setHasChanges(true);
  };

  const handlePackageToggle = (id: string) => {
    setCoinPackages(coinPackages.map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    ));
    setHasChanges(true);
  };

  const handlePackageChange = (id: string, field: keyof CoinPackage, value: number) => {
    setCoinPackages(coinPackages.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
    setHasChanges(true);
  };

  const handleSave = () => {
    toast.success('Settings saved successfully');
    setHasChanges(false);
  };

  const handleReset = () => {
    setTokenSettings(mockTokenSettings);
    setCoinPackages(mockCoinPackages);
    setHasChanges(false);
    toast.info('Settings reset to defaults');
  };

  const tokenItems = [
    { key: 'messageTokenCost' as const, label: 'Message Cost', icon: MessageSquare, description: 'Tokens per message sent' },
    { key: 'voiceCallTokenPerMin' as const, label: 'Voice Call', icon: Phone, description: 'Tokens per minute' },
    { key: 'videoCallTokenPerMin' as const, label: 'Video Call', icon: Video, description: 'Tokens per minute' },
    { key: 'photoShareTokenCost' as const, label: 'Photo Share', icon: Image, description: 'Tokens per photo' },
    { key: 'superLikeTokenCost' as const, label: 'Super Like', icon: Sparkles, description: 'Tokens per super like' },
    { key: 'profileBoostTokenCost' as const, label: 'Profile Boost', icon: Zap, description: 'Tokens per boost' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Token Settings</h1>
          <p className="text-muted-foreground">Configure token costs and coin packages</p>
        </div>
        {hasChanges && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button variant="gradient" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Token Costs */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Coins className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Token Costs</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tokenItems.map((item) => (
            <div 
              key={item.key}
              className="p-4 bg-secondary/50 rounded-lg space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={tokenSettings[item.key]}
                  onChange={(e) => handleTokenChange(item.key, parseInt(e.target.value) || 0)}
                  className="w-24"
                  min={0}
                />
                <span className="text-sm text-muted-foreground">tokens</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Coin Packages */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-foreground">Coin Packages</h2>
          </div>
          <Button variant="outline" size="sm">
            Add Package
          </Button>
        </div>

        <div className="space-y-4">
          {coinPackages.map((pkg) => (
            <div 
              key={pkg.id}
              className={`p-4 rounded-lg border transition-all ${
                pkg.active 
                  ? 'bg-secondary/50 border-border' 
                  : 'bg-muted/30 border-dashed opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={pkg.active}
                      onCheckedChange={() => handlePackageToggle(pkg.id)}
                    />
                    <Badge variant={pkg.active ? 'default' : 'secondary'}>
                      {pkg.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Coins</label>
                      <Input
                        type="number"
                        value={pkg.coins}
                        onChange={(e) => handlePackageChange(pkg.id, 'coins', parseInt(e.target.value) || 0)}
                        className="w-24 mt-1"
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Price ($)</label>
                      <Input
                        type="number"
                        value={pkg.price}
                        onChange={(e) => handlePackageChange(pkg.id, 'price', parseFloat(e.target.value) || 0)}
                        className="w-24 mt-1"
                        min={0}
                        step={0.01}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Bonus</label>
                      <Input
                        type="number"
                        value={pkg.bonus}
                        onChange={(e) => handlePackageChange(pkg.id, 'bonus', parseInt(e.target.value) || 0)}
                        className="w-24 mt-1"
                        min={0}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{pkg.coins + pkg.bonus} coins</p>
                  <p className="text-sm text-muted-foreground">${pkg.price}</p>
                  {pkg.bonus > 0 && (
                    <p className="text-xs text-green-600">+{pkg.bonus} bonus</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Rate Info */}
      <div className="bg-gradient-to-r from-primary/10 to-coral/10 rounded-xl p-6 border border-primary/20">
        <h3 className="font-semibold text-foreground mb-2">💡 Token Economy</h3>
        <p className="text-sm text-muted-foreground">
          1 Coin = 1 Token. Premium users receive discounts on token costs based on their plan:
          Silver (10%), Gold (25%), Platinum (40%).
        </p>
      </div>
    </div>
  );
}
