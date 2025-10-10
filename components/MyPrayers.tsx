"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  getPrayerStreak,
  getUserPrayers,
  deletePrayer,
} from "@/lib/actions/prayerly.actions";
import { useUser } from "@clerk/nextjs";
import EditPrayerModal from "./EditPrayerModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const MyPrayers = () => {
  const user = useUser();
  const [prayers, setPrayers] = useState<
    Array<{
      id: string;
      title: string;
      content: string;
      privacy: string;
      created_at: string;
    }>
  >([]);
  const [prayerStreak, setPrayerStreak] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [editingPrayer, setEditingPrayer] = useState<{
    id: string;
    title: string;
    content: string;
    privacy: string;
  } | null>(null);

  const loadPrayers = useCallback(async () => {
    if (!user.user?.id) {
      console.error("User ID is undefined");
      return;
    }
    try {
      const prayersData = await getUserPrayers(user.user.id);
      setPrayers(prayersData);
    } catch (error) {
      console.error("Failed to load prayer:", error);
    } finally {
      setLoading(false);
    }
  }, [user.user?.id]);

  const getPrayerStreakValue = async (userId: string) => {
    try {
      const streak = await getPrayerStreak(userId);
      setPrayerStreak(streak);
    } catch (error) {
      console.error("Failed to get prayer streak:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadPrayers();
    if (user.user?.id) {
      getPrayerStreakValue(user.user.id);
    }
  }, [user.user?.id, loadPrayers]);

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

  const handleEditPrayer = (prayer: {
    id: string;
    title: string;
    content: string;
    privacy: string;
  }) => {
    setEditingPrayer(prayer);
  };

  const handleDeletePrayer = async (prayerId: string) => {
    try {
      await deletePrayer(prayerId);
      // Refresh the prayers list
      await loadPrayers();
    } catch (error) {
      console.error("Failed to delete prayer:", error);
    }
  };

  const handlePrayerUpdated = async () => {
    // Refresh the prayers list after editing
    await loadPrayers();
  };
  return (
    <div className="pb-20 px-3 max-w-md mx-auto">
      <div className="py-4">
        <div className="flex items-center gap-2 mb-4 ">
          <span className="text-lg">📖</span>
          <h2>My Prayers(Journal)</h2>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Badge variant="secondary" className="text-sm">
            {prayerStreak} Day{prayerStreak > 1 ? "s" : ""} Streak 🔥
          </Badge>
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
                <CardContent className="">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-muted-foreground text-sm">
                      {formatDate(prayer.created_at)}
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
                    <Button
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => handleEditPrayer(prayer)}
                    >
                      <Edit size={14} className="mr-1 cursor-pointer" />
                      Edit
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Prayer</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this prayer? This
                            action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" className="cursor-pointer">
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleDeletePrayer(prayer.id)}
                            className="bg-red-600 hover:bg-red-700 cursor-pointer"
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="text-center py-2 mt-2 text-muted-foreground">
          ⬇️ Scroll to see past prayers...
        </div>
      </div>

      {/* Edit Prayer Modal */}
      {editingPrayer && (
        <EditPrayerModal
          prayer={editingPrayer}
          onClose={() => setEditingPrayer(null)}
          onSave={handlePrayerUpdated}
        />
      )}
    </div>
  );
};

export default MyPrayers;
