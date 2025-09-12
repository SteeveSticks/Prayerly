"use client";

import BottomNavigation from "@/components/BottomNavigation";
import Dashboard from "@/components/Dashboard";
import LovedOnes from "@/components/LovedOnes";
import MyPrayers from "@/components/MyPrayers";
import { Toaster } from "@/components/ui/sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");
  const [showPrayerCreation, setShowPrayerCreation] = useState(false);

  const handleCreatePrayer = () => {
    setShowPrayerCreation(true);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "home") {
      router.push("/home");
    } else if (tab === "prayers") {
      router.push("/prayers");
    } else if (tab === "loved-ones") {
      router.push("/loved-ones");
    } else if (tab === "notifications") {
      router.push("/notifications");
    }
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "home":
        return <Dashboard onCreatePrayer={handleCreatePrayer} />;
      case "prayer":
      // return <MyPrayer />
      case "loved-ones":
      // return <LovedOnes />;
      case "notifications":
      // return <Notifications />;
      case "profile":
      // return <Profile />;
      // default:
      //   return <Dashboard onCreatePrayer={handleCreatePrayer} />;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-center sticky top-0 bg-white border-b border-border z-40">
        <div className="flex items-center justify-center py-4 px-4 max-w-md max-auto">
          <h1 className="text-xl text-primary">🙏 Prayerly</h1>
        </div>
      </div>

      {/* Main content */}
      <main className="relative">
        <LovedOnes />
      </main>

      {/* Bottom navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      <Toaster />
    </div>
  );
};

export default Page;
