import PrayerBackground from "@/components/PrayerBackground";
import PrayerBenefits from "@/components/PrayerBenefits";
import PrayerExample from "@/components/PrayerExample";
import PrayerlyHero from "@/components/PrayerlyHero";
import PrayerSecondHeadline from "@/components/PrayerSecondHeadline";
import PrayerSubHeadline from "@/components/PrayerSubHeadline";

const page = () => {
  return (
    <main className="min-h-screen">
      <PrayerlyHero />
      <PrayerSubHeadline />
      <PrayerSecondHeadline />
      <PrayerBenefits />
      <PrayerExample />
      <PrayerBackground />
    </main>
  );
};

export default page;
