"use client";

import { Bell, BookOpen, Home, Settings, Users } from "lucide-react";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({
  activeTab,
  onTabChange,
}: BottomNavigationProps) => {
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "prayers", icon: BookOpen, label: "My Prayers" },
    { id: "loved-ones", icon: Users, label: "Loved Ones" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "profile", icon: Settings, label: "Profile" },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center p-2 min-h-[60px]  cursor-pointer ${
              activeTab === id ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon size={20} />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
