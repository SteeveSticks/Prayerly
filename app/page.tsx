import PrayerlyHero from "@/components/PrayerlyHero";
import PrayerSecondHeadline from "@/components/PrayerSecondHeadline";
import PrayerSubHeadline from "@/components/PrayerSubHeadline";

const page = () => {
  return (
    <main className="min-h-screen">
      <PrayerlyHero />
      <PrayerSubHeadline />
      <PrayerSecondHeadline />
    </main>
  );
};

export default page;
