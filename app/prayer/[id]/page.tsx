import { getPrayer } from "@/lib/actions/prayerly.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface PrayerSessionProps {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: PrayerSessionProps) => {
  const { id } = await params;
  const prayer = await getPrayer(id);
  const { title, content, privacy } = prayer;

  const user = currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  if (!title || !content || !privacy) {
    redirect("/home");
  }

  return <div className="bg-white min-h-screen">page</div>;
};

export default page;
