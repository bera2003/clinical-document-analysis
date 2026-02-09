"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Moon,
  Bell,
  Brain,
  Shield,
  Save,
  LogOut,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Settings {
  darkMode: boolean;
  emailNotifications: boolean;
  autoExtraction: boolean;
  confidenceThreshold: number;
}

export default function SettingsPage() {
  const { logout } = useAuth();
  const router = useRouter();

  const [settings, setSettings] = useState<Settings>({
    darkMode: false,
    emailNotifications: true,
    autoExtraction: true,
    confidenceThreshold: 85,
  });

  const [saved, setSaved] = useState(false);

  /* Load saved settings */
  useEffect(() => {
    const stored = localStorage.getItem("app_settings");
    if (stored) {
      const parsed = JSON.parse(stored);
      setSettings(parsed);
      toggleDarkMode(parsed.darkMode);
    }
  }, []);

  /* Dark mode handler */
  const toggleDarkMode = (enabled: boolean) => {
    document.documentElement.classList.toggle("dark", enabled);
  };

  /* Update setting */
  const updateSetting = (key: keyof Settings, value: any) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "darkMode") toggleDarkMode(value);
      return updated;
    });
  };

  /* Save settings */
  const saveSettings = () => {
    localStorage.setItem("app_settings", JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  /* Logout everywhere */
  const logoutAll = async () => {
  await logout(); // logout already redirects
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Settings
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Customize your experience
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Application */}
          <Card className="backdrop-blur bg-white/70 dark:bg-slate-900/60 border-0 shadow-xl hover:shadow-2xl transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                  <Moon className="h-5 w-5 text-blue-600" />
                </div>
                Application
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Dark Mode</Label>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(v) =>
                    updateSetting("darkMode", v)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="backdrop-blur bg-white/70 dark:bg-slate-900/60 border-0 shadow-xl hover:shadow-2xl transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/40">
                  <Bell className="h-5 w-5 text-green-600" />
                </div>
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label>Email Notifications</Label>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(v) =>
                    updateSetting("emailNotifications", v)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* NLP Configuration */}
          <Card className="md:col-span-2 backdrop-blur bg-white/70 dark:bg-slate-900/60 border-0 shadow-xl hover:shadow-2xl transition">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                NLP Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="flex justify-between">
                  <span>Confidence Threshold</span>
                  <span className="font-semibold text-purple-600">
                    {settings.confidenceThreshold}%
                  </span>
                </Label>
                <Slider
                  value={[settings.confidenceThreshold]}
                  onValueChange={(v) =>
                    updateSetting("confidenceThreshold", v[0])
                  }
                  min={50}
                  max={100}
                  step={5}
                  className="mt-3"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Higher value = stricter entity extraction
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Label>Auto Entity Extraction</Label>
                <Switch
                  checked={settings.autoExtraction}
                  onCheckedChange={(v) =>
                    updateSetting("autoExtraction", v)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="md:col-span-2 backdrop-blur bg-white/70 dark:bg-slate-900/60 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={logoutAll}
              >
                <LogOut className="h-4 w-4" />
                Logout from all devices
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end items-center gap-4">
          {saved && (
            <span className="text-green-600 font-medium animate-pulse">
              ✔ Settings saved
            </span>
          )}
          <Button
            size="lg"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:opacity-90"
            onClick={saveSettings}
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
