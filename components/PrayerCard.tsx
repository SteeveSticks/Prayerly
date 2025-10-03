import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";

interface PrayerCardProps {
  id: string;
  title: string;
  content: string;
  privacy: string;
  created_at: string;
}

const PrayerCard = ({
  id,
  title,
  content,
  privacy,
  created_at,
}: PrayerCardProps) => {
  const user = useUser();

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
    <div>
      <Card>
        <CardContent className="">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-primary">
              {user.user?.fullName || "Unknown"}
            </span>
            <span className="text-sm text-muted-foreground">
              ({"Community"})
            </span>
            <span className="text-lg ml-auto">✨</span>
          </div>
          <h4 className="text-sm mb-1">{title}</h4>
          <p className="text-sm mb-3 text-muted-foreground">
            &quot;{content}&quot;
          </p>

          <div className="flex gap-2">
            <Link href={`prayer/${id}`}>
              <Button size="sm" variant="outline" className="cursor-pointer">
                <MessageCircle size={14} className="mr-1" />
                <span>Let&apos;s Pray</span>
              </Button>
            </Link>

            <Button size="sm" variant="outline" className="cursor-pointer">
              <Heart size={14} className="mr-1" />
              <span>❤️ Encourage</span>
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            {formatTimeAgo(created_at)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrayerCard;
