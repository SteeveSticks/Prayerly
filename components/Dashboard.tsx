"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Bell, Inbox, PenTool, Users } from "lucide-react";
import CommunityFeed from "./CommunityFeed";

interface DashboardProps {
  onCreatePrayer: () => void;
}

const Dashboard = ({ onCreatePrayer }: DashboardProps) => {
  const [dailyVerse, setDailyVerse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRandomVerse();
  }, []);

  const bibleRefs = [
    "John 3:16",
    "Romans 8:28",
    "Psalm 23:1",
    "Philippians 4:13",
    "Isaiah 41:10",
  ];

  const getRandomVerse = async () => {
    setLoading(true);
    const randomRef = bibleRefs[Math.floor(Math.random() * bibleRefs.length)];
    const res = await fetch(
      `https://bible-api.com/${encodeURIComponent(randomRef)}`
    );
    const data = await res.json();
    setDailyVerse(`${data.reference} - ${data.text}`);
    setLoading(false);
  };
  console.log(dailyVerse);

  return (
    <div className="pb-20 px-3 max-w-md mx-auto">
      {/* Daily Verse */}
      <Card className="mb-6 mt-4">
        <CardContent className="px-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">📖</span>
            <h3>Daily Verse</h3>
          </div>
          <p className="text-muted-foreground mb-3">
            {loading ? "Loading verse..." : dailyVerse}
          </p>
          <Button variant="outline" size="sm" onClick={getRandomVerse}>
            Reflect
          </Button>
        </CardContent>
      </Card>

      {/* Active Button */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button
          onClick={onCreatePrayer}
          variant="outline"
          className="h-16 flex flex-col gap-1 cursor-pointer"
        >
          <PenTool size={20} />
          <span>Write a Prayer</span>
        </Button>
        <Button
          variant="outline"
          className="h-16 flex flex-col gap-1 cursor-pointer"
        >
          <Users size={20} />
          <span>Shared Prayers</span>
        </Button>
        <Button
          variant="outline"
          className="h-16 flex flex-col gap-1 cursor-pointer"
        >
          <Inbox size={20} />
          <span>Prayer Requests</span>
        </Button>
        <Button
          variant="outline"
          className="h-16 flex flex-col gap-1 cursor-pointer"
        >
          <Bell size={20} />
          <span>Reminders</span>
        </Button>
      </div>

      {/* Feed */}
      <CommunityFeed />
    </div>
  );
};

export default Dashboard;
