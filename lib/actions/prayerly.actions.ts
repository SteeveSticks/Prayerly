"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";

type CreatePrayer = {
  title: string;
  content: string;
  privacy: string;
};

export const createPrayer = async (prayer: CreatePrayer) => {
  const { userId: author } = await auth();
  if (!author) throw new Error("Unauthorized");

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("prayer")
    .insert({
      author,
      title: prayer.title,
      content: prayer.content,
      privacy: prayer.privacy,
    })
    .select();

  if (error) {
    throw new Error(error?.message || "Failed to create prayer");
  }

  console.log(data);

  return data[0]; // return the newly created prayer
};

export const getPrayer = async (id: string) => {
  const supabase = createSupabaseClient();

  // Fetching a single prayer by ID
  const { data, error } = await supabase.from("prayer").select().eq("id", id);

  if (error) return console.log(error);

  return data[0];
};

export const getAllPrayers = async () => {
  const supabase = createSupabaseClient();

  const { data: prayers, error } = await supabase.from("prayer").select();

  if (error) {
    throw new Error(error?.message || "Failed to get prayers");
  }

  return prayers;
};

export const getUserPrayers = async (userId: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("prayer")
    .select()
    .eq("author", userId);

  if (error) {
    throw new Error(error?.message || "Failed to ge prayers");
  }

  return data;
};

export const getPrayerStreak = async (userId: string) => {
  const supabase = createSupabaseClient();

  // Get all prayer dates (just the day part, ordered newest first)
  const { data: prayers, error } = await supabase
    .from("prayer")
    .select("created_at")
    .eq("author", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error?.message || "Failed to get prayers streak");
  if (!prayers || prayers.length === 0) return 0;

  // Convert to unique days (using UTC to avoid timezone issues)
  const uniqueDays = new Set(
    prayers.map((p) => {
      const date = new Date(p.created_at);
      return `${date.getUTCFullYear()}-${String(
        date.getUTCMonth() + 1
      ).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
    })
  );

  // Sort days in descending order (newest first)
  const days = Array.from(uniqueDays).sort((a, b) => b.localeCompare(a));

  let streak = 1; // start at 1 since first day counts
  let prevDate = new Date(days[0] + "T00:00:00Z");

  for (let i = 1; i < days.length; i++) {
    const currentDate = new Date(days[i] + "T00:00:00Z");

    // difference in days
    const diff =
      (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      streak++; // consecutive day
      prevDate = currentDate;
    } else {
      break; // streak broken
    }
  }

  return streak;
};

export const addLovedOne = async (email: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("loved_ones")
    .insert({ email })
    .select();

  if (error) {
    throw new Error(error?.message || "Failed to add loved one");
  }

  return data[0];
};

// Replies (community chat under a prayer)
type CreateReply = {
  prayerId: string;
  content: string;
};

export type PrayerReply = {
  id: string;
  prayer_id: string;
  author: string;
  content: string;
  created_at: string;
  updated_at: string | null;
};

export const listReplies = async (prayerId: string): Promise<PrayerReply[]> => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("prayer_reply")
    .select()
    .eq("prayer_id", prayerId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error?.message || "Failed to get replies");
  }

  return (data as unknown as PrayerReply[]) || [];
};

export const createReply = async ({ prayerId, content }: CreateReply) => {
  const { userId: author } = await auth();
  if (!author) throw new Error("Unauthorized");

  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("prayer_reply")
    .insert({ prayer_id: prayerId, author, content })
    .select();

  if (error) {
    throw new Error(error?.message || "Failed to create reply");
  }

  return data?.[0] as PrayerReply;
};

export const updateReply = async (replyId: string, content: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = createSupabaseClient();
  // Ensure only author can update
  const { data, error } = await supabase
    .from("prayer_reply")
    .update({ content })
    .eq("id", replyId)
    .eq("author", userId)
    .select();

  if (error) {
    throw new Error(error?.message || "Failed to update reply");
  }

  return data?.[0] as PrayerReply;
};

export const deleteReply = async (replyId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = createSupabaseClient();
  const { error } = await supabase
    .from("prayer_reply")
    .delete()
    .eq("id", replyId)
    .eq("author", userId);

  if (error) {
    throw new Error(error?.message || "Failed to delete reply");
  }

  return { success: true } as const;
};

// Prayer Likes/Encouragements
export type PrayerLike = {
  id: string;
  prayer_id: string;
  user_id: string;
  created_at: string;
};

export const getPrayerLikes = async (prayerId: string): Promise<number> => {
  const supabase = createSupabaseClient();

  const { count, error } = await supabase
    .from("prayer_likes")
    .select("*", { count: "exact", head: true })
    .eq("prayer_id", prayerId);

  if (error) {
    throw new Error(error?.message || "Failed to get prayer likes");
  }

  return count || 0;
};

export const getUserLikedPrayer = async (
  prayerId: string
): Promise<boolean> => {
  const { userId } = await auth();
  if (!userId) return false;

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("prayer_likes")
    .select("id")
    .eq("prayer_id", prayerId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error?.message || "Failed to check if user liked prayer");
  }

  return !!data;
};

export const togglePrayerLike = async (
  prayerId: string
): Promise<{ liked: boolean; likeCount: number }> => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = createSupabaseClient();

  // Check if user already liked
  const { data: existingLike } = await supabase
    .from("prayer_likes")
    .select("id")
    .eq("prayer_id", prayerId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from("prayer_likes")
      .delete()
      .eq("prayer_id", prayerId)
      .eq("user_id", userId);

    if (error) {
      throw new Error(error?.message || "Failed to unlike prayer");
    }
  } else {
    // Like
    const { error } = await supabase
      .from("prayer_likes")
      .insert({ prayer_id: prayerId, user_id: userId });

    if (error) {
      throw new Error(error?.message || "Failed to like prayer");
    }
  }

  // Get updated like count
  const likeCount = await getPrayerLikes(prayerId);
  return { liked: !existingLike, likeCount };
};

// Prayer CRUD operations
export const updatePrayer = async (
  prayerId: string,
  updates: { title?: string; content?: string; privacy?: string }
) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = createSupabaseClient();

  // Ensure only the author can update
  const { data, error } = await supabase
    .from("prayer")
    .update(updates)
    .eq("id", prayerId)
    .eq("author", userId)
    .select();

  if (error) {
    throw new Error(error?.message || "Failed to update prayer");
  }

  return data?.[0];
};

export const deletePrayer = async (prayerId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = createSupabaseClient();

  // Ensure only the author can delete
  const { error } = await supabase
    .from("prayer")
    .delete()
    .eq("id", prayerId)
    .eq("author", userId);

  if (error) {
    throw new Error(error?.message || "Failed to delete prayer");
  }

  return { success: true } as const;
};
