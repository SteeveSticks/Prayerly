import { useEffect, useState } from "react";
import { getAllPrayers } from "@/lib/actions/prayerly.actions";
import PrayerCard from "./PrayerCard";
import { createClientSupabase } from "@/lib/supabase-client";

const CommunityFeed = () => {
  const [prayerFeed, setPrayerFeed] = useState<
    Array<{
      id: string;
      title: string;
      content: string;
      privacy: string;
      created_at: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadDashboardData();

    // Set up realtime subscription for prayers
    const supabase = createClientSupabase();
    const channel = supabase
      .channel("prayer_feed")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "prayer",
        },
        (payload) => {
          console.log("New prayer update:", payload);
          loadDashboardData(); // Refresh feed
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "prayer_likes",
        },
        (payload) => {
          console.log("Like update:", payload);
          loadDashboardData(); // Refresh to update like counts
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      const prayers = await getAllPrayers();
      // Sort by newest first (like Twitter)
      const sortedPrayers = prayers.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setPrayerFeed(sortedPrayers);
      console.log(sortedPrayers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Twitter-style Header */}
      <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b border-border/50 z-10">
        <div className="flex items-center gap-3 p-4">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">Prayerly Feed</h2>
            <p className="text-sm text-muted-foreground">
              Community prayers & encouragement
            </p>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <div className="divide-y divide-border/50">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground text-sm">
                Loading prayers...
              </p>
            </div>
          </div>
        ) : prayerFeed.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="text-6xl mb-4">🙏</div>
            <h3 className="text-lg font-semibold mb-2">No prayers yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share a prayer with the community
            </p>
            <p className="text-sm text-muted-foreground">
              Your prayers will appear here for others to see and encourage
            </p>
          </div>
        ) : (
          prayerFeed.map((item) => (
            <PrayerCard
              key={item.id}
              id={item.id}
              title={item.title}
              content={item.content}
              privacy={item.privacy}
              created_at={item.created_at}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {!loading && prayerFeed.length > 0 && (
        <div className="text-center py-6 text-muted-foreground text-sm">
          <p>✨ You&apos;re all caught up! ✨</p>
          <p className="mt-1">New prayers will appear here automatically</p>
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
