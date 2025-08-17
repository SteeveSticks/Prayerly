import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import { Quote } from "lucide-react";
import Link from "next/link";

const PrayerBackground = () => {
  return (
    <div className="py-20">
      <div className="relative">
        <Image
          src="/images/Background.png"
          alt="Prayer Background"
          width={1500}
          height={736}
          className="w-full h-auto -z-10"
        />

        <div className="flex items-center justify-center absolute inset-0 bg-white max-w-[34rem] max-h-[20rem] text-left top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-10 gap-20">
          <div className="flex flex-col items-center justify-start text-left space-y-4">
            <h2 className="text-2xl font-bold text-black leading-normal  ">
              WE WANT TO HELP THE WORLD
            </h2>
            <p className="text-xs text-gray-500 text-wrap">
              Come together to share prayers,stories, and inspiration. Our
              mission is to uplift and support each other
            </p>

            <Link href="/sign-up">
              <Button className="bg-[#FFD2A4] text-[#161722] hover:bg-[#FFB07C] cursor-pointer mr-45 px-6">
                Sign up
              </Button>
            </Link>
          </div>

          <div className="">
            <Quote className="text-6xl size-32 text-[#FFF5EB]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrayerBackground;
