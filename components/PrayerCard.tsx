import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  getPrayerLikes,
  getUserLikedPrayer,
  togglePrayerLike,
} from "@/lib/actions/prayerly.actions";

interface PrayerCardProps {
  id: string;
  title: string;
  content: string;
  privacy: string;
  created_at: string;
}

const PrayerCard = ({ id, title, content, created_at }: PrayerCardProps) => {
  const { user } = useUser();
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `${diffDays}d`;
    if (diffHours > 0) return `${diffHours}h`;
    if (diffMinutes > 0) return `${diffMinutes}m`;
    return "now";
  };

  // Load like data
  useEffect(() => {
    const loadLikeData = async () => {
      try {
        const [count, liked] = await Promise.all([
          getPrayerLikes(id),
          getUserLikedPrayer(id),
        ]);
        setLikeCount(count);
        setIsLiked(liked);
      } catch (error) {
        console.error("Failed to load like data:", error);
      }
    };

    loadLikeData();
  }, [id]);

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      const result = await togglePrayerLike(id);
      setLikeCount(result.likeCount);
      setIsLiked(result.liked);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setIsLiking(false);
    }
  };
  return (
    <div className="border-b border-border/50 hover:bg-muted/30 transition-colors">
      <div className="p-4">
        {/* Header with Avatar and User Info */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
            <AvatarFallback>
              {(user?.fullName || "U").slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">
                {user?.fullName || "Anonymous"}
              </span>
              <span className="text-muted-foreground text-sm">
                @{user?.username || "user"}
              </span>
              <span className="text-muted-foreground text-sm">·</span>
              <span className="text-muted-foreground text-sm">
                {formatTimeAgo(created_at)}
              </span>
              <div className="ml-auto">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal size={16} />
                </Button>
              </div>
            </div>

            {/* Prayer Content */}
            <div className="space-y-2">
              <h3 className="font-semibold text-base">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {content}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between max-w-md ml-13">
          <Link href={`/prayer/${id}`}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
            >
              <MessageCircle size={16} className="mr-2" />
              <span className="text-sm">Let&apos;s Pray</span>
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLike}
            disabled={isLiking}
            className={`h-8 px-3 cursor-pointer ${
              isLiked
                ? "text-red-600 hover:text-red-600"
                : "hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            }`}
          >
            <Heart
              size={16}
              className={`mr-2 ${isLiked ? "fill-current" : ""}`}
            />
            <span className="text-sm">{likeCount || ""}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/20 dark:hover:text-green-400"
          >
            <Share2 size={16} className="mr-2" />
            <span className="text-sm">Share</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrayerCard;
