import { Radio, BriefcaseBusiness, HandHeart } from "lucide-react";
import Image from "next/image";
import React from "react";

const PrayerSubHeadline = () => {
  return (
    <article className="pt-20">
      <div className="flex flex-col items-center justify-center text-center text-white">
        <p className="text-xs mb-2">SUB-HEADLINE</p>
        <h2 className="text-2xl font-semibold pb-10">
          A PRAYER COMMUNITY THAT IS RELEVANT
        </h2>
      </div>

      <div className="flex items-center justify-center gap-3 px-14 py-10 text-white">
        <div className="p-10 bg-gray-900 space-y-4">
          <HandHeart className="bg-[#FFD2A4] p-2 rounded-full size-9" />

          <h2 className="font-semibold">ABOUT US</h2>
          <p className="text-[15px] text-gray-200">
            We are a community of believers who come together to share prayers,
            stories, and inspiration. Our mission is to uplift and support each
            other through the power of prayer.
          </p>
        </div>

        <div className="p-10 bg-gray-900 space-y-4">
          <BriefcaseBusiness className="bg-[#FFD2A4] p-2 rounded-full size-9" />

          <h2 className="font-semibold">OUR MISSION</h2>
          <p className="text-[15px] text-gray-200">
            To create a space where individuals can connect, share, and grow in
            their faith through prayer and community support.
          </p>
        </div>

        <div className="p-10 bg-gray-900 space-y-4">
          <Radio className="bg-[#FFD2A4] p-2 rounded-full size-9" />

          <h2 className="font-semibold">GETING INVOLVED</h2>
          <p className="text-[15px] text-gray-200">
            Sign up to our mission to spread love, hope, and inspiration. Get
            involved by sharing your prayers, stories, and experiences with our
            community.
          </p>
        </div>
      </div>
    </article>
  );
};

export default PrayerSubHeadline;
