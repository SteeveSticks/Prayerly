"use client";

import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";

const MyPrayers = () => {
  const [prayers, setPrayers] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   loadPrayers()
  // })

  const loadPrayers = async () => {
    try {
      const [prayersData, profileData] = await Promise.all([
        api.getMyPrayers(),
        api.getProfile(),
      ]);

      setPrayers(prayersData || []);
      setProfile(profileData.profile);
    } catch (error) {
      console.error("Failed to load prayer:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPrivacyLabel = (privacy: string) => {
    switch (privacy) {
      case "private":
        return "Private";
      case "loved-ones":
        return "Loved Ones";
      case "public":
        return "Public";
      default:
        return "Private";
    }
  };
  return (
    <div className="pb-20 px-10 max-w-md mx-auto">
      <div className="py-4">
        <div className="flex items-center gap-2 mb-4 ">
          <span className="text-lg">📖</span>
          <h2>My Prayers(Journal)</h2>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Badge variant="secondary" className="text-sm">
            {profile?.prayerStreak || 0} Day Streak 🔥
          </Badge>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div>Loading prayers...</div>
          ) : prayers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No prayers yet</p>
              <p className="text-sm mt-2">
                Start your prayer journey by writing your first prayer
              </p>
            </div>
          ) : (
            prayers.map((prayer) => (
              <Card key={prayer.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-muted-foreground text-sm">
                      {formatDate(prayer.createdAt)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {getPrivacyLabel(prayer.privacy)}
                    </Badge>
                  </div>

                  <h3 className="mb-2">{prayer.title}</h3>

                  <p className="text-sm text-muted-foreground mb-4">
                    &quot;{prayer.content}&quot;
                  </p>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div>⬇️ Scroll to see past prayers...</div>
      </div>
    </div>
  );
};

export default MyPrayers;
