import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Heart, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  createReply,
  deleteReply,
  listReplies,
  updateReply,
  type PrayerReply,
} from "@/lib/actions/prayerly.actions";
import { createClientSupabase } from "@/lib/supabase-client";
import { useUser } from "@clerk/nextjs";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import PrayerCard from "./PrayerCard";

interface PrayerCardProps {
  id: string;
  title: string;
  content: string;
  privacy: string;
  created_at: string;
}

const ChatCard = ({ id, title, content, created_at }: PrayerCardProps) => {
  const { user } = useUser();
  const router = useRouter();
  const [, setReplies] = useState<PrayerReply[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [optimisticReplies, setOptimisticReplies] = useState<PrayerReply[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);

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
  const canEditOrDelete = (reply: PrayerReply) => reply.author === user?.id;

  const loadReplies = async () => {
    try {
      const data = await listReplies(id);
      setReplies(data);
      setOptimisticReplies(data);
      // Scroll to bottom after load
      setTimeout(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
      }, 0);
    } catch (e) {
      console.error(e);
    }
  };

  // Set up realtime subscription
  useEffect(() => {
    loadReplies();

    const supabase = createClientSupabase();
    const channel = supabase
      .channel(`prayer_replies_${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "prayer_reply",
          filter: `prayer_id=eq.${id}`,
        },
        (payload) => {
          console.log("Realtime update:", payload);
          loadReplies(); // Refresh on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSend = async () => {
    if (!newMessage.trim() || isReplying) return;

    const messageContent = newMessage.trim();
    setNewMessage("");
    setIsReplying(true);

    // Optimistic update
    const tempReply: PrayerReply = {
      id: `temp-${Date.now()}`,
      prayer_id: id,
      author: user?.id || "", // Ensure author is a string
      content: messageContent,
      created_at: new Date().toISOString(),
      updated_at: null,
    };

    setOptimisticReplies((prev) => [...prev, tempReply]);

    try {
      await createReply({ prayerId: id, content: messageContent });
      await loadReplies(); // Refresh to get real data
    } catch (e) {
      console.error(e);
      // Revert optimistic update on error
      setOptimisticReplies((prev) => prev.filter((r) => r.id !== tempReply.id));
      setNewMessage(messageContent); // Restore message
    } finally {
      setIsReplying(false);
    }
  };

  const beginEdit = (reply: PrayerReply) => {
    setEditingId(reply.id);
    setEditingContent(reply.content);
  };

  const saveEdit = async () => {
    if (!editingId) return;

    const newContent = editingContent.trim();
    setIsLoading(true);

    // Optimistic update
    setOptimisticReplies((prev) =>
      prev.map((r) =>
        r.id === editingId
          ? { ...r, content: newContent, updated_at: new Date().toISOString() }
          : r
      )
    );

    try {
      await updateReply(editingId, newContent);
      setEditingId(null);
      setEditingContent("");
      await loadReplies(); // Refresh to get real data
    } catch (e) {
      console.error(e);
      // Revert optimistic update on error
      await loadReplies();
    } finally {
      setIsLoading(false);
    }
  };

  const removeReply = async (replyId: string) => {
    setIsLoading(true);

    // Optimistic update
    const originalReplies = [...optimisticReplies];
    setOptimisticReplies((prev) => prev.filter((r) => r.id !== replyId));

    try {
      await deleteReply(replyId);
      await loadReplies(); // Refresh to get real data

      toast.success("Reply deleted");
    } catch (e) {
      console.error(e);
      // Revert optimistic update on error
      setOptimisticReplies(originalReplies);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Responsive Header */}
      <div className="flex items-center justify-between sticky top-0 bg-background border-b border-border z-40 px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="cursor-pointer"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-lg font-semibold text-primary">Prayer Chat</h1>
        <div className="w-8" /> {/* Spacer for centering */}
      </div>

      {/* Prayer Card */}
      <div className="px-4 py-4 max-w-md mx-auto">
        <PrayerCard
          id={id}
          title={title}
          content={content}
          created_at={created_at}
          privacy={"true"}
        />
      </div>

      {/* <div className="px-4 py-4 max-w-md mx-auto">
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Avatar>
                <AvatarImage
                  src={user?.imageUrl}
                  alt={user?.fullName || "Avatar"}
                />
                <AvatarFallback>
                  {(user?.fullName || "U").slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-primary">
                {user?.fullName || "Unknown"}
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
              <Button size="sm" variant="outline" className="cursor-pointer">
                <MessageCircle size={14} className="mr-1" />
                <span>Let&apos;s Pray</span>
              </Button>

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
      </div> */}

      {/* Message Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex flex-col sm:flex-row p-4 gap-2 border-t-[1px] border-border pb-10 px-4 max-w-md mx-auto"
      >
        <Textarea
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={isReplying}
          className="w-full bg-[#00000040] dark:bg-[#ffffff14] rounded-lg px-3 py-2"
        />
        <Button
          type="submit"
          disabled={!newMessage.trim() || isReplying}
          className="relative top-6 mt-4 sm:mt-0 sm:ml-0 text-white max-h-12 cursor-pointer"
        >
          {isReplying ? "Replying..." : "Reply"}
        </Button>
      </form>

      {/* Main chat */}
      <div ref={listRef} className="max-w-md mx-auto px-4 space-y-5 pb-22">
        {optimisticReplies.map((r) => (
          <div key={r.id} className="grid">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={user?.imageUrl || undefined}
                    alt={user?.fullName || "User"}
                  />
                  <AvatarFallback>
                    {(user?.fullName || "U").slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {user?.fullName || "Unknown"}
                </span>
                <div className="text-xs text-muted-foreground">
                  {formatTimeAgo(r.created_at)}
                </div>
              </div>

              {canEditOrDelete(r) && editingId !== r.id && (
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => beginEdit(r)}
                    disabled={isLoading}
                    className="cursor-pointer"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeReply(r.id)}
                    disabled={isLoading}
                    className="cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex-1">
              {editingId === r.id ? (
                <div className="mt-1 ml-10">
                  <input
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    className="w-full bg-[#00000020] dark:bg-[#ffffff14] rounded px-2 py-1"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      onClick={saveEdit}
                      disabled={isLoading}
                      className="cursor-pointer"
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                      disabled={isLoading}
                      className="cursor-pointer"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-1 ml-10">{r.content}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatCard;
