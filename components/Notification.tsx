import { BookOpen, Clock, Heart, MessageCircle } from "lucide-react";
import React from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const Notification = () => {
  const notifications = [
    {
      id: 1,
      type: "reminder",
      icon: <Clock size={16} />,
      title: "Reminder: Pray for Sarah today",
      description: "You promised to pray for Sarah's job interview.",
      time: "9:00 AM",
      unread: true,
    },
    {
      id: 2,
      type: "prayer",
      icon: <MessageCircle size={16} />,
      title: "John shared a new prayer",
      description: 'John shared: "Thank you Lord for the healing..."',
      time: "2h ago",
      unread: true,
    },
    {
      id: 3,
      type: "verse",
      icon: <BookOpen size={16} />,
      title: "Daily Verse ready",
      description: '"The Lord is my light and my salvation..."',
      time: "6:00 AM",
      unread: false,
    },
    {
      id: 4,
      type: "encouragement",
      icon: <Heart size={16} />,
      title: "Sarah encouraged your prayer",
      description: "Sarah sent love and encouragement on your prayer.",
      time: "1d ago",
      unread: false,
    },
    {
      id: 5,
      type: "prayer",
      icon: <MessageCircle size={16} />,
      title: "Mom requested prayer",
      description: "Mom shared a new prayer request with the family circle.",
      time: "1d ago",
      unread: false,
    },
    {
      id: 6,
      type: "reminder",
      icon: <Clock size={16} />,
      title: "Weekly prayer reminder",
      description: "Don't forget your weekly reflection time.",
      time: "2d ago",
      unread: false,
    },
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case "reminder":
        return "text-blue-500";
      case "prayer":
        return "text-green-500";
      case "verse":
        return "text-purple-500";
      case "encouragement":
        return "text-pink-500";
      default:
        return "text-muted-foreground";
    }
  };
  return (
    <div className="pb-20 px-3 max-w-md mx-auto">
      <div className="py-4">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-lg">🔔</span>
          <h2>Notifications</h2>
          <Badge variant="secondary" className="ml-auto">
            {notifications.filter((n) => n.unread).length}
          </Badge>
        </div>

        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`${
                notification.unread ? "border-primary/20 bg-primary/6" : ""
              }`}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-full bg-muted ${getIconColor(
                      notification.type
                    )}`}
                  >
                    {notification.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h5>{notification.title}</h5>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-1 ml-2" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                      {notification.type === "prayer" && (
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      )}
                      {notification.type === "reminder" && (
                        <Button size="sm" variant="ghost">
                          Done
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center py-4 text-muted-foreground">
          <p className="text-sm">You&apos;re all caught up! 🙏</p>
        </div>
      </div>
    </div>
  );
};

export default Notification;
