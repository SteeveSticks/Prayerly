import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

const PrayerSecondHeadline = () => {
  return (
    <article className="flex flex-col items-center justify-center">
      <div>
        <div className="flex flex-col items-center justify-center text-center text-white pt-20">
          <p className="text-xs mb-2">SECOND HEADLINE</p>
          <h2 className="text-2xl font-semibold">
            JOIN US IN PRAYER AND COMMUNITY
          </h2>
        </div>

        <div className="flex items-center justify-center px-14 py-8 text-white">
          <p className="text-[15px] text-center text-gray-200 max-w-2xl text-wrap">
            Prayerly is more than just a platform; it’s a community where faith
            and fellowship come together. Join us in our mission to spread love,
            hope, and inspiration through the power of prayer. Every day, you’ll
            receive uplifting prayers and scriptures designed to strengthen your
            spirit, guide your journey, and remind you that you’re never alone.
          </p>
        </div>

        <Link href="/sign-up">
          <Button className="bg-[#FFD2A4] text-[#161722] hover:bg-[#FFB07C] cursor-pointer mx-auto flex py-4 px-6">
            Sign up
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-center gap-6 mt-10">
        <img src="/images/prayerImage.png" alt="Prayer Community Image" />
        <img src="/images/prayerBible.png" alt="Prayer Community Image" />
        <img src="/images/CommunityPrayer.png" alt="Prayer Community Image" />
      </div>
    </article>
  );
};

export default PrayerSecondHeadline;
