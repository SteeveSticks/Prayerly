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
