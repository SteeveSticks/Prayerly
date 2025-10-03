import { Heart, HelpCircle, LogOut, Settings, Shield } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { Avatar } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Profile = () => {
  const user = useUser();
  const { setTheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // loadProfile();
  }, []);

  // const loadProfile = async () => {
  //   try {
  //     const data = await fetch("/api/profile");
  //     setProfile(await data.json());
  //   } catch (error) {
  //     console.error("Failed to load profile", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Handle signout

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const stats = [
    { label: "Prayers Written", value: profile?.totalPrayers || 0, icon: "✍️" },
    { label: "Days Streak", value: profile?.prayerStreak || 0, icon: "🔥" },
    {
      label: "Prayers for Others",
      value: profile?.prayersForOthers || 0,
      icon: "🙏",
    },
    { label: "Loved Ones", value: profile?.lovedOnesCount || 0, icon: "👥" },
  ];

  const menuItems = [
    { icon: <Settings size={20} />, label: "Settings", action: "settings" },
    { icon: <Shield size={20} />, label: "Privacy", action: "privacy" },
    { icon: <Heart size={20} />, label: "Support Us", action: "support" },
    {
      icon: <HelpCircle size={20} />,
      label: "Help & Feedback",
      action: "help",
    },
  ];

  return (
    <div className="pb-20 px-4 max-w-md mx-auto">
      <div className="py-4">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-4 py-8 text-center ">
            {loading ? (
              <div className="text-center text-muted-foreground">
                Loading profile...
              </div>
            ) : (
              <>
                <Avatar className="mx-auto items-center mb-4 bg-gray-200 dark:bg-gray-800 h-20 w-20 text-center justify-center">
                  <AvatarFallback className="text-xl">
                    {getInitials(user.user?.fullName || "User")}
                  </AvatarFallback>
                </Avatar>
                <h2>{user.user?.fullName}</h2>
                <p className="text-muted-foreground text-sm mb-2">
                  {user.user?.emailAddresses[0].emailAddress}
                </p>
                <Badge variant="secondary">Faithful Warrior 🛡️</Badge>
              </>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-2 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl mb-1">{stat.value}</div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-2 mb-2">
          {menuItems.map((item, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <CardContent className="px-5">
                <div className="flex items-center gap-3">
                  <div className="text-muted-foreground">{item.icon}</div>
                  <span className="flex-1">{item.label}</span>
                  <div className="text-muted-foreground text-sm">›</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* DarkMode */}
        <Card className="hover:bg-muted/50 transition-colors mb-6">
          <CardContent className="px-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p>Toggle Theme</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild className="cursor-pointert">
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Sign out */}
        <SignOutButton>
          <Button
            variant="outline"
            className="w-full cursor-pointer text-destructive border-destructive/20"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        </SignOutButton>

        {/* App Info */}
        <div className="text-center mt-6 text-muted-foreground text-sm">
          <p>Prayerly v1.0.0</p>
          <p>Made with ❤️ for faithful hearts</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
