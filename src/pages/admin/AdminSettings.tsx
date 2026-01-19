import { useState } from 'react';
import { Settings, Bell, Shield, Mail, Globe, Save, Database, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'SingleAnd Soaring',
    supportEmail: 'support@singleandsoaring.com',
    maintenanceMode: false,
    newUserSignups: true,
    emailVerification: true,
    autoModeration: true,
    minAge: 18,
    maxPhotos: 6,
    welcomeMessage: 'Welcome to SingleAnd Soaring! Start your journey to find meaningful connections.',
    termsUrl: 'https://singleandsoaring.com/terms',
    privacyUrl: 'https://singleandsoaring.com/privacy',
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure platform settings and preferences</p>
        </div>
        <Button variant="gradient" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* General Settings */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">General Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Site Name</label>
            <Input
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Support Email</label>
            <Input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-foreground">Welcome Message</label>
            <Textarea
              value={settings.welcomeMessage}
              onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Security & Access */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Security & Access</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Maintenance Mode</p>
              <p className="text-sm text-muted-foreground">Temporarily disable the platform for users</p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">New User Signups</p>
              <p className="text-sm text-muted-foreground">Allow new users to register</p>
            </div>
            <Switch
              checked={settings.newUserSignups}
              onCheckedChange={(checked) => setSettings({ ...settings, newUserSignups: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Email Verification</p>
              <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
            </div>
            <Switch
              checked={settings.emailVerification}
              onCheckedChange={(checked) => setSettings({ ...settings, emailVerification: checked })}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Auto Moderation</p>
              <p className="text-sm text-muted-foreground">Automatically flag suspicious content</p>
            </div>
            <Switch
              checked={settings.autoModeration}
              onCheckedChange={(checked) => setSettings({ ...settings, autoModeration: checked })}
            />
          </div>
        </div>
      </div>

      {/* User Limits */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Database className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">User Limits</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Minimum Age</label>
            <Input
              type="number"
              value={settings.minAge}
              onChange={(e) => setSettings({ ...settings, minAge: parseInt(e.target.value) || 18 })}
              min={18}
            />
            <p className="text-xs text-muted-foreground">Must be at least 18</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Max Photos per Profile</label>
            <Input
              type="number"
              value={settings.maxPhotos}
              onChange={(e) => setSettings({ ...settings, maxPhotos: parseInt(e.target.value) || 6 })}
              min={1}
              max={10}
            />
          </div>
        </div>
      </div>

      {/* Legal URLs */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Legal Pages</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Terms of Service URL</label>
            <Input
              value={settings.termsUrl}
              onChange={(e) => setSettings({ ...settings, termsUrl: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Privacy Policy URL</label>
            <Input
              value={settings.privacyUrl}
              onChange={(e) => setSettings({ ...settings, privacyUrl: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-red-700 mb-4">Danger Zone</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-700">Reset All Token Settings</p>
              <p className="text-sm text-red-600/70">This will reset all token costs to defaults</p>
            </div>
            <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
              Reset Tokens
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-700">Export User Data</p>
              <p className="text-sm text-red-600/70">Download all user data for backup</p>
            </div>
            <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
              Export Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
