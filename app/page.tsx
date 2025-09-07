import PrayerBackground from "@/components/PrayerBackground";
import PrayerBenefits from "@/components/PrayerBenefits";
import PrayerExample from "@/components/PrayerExample";
import PrayerFooter from "@/components/PrayerFooter";
import PrayerlyHero from "@/components/PrayerlyHero";
import PrayerSecondHeadline from "@/components/PrayerSecondHeadline";
import PrayerSubHeadline from "@/components/PrayerSubHeadline";
import PrayerTestimonial from "@/components/PrayerTestimonial";

const page = () => {
  return (
    <main className="min-h-screen">
      <PrayerlyHero />
      <PrayerSubHeadline />
      <PrayerSecondHeadline />
      <PrayerBenefits />
      <PrayerExample />
      <PrayerBackground />
      <PrayerTestimonial />
      <PrayerFooter />
    </main>
  );
};

export default page;
