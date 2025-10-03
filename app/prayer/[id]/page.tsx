import PrayerClientPage from "@/components/PrayerClientPage";
import { getPrayer } from "@/lib/actions/prayerly.actions";
import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

interface PrayerSessionProps {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: PrayerSessionProps) => {
  const { id } = await params;
  const prayer = await getPrayer(id);
  const { title, content, privacy } = prayer as any;

  if (!title || !content || !privacy) {
    redirect("/home");
  }

  const user = currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return <PrayerClientPage prayer={{ ...prayer }} />;
};

export default Page;
