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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
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
            <div className="flex items-center justify-center text-center py-8 text-muted-foreground">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
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
