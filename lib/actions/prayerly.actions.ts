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
