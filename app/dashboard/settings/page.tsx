"use client";

import { useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth-store";
import {
  SettingsNavigation,
  ProfileTab,
  NotificationsTab,
  TeamTab,
  PreferencesTab,
  SettingsTab,
} from "@/components/settings";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const handleTabChange = useCallback((tab: SettingsTab) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and application preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <SettingsNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === "profile" && <ProfileTab user={user} />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "team" && <TeamTab />}
          {activeTab === "preferences" && <PreferencesTab />}
        </div>
      </div>
    </div>
  );
}
