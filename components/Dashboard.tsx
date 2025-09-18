"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  Bell,
  Heart,
  Inbox,
  MessageCircle,
  PenTool,
  Users,
} from "lucide-react";
import { getAllPrayers } from "@/lib/actions/prayerly.actions";
import { useUser } from "@clerk/nextjs";

interface DashboardProps {
  onCreatePrayer: () => void;
}

const Dashboard = ({ onCreatePrayer }: DashboardProps) => {
  const user = useUser();
  const [dailyVerse, setDailyVerse] = useState("");
  const [prayerFeed, setPrayerFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const prayers = await getAllPrayers();
      setPrayerFeed(prayers);
      console.log(prayers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return "Just now";
  };

  return (
    <div className="pb-20 px-4 max-w-md mx-auto">
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
          <Button variant="outline" size="sm">
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
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🕊️</span>
          <h3>Feed (🌍 Community Prayers)</h3>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading prayers...
            </div>
          ) : prayerFeed.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No prayer from loved ones yet.</p>
              <p className="text-sm mt-2">
                Add some loved ones to see their prayers here.
              </p>
            </div>
          ) : (
            prayerFeed.map((item) => (
              <Card key={item.id}>
                <CardContent className="">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary">
                      {user.user?.firstName || "Unknown"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({item.author?.relationship || "Community"})
                    </span>
                    <span className="text-lg ml-auto">🙏</span>
                  </div>
                  <h4 className="text-sm mb-1">{item.title}</h4>
                  <p className="text-sm mb-3 text-muted-foreground">
                    &quot;{item.content}&quot;
                  </p>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={item.isPrayedByMe ? "default" : "outline"}
                      // onClick={() => !item.isPrayedByMe && handlePrayForPrayer(item.id)}
                      disabled={item.isPrayedByMe}
                    >
                      <MessageCircle size={14} className="mr-1" />
                      {item.isPrayedByMe ? "Prayed 🙏" : "I prayed"}
                    </Button>
                    <Button
                      size="sm"
                      variant={item.isEncouragedByMe ? "default" : "outline"}
                      // onClick={() => !item.isEncouragedByMe && handleEncouragePrayer(item.id)}
                      disabled={item.isEncouragedByMe}
                    >
                      <Heart size={14} className="mr-1" />
                      {item.isEncouragedByMe ? "Encouraged ❤️" : "❤️ Encourage"}
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {formatTimeAgo(item.created_at)}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="text-center py-4 text-muted-foreground">
          ⬇️ Scroll for more prayers
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
